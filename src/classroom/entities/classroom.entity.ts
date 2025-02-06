import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';

@Entity('classrooms')
export class ClassroomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'integer', nullable: false })
  capacity: number;

  @Column({ type: 'json', nullable: true })
  equipment: object;
}
