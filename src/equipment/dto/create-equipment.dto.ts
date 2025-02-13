import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({ default: 'Equipment test from Swagger' })
  name: string;

  @ApiProperty({ default: 1 })
  quantity: number;
}
