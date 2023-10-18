import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

import { SanitizedUserDto_response } from 'src/user/dto';
import {
  LoginDTO_request,
  LoginDTO_response,
  RegisterDTO_request,
  RegisterDTO_response,
} from './dto';
import { VerifyAccessService } from './verify-access.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly erifyAccessService: VerifyAccessService
  ) {}

  async signUp(data: RegisterDTO_request): Promise<RegisterDTO_response> {
    const newUser = await this.userService.create({ ...data });
    const tokens = await this.erifyAccessService.getTokensAndRenew(newUser);
    const sanitizedUser = new SanitizedUserDto_response(newUser);
    return new RegisterDTO_response(sanitizedUser, tokens);
  }

  async signIn(data: LoginDTO_request) {
    if (!data.email && !data.username) {
      throw new BadRequestException('You need to set an email or username.');
    }
    const user = await this.userService.findByUsernameAndEmail(data.username, data.email);
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');
    const tokens = await this.erifyAccessService.getTokensAndRenew(user);
    const verifiedUser = new SanitizedUserDto_response(user);
    return new LoginDTO_response(verifiedUser, tokens);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    return this.erifyAccessService.refreshTokens(userId, refreshToken);
  }
}
