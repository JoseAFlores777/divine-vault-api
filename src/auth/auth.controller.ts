import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { LoginDTO_request, RegisterDTO_request, RegisterDTO_response } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signup(@Body() data: RegisterDTO_request): Promise<RegisterDTO_response> {
    return this.authService.signUp(data);
  }

  @Post('login')
  signin(@Body() data: LoginDTO_request) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
