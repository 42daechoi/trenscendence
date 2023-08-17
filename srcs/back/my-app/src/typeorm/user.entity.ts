import {Min} from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  AfterLoad
} from 'typeorm';

export enum UserStatus {
  Online = 0,
  Offline = 1,
  InGame = 2,
}

//  User table
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, nullable: false})
  @Min(0)
  intraId: string;

  @Column({ unique: true, nullable: true })
  nickname: string;

  @Column({ unique: true, nullable: true })
  name: string;

  //0 -> offline
  //1 -> online
  //2 -> ongame
  @Column({ default: 0})
  status: UserStatus;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blocks: User[];

  @Column({default : 0})
  wins: number;

  @Column({default : 0})
  loses: number;

  @Column({default : 0})
  xp: number;

  @Column({default : -1})
  rank: number;

  @Column({ nullable: false, default : false })
  currentAvatarData: boolean;

  @Column({ nullable: false, default: false })
  twoFA: boolean;
  
  @Column({ default: false })
  avatarinit: boolean;

  @Column({ nullable: true })
  twoFASecret: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

}
