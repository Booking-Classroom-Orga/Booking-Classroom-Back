import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentEntity } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRepository: Repository<EquipmentEntity>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    return await this.equipmentRepository.save(createEquipmentDto);
  }

  findAll(): Promise<EquipmentEntity[]> {
    return this.equipmentRepository.createQueryBuilder().getMany();
  }

  async findOneById(id: number): Promise<EquipmentEntity> {
    const equipment = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.id = :id', { id })
      .getOne();

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  async findByName(name: string): Promise<EquipmentEntity> {
    const equipment = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.name = :name', { name })
      .getOne();

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<any> {
    const equipment = await this.findOneById(id);

    const updateEquipment = {
      ...equipment,
      ...updateEquipmentDto,
    };

    await this.equipmentRepository.update(id, updateEquipment);

    return updateEquipment;
  }

  async remove(id: number): Promise<any> {
    await this.findOneById(id);

    return this.equipmentRepository.softDelete(id);
  }
}
