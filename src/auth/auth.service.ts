import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Check if user exist
    const user = await this.userService.findOneByEmail(loginDto.email);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      id: user.id,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    // Crypt password
    const password = await bcrypt.hash(signupDto.password, 10);
    signupDto.password = password;

    // Create user
    return this.userService.create(signupDto);
  }
}
