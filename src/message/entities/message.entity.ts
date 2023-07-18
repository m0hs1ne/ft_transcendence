import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => ChatRoom, (ChatRoom) => ChatRoom.messages, {onDelete: 'CASCADE'})
    chatroom: ChatRoom;
}
