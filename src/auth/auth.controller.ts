import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  signup(@Body() registerDTO: RegisterDTO) {
    return this.authService.signUp(registerDTO);
  }

  @Post('signin')
  signin(@Body() data: LoginDTO) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  //   @Post('register')
  //   async register(@Body() registerDTO: RegisterDTO) {
  //     const user = await this.userService.create({ ...registerDTO });

  //     return { user };
  //   }

  //   @Post('login')
  //   async login(@Body() loginDTO: LoginDTO) {
  //     const user = await this.userService.findByLogin(loginDTO);
  //     const payload = {
  //       email: user.email,
  //     };
  //     const token = await this.authService.signPayload(payload);
  //     return { user, token };
  //   }

  //   @Get("/onlyauth")
  //   @UseGuards(AuthGuard("jwt"))

  //    async hiddenInformation(){
  //      return  "hidden information";
  //    }

  //  @Get("/anyone")

  //  async publicInformation(){
  //  return  "this can be seen by anyone";
  //  }
}
