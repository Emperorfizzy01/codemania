import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  dateCreated: Date

  @Column({ nullable: true })
  dateUpdated: Date;
}