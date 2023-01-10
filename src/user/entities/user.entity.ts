import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  firstname: string;

  @Column({ nullable: false, type: 'text' })
  surname: string;

  @Column({ nullable: false, type: 'text' })
  phone: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({ nullable: true })
  dateCreated: Date
}