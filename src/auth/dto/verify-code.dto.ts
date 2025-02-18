import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({ default: 'user1@test.com' })
  email: string;

  @ApiProperty({ default: '123456' })
  code: string;
}