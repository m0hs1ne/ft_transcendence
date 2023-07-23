import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserChat {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public userId: number;

    @Column()
    public chatRoomId: number;

    @Column()
    public userStatus: string;

    @Column()
    public role: string;

    @ManyToOne(() => User, (user) => user.userChat, {onDelete: 'CASCADE'})
    public user: User

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.userChat, {onDelete: 'CASCADE'})
    public chatRoom: ChatRoom
}
