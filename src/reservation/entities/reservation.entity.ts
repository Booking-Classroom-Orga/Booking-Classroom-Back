import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';

@Entity('reservations')
export class ReservationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.id)
  classroom: ClassroomEntity;
}
