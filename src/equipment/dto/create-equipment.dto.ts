import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;
}
