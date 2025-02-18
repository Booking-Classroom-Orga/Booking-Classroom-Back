import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({ default: 'Test' })
  name: string;

  @ApiProperty({ default: 1 })
  quantity: number;
}
