import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create-equipment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {
  @ApiProperty()
  id: number;
}
