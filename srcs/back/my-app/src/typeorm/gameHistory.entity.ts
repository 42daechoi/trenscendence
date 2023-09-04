import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import 'reflect-metadata';

import { User } from './user.entity';

//  User table
@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  gameId: number;
  
  
//  @ManyToMany(() => User, user => user.histories)
//  @JoinTable()
//  players : User[];

  @Column({nullable: true})
//  @OneToOne(() => User)
//  @JoinColumn()
  winnerIntraId: string;

  @Column({nullable: true})
//  @OneToOne(() => User)
//  @JoinColumn()
  loserIntraId: string;

  @Column({default : 0})
  hostScore: number;

  @Column({default : 0})
  guestScore: number;

  @AfterInsert()
  logInsert() {
    console.log('new Game init with id', this.gameId);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Game with id', this.gameId);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Game with id', this.gameId);
  }
}
