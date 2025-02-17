import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';

@Entity('classroom')
export class ClassroomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  capacity: number;

  @Column({ type: 'json', nullable: true })
  equipment: object;

  @Column({ type: 'boolean', nullable: true, default: true })
  isAvailable: boolean;
}
