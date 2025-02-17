import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';
import { EquipmentEntity } from '../../equipment/entities/equipment.entity';

@Entity('classroom')
export class ClassroomEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  capacity: number;

  @ManyToMany(() => EquipmentEntity, (equipment) => equipment.classrooms)
  @JoinTable()
  equipment: EquipmentEntity[];

  @Column({ type: 'boolean', nullable: true, default: true })
  isAvailable: boolean;
}
