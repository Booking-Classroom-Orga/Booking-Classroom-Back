import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from './create-classroom.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {
  @ApiProperty()
  id: number;
}
