import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await this.userService.update(user.id, user);

    try {
      await this.mailService.sendVerificationMail(user, verificationCode);
    } catch (error) {
      throw new InternalServerErrorException("The mail couldn't be send", error);
    }

    return { message: 'Verification code sent to your email' };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const user = await this.userService.findOneByEmail(verifyCodeDto.email);
    if (!user || user.verificationCode !== verifyCodeDto.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    user.verificationCode = null;
    await this.userService.update(user.id, user);

    const payload = {
      id: user.id,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async signup(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
