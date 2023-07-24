import { Achievement } from "src/achievement/entities/achievement.entity";
import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { ChatRoomInv } from "src/chat_rooms/entities/invitation.entity";
import { Message } from "src/message/entities/message.entity";
import { UserChat } from "src/user_chat/entities/user_chat.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ type: 'varchar', unique: true, length: 50 })
    email: string;

    @Column({ type: 'varchar', unique: true, length: 50 })
    username: string;

    @Column({nullable: true})
    level: number;

    @Column({nullable: true})
    wins: number;

    @Column({nullable: true})
    loses: number;

    @Column()
    statusOnline: boolean;

    @Column()
    inGame: boolean;

    @Column()
    is2fa: boolean;

    @Column()
    avatar: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'friends',
        joinColumn: {
          name: 'userId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'friendId',
          referencedColumnName: 'id',
        },
      })
    friends: User[];

    @ManyToMany(type => User)
    @JoinTable({
        name: 'blocked',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
            inverseJoinColumn: {
            name: 'blockedId',
            referencedColumnName: 'id',
        },
    })
    blocked: User[];

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[]

    @OneToMany(() => UserChat, userChat => userChat.user)
    public userChat: UserChat[];

    @ManyToMany(() => Achievement)
    @JoinTable({
        name: 'user_achievements'
    })

    @OneToMany(() => ChatRoomInv, invit => invit.toUser)
    public invitation: ChatRoomInv[];

    @OneToMany(() => ChatRoomInv, invit => invit.fromUser)
    public sentInvit: ChatRoomInv[];
    achievements: Achievement[]
}
