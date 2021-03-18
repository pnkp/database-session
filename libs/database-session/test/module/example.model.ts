import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExampleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(init: Partial<ExampleModel>) {
    Object.assign(this as ExampleModel, init);
  }
}
