import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';

@Entity('equipment')
export class EquipmentEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @ManyToMany(() => ClassroomEntity, (classroom) => classroom.equipment)
  classrooms: ClassroomEntity[];
}
