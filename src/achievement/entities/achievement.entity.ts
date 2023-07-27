import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    image: string;
}
