import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Like } from '../../like/entities/like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @Column({ nullable: true })
  dateCreated: Date

  @Column({ nullable: true })
  dateUpdated: Date;
}