import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('verify-code')
  verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body);
  }
}
