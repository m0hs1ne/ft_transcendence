import { Message } from "src/message/entities/message.entity";
import { UserChat } from "src/user_chat/entities/user_chat.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    title: string;

    @Column()
    owner: number;

    @Column()
    privacy: string;

    @Column({nullable: true})
    ifProtectedPass: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.chatroom)
    messages: Message[]

    @OneToMany(() => UserChat, userChat => userChat.chatRoom)
    public userChat: UserChat[];

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
      const saltRounds = 10;
      if (this.ifProtectedPass)
        this.ifProtectedPass = await bcrypt.hash(this.ifProtectedPass, saltRounds);
    }
}
