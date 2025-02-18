import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { ClassroomEntity } from './entities/classroom.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { EquipmentService } from '../equipment/equipment.service';
import { EquipmentEntity } from '../equipment/entities/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassroomEntity, EquipmentEntity]), UserModule],
  controllers: [ClassroomController],
  providers: [ClassroomService, EquipmentService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
