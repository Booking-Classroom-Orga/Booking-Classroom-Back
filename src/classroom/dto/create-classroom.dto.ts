import { ApiProperty } from '@nestjs/swagger';
import { ReservationEntity } from '../../reservation/entities/reservation.entity';

export class CreateClassroomDto {
  @ApiProperty({
    default: 'Classroom test from Swagger',
  })
  name: string;

  @ApiProperty({
    default: 16,
  })
  capacity: number;

  @ApiProperty({
    default: ['Equipment 1 test', 'Equipment 2 test'],
  })
  equipment: object;

  @ApiProperty({
    default: [],
  })
  reservations: ReservationEntity[];
}
