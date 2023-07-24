import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { ChatRoom } from "./chat_room.entity";

@Entity()
export class ChatRoomInv {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    title: string;

    @Column()
    toUserId: number;

    @Column()
    fromUserId: number;

    @Column()
    chatRoomId: number;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.invitation, {onDelete: 'CASCADE'})
    public chatRoom: ChatRoom

    @ManyToOne(() => User, (chatRoom) => chatRoom.invitation, {onDelete: 'CASCADE'})
    public toUser: User

    @ManyToOne(() => User, (chatRoom) => chatRoom.sentInvit, {onDelete: 'CASCADE'})
    public fromUser: User
}
