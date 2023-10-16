import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'password',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'email',
    nullable: true,
    unique: true,
  })
  email: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
  })
  updatedAt: Date;
}
