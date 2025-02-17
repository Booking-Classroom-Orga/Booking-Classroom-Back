import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty({
    default: 'Classroom test from Swagger',
  })
  name: string;

  @ApiProperty({
    default: 16,
  })
  capacity: number;

  @ApiProperty()
  equipmentId: number[];

  @ApiProperty({
    default: true,
  })
  isAvailable: boolean;
}
