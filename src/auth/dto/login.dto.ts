import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: 'user1@test.com' })
  email: string;

  @ApiProperty({ default: 'password' })
  password: string;
}
