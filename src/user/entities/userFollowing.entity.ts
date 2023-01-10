import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('following')
export class Following {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false,})
  userId: number

  @Column({ nullable: false,})
  followingId: number

  @Column({ nullable: true })
  dateCreated: Date;

}