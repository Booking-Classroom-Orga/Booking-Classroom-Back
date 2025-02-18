import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;
}
