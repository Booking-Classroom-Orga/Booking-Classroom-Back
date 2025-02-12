import { ApiProperty } from '@nestjs/swagger';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';

export class CreateReservationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty({
    default: () => 'CURRENT_DATE',
  })
  date: Date;

  @ApiProperty({
    default: () => 'CURRENT_TIME',
  })
  startTime: string;

  @ApiProperty({
    default: () => 'CURRENT_TIME',
  })
  endTime: string;

  @ApiProperty({})
  classroom: ClassroomEntity;
}
