import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class ChatRoomInv {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    title: string;

    @Column()
    chatRoomId: number;

    @Column()
    fromId: number;
    
    @Column()
    toId: number;
}
