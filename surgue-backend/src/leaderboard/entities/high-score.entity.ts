import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../user/user.entity';
  
  @Entity('high_scores')
  export class HighScore {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: 'uuid' })
    user_id!: string;
  
    @ManyToOne(() => User, (user) => user.high_scores, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @Index({ unique: false })
    @Column()
    score!: number;
  
    @CreateDateColumn()
    achieved_at!: Date;
  }