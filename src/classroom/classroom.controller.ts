import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../role/guards/role.guard';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../enum/role.enum';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @ApiBody({ type: CreateClassroomDto })
  @Roles(Role.Admin)
  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Roles(Role.User)
  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Roles(Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOneById(+id);
  }

  @ApiBody({ type: UpdateClassroomDto })
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassroomDto: UpdateClassroomDto) {
    return this.classroomService.update(+id, updateClassroomDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomService.remove(+id);
  }
}
