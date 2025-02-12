import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { UserEntity } from '../user/entities/user.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity, ClassroomEntity, UserEntity]), UserModule],
  controllers: [ReservationController],
  providers: [ReservationService, MailService],
  exports: [ReservationService],
})
export class ReservationModule {}
