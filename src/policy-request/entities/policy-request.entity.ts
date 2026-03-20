import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusEnum } from '../enum/status.enum';

@Entity('policy_requests')
export class PolicyRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  folio: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  product: string;

  @Column('decimal')
  insuredAmount: number;

  @Column()
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
