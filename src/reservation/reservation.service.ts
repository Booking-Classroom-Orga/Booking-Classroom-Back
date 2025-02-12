import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const reservation = await this.reservationRepository.save(createReservationDto);

    return reservation;
  }

  findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.createQueryBuilder().getMany();
  }

  async findOneById(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.id = :id', { id })
      .getOne();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async findByUser(userId: number): Promise<ReservationEntity[]> {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId })
      .getMany();

    if (!reservation) {
      throw new NotFoundException('User not found');
    }

    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<any> {
    const reservation = await this.findOneById(id);

    const updateReservation = {
      ...reservation,
      ...updateReservationDto,
    };

    await this.reservationRepository.update(id, updateReservation);

    return updateReservation;
  }

  async remove(id: number): Promise<any> {
    await this.findOneById(id);

    return this.reservationRepository.softDelete(id);
  }
}
