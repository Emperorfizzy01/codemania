import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity'

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

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  post: Post[];

  @Column({ nullable: true })
  dateCreated: Date;

}