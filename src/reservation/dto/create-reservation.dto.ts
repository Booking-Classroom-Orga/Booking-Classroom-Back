import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  classroomId: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;
}
