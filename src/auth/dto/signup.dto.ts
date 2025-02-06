import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ default: 'user1@test.com' })
  email: string;

  @ApiProperty({ default: 'password' })
  password: string;

  @ApiProperty({ default: 'John' })
  firstName: string;

  @ApiProperty({ default: 'Doe' })
  lastName: string;
}
