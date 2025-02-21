import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';
import { EquipmentService } from '../equipment/equipment.service';
import { ReservationEntity } from '../reservation/entities/reservation.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    private readonly equipmentService: EquipmentService,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const equipment = await this.equipmentService.findManyById(createClassroomDto.equipmentId);

    const classroom = this.classroomRepository.create({
      ...createClassroomDto,
      equipment,
    });

    return await this.classroomRepository.save(classroom);
  }

  findAll(): Promise<ClassroomEntity[]> {
    return this.classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.equipment', 'equipment')
      .getMany();
  }

  async findOneById(id: number): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.equipment', 'equipment')
      .where('classroom.id = :id', { id })
      .getOne();

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async findByAvailability(isAvailable: boolean): Promise<ClassroomEntity[]> {
    const classroom = await this.classroomRepository.find({ where: { isAvailable } });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    return classroom;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto): Promise<any> {
    const classroom = await this.findOneById(id);

    const equipment = await this.equipmentService.findManyById(updateClassroomDto.equipmentId);

    const updateClassroom = {
      ...classroom,
      ...updateClassroomDto,
      equipment,
    };

    await this.classroomRepository.update(id, updateClassroom);

    return updateClassroom;
  }

  async remove(id: number): Promise<any> {
    const classroom = await this.classroomRepository.findOne({ where: { id } });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    await this.reservationRepository.softDelete({ classroom });

    return this.classroomRepository.softDelete(id);
  }
}
