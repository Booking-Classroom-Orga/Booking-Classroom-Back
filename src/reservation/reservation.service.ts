import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<ReservationEntity> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: createReservationDto.classroom },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    await this.validateReservation(createReservationDto, classroom);

    const user = await this.userService.findOneById(createReservationDto.userId);

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      classroom,
      user,
    });

    try {
      await this.mailService.sendCreateMail(user, classroom, reservation);
    } catch (error) {
      throw new InternalServerErrorException("The mail couldn't be sent", error);
    }

    return await this.reservationRepository.save(reservation);
  }

  private async validateReservation(
    createReservationDto: CreateReservationDto,
    classroom: ClassroomEntity,
  ): Promise<void> {
    const newReservationStart = new Date(createReservationDto.startTime);
    const newReservationEnd = new Date(createReservationDto.endTime);
    const dateNow = new Date(Date.now());
    if (newReservationStart.getTime() === newReservationEnd.getTime()) {
      throw new ConflictException('Start time and end time cannot be the same');
    }
    if (newReservationStart < dateNow || newReservationEnd < dateNow) {
      throw new ConflictException(
        'Reservation cannot start or end before the current date and time',
      );
    }
    if (newReservationStart >= newReservationEnd) {
      throw new ConflictException('Start time must be before end time');
    }
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.classroom = :classroom', { classroom: classroom.id })
      .getMany();
    const conflictingReservation = reservations.find((reservation) => {
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      console.log('reservation.start_datetime : ', newReservationStart, reservationStart);
      console.log('reservation.end_datetime : ', newReservationEnd, reservationEnd);
      return (
        newReservationEnd > reservationStart && // New reservation ends after the existing one starts
        newReservationStart < reservationEnd // New reservation starts before the existing one ends
      );
    });
    if (conflictingReservation) {
      throw new ConflictException(
        `Classroom is not available at the requested time. Conflicting reservation from ${conflictingReservation.startTime} to ${conflictingReservation.endTime}`,
      );
    }
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

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
    admin: UserEntity | null,
  ): Promise<ReservationEntity> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: updateReservationDto.classroom },
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const oldReservation = await this.findOneById(id);

    await this.validateReservation(updateReservationDto as CreateReservationDto, classroom);

    const user = await this.userService.findOneById(updateReservationDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reservation = await this.reservationRepository.preload({
      id,
      ...updateReservationDto,
      classroom,
      user,
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    let adminWithDetails: UserEntity | null = null;
    if (admin) {
      adminWithDetails = await this.userService.findOneById(admin.id);
    }

    try {
      await this.mailService.sendUpdateEmails(
        user,
        adminWithDetails,
        classroom,
        oldReservation,
        updateReservationDto,
      );
    } catch (error) {
      throw new InternalServerErrorException("The mail couldn't be send", error);
    }

    return this.reservationRepository.save(reservation);
  }

  async remove(
    id: number,
    deleteReservationDto: DeleteReservationDto,
    admin: UserEntity | null,
  ): Promise<any> {
    {
      const classroom = await this.classroomRepository.findOne({
        where: { id: deleteReservationDto.classroom },
      });
      if (!classroom) {
        throw new NotFoundException('Classroom not found');
      }

      const oldReservation = await this.findOneById(id);
      if (!oldReservation) {
        throw new NotFoundException('Old reservation not found');
      }

      const user = await this.userService.findOneById(deleteReservationDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let adminWithDetails: UserEntity | null = null;
      if (admin) {
        adminWithDetails = await this.userService.findOneById(admin.id);
      }

      try {
        await this.mailService.sendDeleteMail(user, adminWithDetails, classroom, oldReservation);
      } catch (error) {
        throw new InternalServerErrorException("The mail couldn't be send", error);
      }

      return this.reservationRepository.softDelete(id);
    }
  }
}
