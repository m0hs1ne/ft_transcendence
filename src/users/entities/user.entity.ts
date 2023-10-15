import { Achievement } from "src/achievement/entities/achievement.entity";
import { ChatRoomInv } from "src/chat_rooms/entities/invitation.entity";
import { Game } from "src/game/entities/game.entity";
import { Message } from "src/message/entities/message.entity";
import { UserChat } from "src/user_chat/entities/user_chat.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: true })
    tfaSecret: string;

    @Column({ nullable: true })
    mailOTP: string;

    @Column({ nullable: true, default: null })
    mailOTPExpire: Date;

    @Column({ type: 'varchar', unique: true, length: 50 })
    email: string;

    @Column({ type: 'varchar', unique: true, length: 50 })
    username: string;

    @Column({nullable: true})
    level: number;

    @Column({nullable: true})
    wins: number;

    @Column({nullable: true})
    losses: number;

    @Column()
    statusOnline: boolean;

    @Column()
    inGame: boolean;

    @Column({ default: false })
    creator: boolean;

    @Column({ default: false })
    is2faEnabled: boolean;

    @Column({ default: false })
    is2faEnabledViaGoogleAuth: boolean;
  
    @Column({ default: false })
    is2faEnabledViaEmail: boolean;

    @Column()
    avatar: string;

    @Column({nullable: true, type: 'timestamp'})
    disconnectAt: Date

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

    @ManyToMany(type => User)
    @JoinTable({
        name: 'blockedBy',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
            inverseJoinColumn: {
            name: 'blockedById',
            referencedColumnName: 'id',
        },
    })
    blockedBy: User[];

    @OneToMany(() => Message, (message) => message.from)
    messages: Message[]

    @OneToMany(() => UserChat, userChat => userChat.user)
    public userChat: UserChat[];

    @ManyToMany(() => Achievement, achievement => achievement.users)
    @JoinTable({
      name: 'user_achievements',
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'achievement_id', referencedColumnName: 'id' },
    })
    achievements: Achievement[];

    @OneToMany(() => ChatRoomInv, invit => invit.toUser)
    public invitation: ChatRoomInv[];

    @OneToMany(() => Game, game => game.user1)
    public games: Game[];

    @OneToMany(() => ChatRoomInv, invit => invit.fromUser)
    public sentInvit: ChatRoomInv[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    updateCreatedAt() {
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    @BeforeUpdate()
    updateUpdatedAt() {
      this.updatedAt = new Date();
    }
}
