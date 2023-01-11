import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Post } from '../../post/entities/post.entity'

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false,})
  userId: number

  @ManyToOne(() => Post, (post) => post.id,  { cascade: true })
  post: Post;

  @Column({ nullable: true })
  dateCreated: Date

}