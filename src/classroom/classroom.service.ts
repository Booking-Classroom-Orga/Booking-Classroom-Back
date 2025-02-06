import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const classroom = await this.classroomRepository.save(createClassroomDto);

    return classroom;
  }

  findAll(): Promise<ClassroomEntity[]> {
    return this.classroomRepository.createQueryBuilder().getMany();
  }

  async findOneById(id: number): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository
      .createQueryBuilder('classroom')
      .where('classroom.id = :id', { id })
      .getOne();

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async update(
    id: number,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<any> {
    const classroom = await this.findOneById(id);

    const updateClassroom = {
      ...classroom,
      ...updateClassroomDto,
    };

    await this.classroomRepository.update(id, updateClassroom);

    return updateClassroom;
  }

  async remove(id: number): Promise<any> {
    await this.findOneById(id);

    return this.classroomRepository.softDelete(id);
  }
}
