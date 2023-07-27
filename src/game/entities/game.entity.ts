import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user1Id: number;

    @Column()
    user2Id: number

    @Column()
    winner: number

    @Column()
    score: string;

    @Column()
    mode: string;

    @ManyToOne(() => User, (user) => user.games, {onDelete: 'CASCADE'})
    public user1: User

    @ManyToOne(() => User, (user) => user.games, {onDelete: 'CASCADE'})
    public user2: User
}
