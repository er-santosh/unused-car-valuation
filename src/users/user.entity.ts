import { Report } from './../reports/report.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column() 
  password: string;

  @OneToMany(()=>Report,(report)=>report.user)
  reports: Report[]
}
