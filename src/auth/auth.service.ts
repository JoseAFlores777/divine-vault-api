import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

import { CreateUserDto_response, SanitizedUserDto_response } from 'src/user/dto';
import {
  LoginDTO_request,
  LoginDTO_response,
  RefreshToken_response,
  RegisterDTO_request,
  RegisterDTO_response,
  Tokens,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(registerDTO: RegisterDTO_request): Promise<RegisterDTO_response> {
    const newUser = await this.userService.create({ ...registerDTO });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return new RegisterDTO_response(newUser, tokens);
  }

  async signIn(data: LoginDTO_request) {
    if (!data.email && !data.username) {
      throw new BadRequestException('You need to set an email or username.');
    }
    const user = await this.userService.findByUsernameAndEmail(data.username, data.email);
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const verifiedUser = new CreateUserDto_response(user);
    return new LoginDTO_response(verifiedUser, tokens);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30m',
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<RefreshToken_response> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return new RefreshToken_response(new SanitizedUserDto_response(user), tokens);
  }
}
