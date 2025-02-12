import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity, UserEntity]), UserModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
