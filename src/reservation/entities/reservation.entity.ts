import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('reservation')
export class ReservationEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.id)
  classroom: ClassroomEntity;
}
