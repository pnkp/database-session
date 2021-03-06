import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExampleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  constructor(init: Partial<ExampleModel>) {
    Object.assign(this as ExampleModel, init);
  }
}
