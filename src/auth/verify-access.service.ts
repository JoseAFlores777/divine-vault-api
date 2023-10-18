import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SanitizedUserDto_response } from 'src/user/dto';
import { UserDocument } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RefreshToken_response, Tokens } from './dto';

@Injectable()
export class VerifyAccessService {
  private readonly logger = new Logger(VerifyAccessService.name);

  private readonly ACCESS_TOKEN_EXP = '30m';
  private readonly REFRESH_TOKEN_EXP = '7d';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async getTokensAndRenew(user: UserDocument): Promise<Tokens> {
    const tokens = await this.getNewTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async getNewTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.ACCESS_TOKEN_EXP,
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.REFRESH_TOKEN_EXP,
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
    const tokens = await this.getNewTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return new RefreshToken_response(new SanitizedUserDto_response(user), tokens);
  }
}
