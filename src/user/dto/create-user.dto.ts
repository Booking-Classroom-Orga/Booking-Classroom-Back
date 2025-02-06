import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'user.swagger@test.com',
  })
  email: string;

  @ApiProperty({
    default: 'password',
  })
  password: string;

  @ApiProperty({
    default: 'John',
  })
  firstName: string;

  @ApiProperty({
    default: 'Doe',
  })
  lastName: string;
}
