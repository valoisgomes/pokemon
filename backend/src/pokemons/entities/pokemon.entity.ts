import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-array')
  types: string[];

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'int' })
  hp: number;

  @Column({ type: 'int', unique: true, name: 'pokedex_number' })
  pokedexNumber: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.pokemons, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
