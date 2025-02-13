import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

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

    const savedReservation = await this.reservationRepository.save(reservation);

    await this.mailService.sendMail(
      user.email,
      'Your reservation for a classroom',
      `Your reservation for classroom ${classroom.name} has been created from ${createReservationDto.startTime} to ${createReservationDto.endTime}.`,
    );

    return savedReservation;
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

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<ReservationEntity> {
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

    const userEmailText = `
    Your reservation for classroom <strong>${classroom.name}</strong> has been updated.<br><br>
    <strong>Old Reservation:</strong><br>
    Start Time: <i>${oldReservation.startTime}</i><br>
    End Time: <i>${oldReservation.endTime}</i><br><br>
    <strong>New Reservation:</strong><br>
    Start Time: <i>${updateReservationDto.startTime}</i><br>
    End Time: <i>${updateReservationDto.endTime}</i>
  `;

    const adminEmailText = `
    The reservation for user <strong>${user.email}</strong> in classroom <strong>${classroom.name}</strong> has been updated.<br><br>
    <strong>Old Reservation:</strong><br>
    Start Time: <i>${oldReservation.startTime}</i><br>
    End Time: <i>${oldReservation.endTime}</i><br><br>
    <strong>New Reservation:</strong><br>
    Start Time: <i>${updateReservationDto.startTime}</i><br>
    End Time: <i>${updateReservationDto.endTime}</i>
  `;

    await this.mailService.sendMail(user.email, 'Your reservation has been updated', userEmailText);

    await this.mailService.sendMail(
      process.env.MAIL_USER,
      'A reservation has been updated',
      adminEmailText,
    );

    return this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<any> {
    await this.findOneById(id);

    return this.reservationRepository.softDelete(id);
  }
}
