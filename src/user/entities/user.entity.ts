import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../generic/timestamp.entity';

@Entity('user')
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: ['user'] })
  roles: string[];
}
