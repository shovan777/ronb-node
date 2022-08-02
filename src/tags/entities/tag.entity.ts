import { ObjectType, Field, Int } from '@nestjs/graphql';
import { News } from 'src/news/entities/news.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;


  @Field({ description: "name of the tag"})
  @Column({
    type: "varchar",
    unique: true,
    length: 100,
  })
  name: string;


  @Field({ description: "slug of the tag"})
  @Column({
    type: "varchar",
    unique: true,
    length: 100,
  })
  slug: string;
}


@ObjectType()
@Entity()
export class NewsTaggit {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;
  
  @Field(() => Tag, { description: 'Tag name' })
  @ManyToOne(() => Tag, (tag) => tag.name)
  tag: Tag;
  
  @Field(() => News, { description: 'news name' })
  @ManyToOne(() => News, (news) => news.tags)
  news: News;
}