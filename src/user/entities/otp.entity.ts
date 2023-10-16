import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'otp',
})
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'email',
  })
  email: string;

  @Column({
    name: 'otp_token',
  })
  otpToken: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
