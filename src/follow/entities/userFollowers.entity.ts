import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('followers')
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false,})
  userId: number

  @Column({ nullable: false,})
  followerId: number

  @Column({ nullable: true })
  dateCreated: Date;

}