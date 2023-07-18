import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId1: number;

    @Column()
    userId2: number

    @Column()
    winner: number

    @Column()
    score: string;

    @Column()
    mode: string;
}
