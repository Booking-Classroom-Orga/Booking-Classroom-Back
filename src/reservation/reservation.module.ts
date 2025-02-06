import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity]), UserModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
