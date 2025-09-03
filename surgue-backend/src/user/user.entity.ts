import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { HighScore } from '../leaderboard/entities/high-score.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ nullable: true })
    oauth_provider!: string;
  
    @Column({ unique: true })
    oauth_provider_id!: string;
  
    @Column()
    display_name!: string;
  
    @OneToMany(() => HighScore, (highScore) => highScore.user)
    high_scores!: HighScore[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }