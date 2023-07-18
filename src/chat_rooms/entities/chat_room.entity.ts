import { Message } from "src/message/entities/message.entity";
import { UserChat } from "src/user_chat/entities/user_chat.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    owner: string;

    @Column()
    privacy: string;

    @Column()
    ifProtectedPass: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.chatroom)
    messages: Message[]

    @OneToMany(() => UserChat, userChat => userChat.chatRoom)
    public userChat: UserChat[];
}
