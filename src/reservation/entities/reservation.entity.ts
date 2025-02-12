import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('reservations')
export class ReservationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.reservations)
  classroom: ClassroomEntity;
}
