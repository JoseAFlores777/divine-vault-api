import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // async signPayload(payload: any) {
  //   return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  // }

  // async validateUser(payload: any) {
  //   console.log({payload});
  //   return await this.userService.findByPayload(payload);
  // }

  async signUp(registerDTO: RegisterDTO): Promise<any> {
    const newUser = await this.userService.create({ ...registerDTO });

    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return { user: newUser, tokens };
  }

  async signIn(data: LoginDTO) {
    // Check if user exists
    const user = await this.userService.findByUsernameAndEmail(data);

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return { user: this.sanitizeUser(user), tokens };
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

  async getTokens(userId: string, username: string) {
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied1');
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied2');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    delete sanitized['createdAt'];
    delete sanitized['updatedAt'];
    delete sanitized['__v'];
    return sanitized;
  }
}
