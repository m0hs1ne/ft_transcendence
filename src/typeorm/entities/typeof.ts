import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany,JoinTable, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    tfaSecret: string;

    @Column({nullable: true})
    mailOTP: string;

    @Column({nullable: true})
    mailOTPExpire: Date;

    @Column({type: "varchar",unique: true, length: 50})
    email: string;

    @Column({type: "varchar",unique: true, length: 50})
    username: string;

    @Column()
    avatar: string;

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

    @Column({default: false})
    is2fa: boolean;

    @ManyToMany(type => User)
    @JoinTable({
        name: 'friends'
    })
    friends: User[];

    @ManyToMany(type => User)
    @JoinTable({
        name: 'blocked'
    })
    blocked: User[];

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    // @OneToMany(() => Message, (message) => message.user)
    // messages: Message[]

    // @OneToMany(() => UserChat, userChat => userChat.user)
    // public userChat: UserChat[];

    // @ManyToMany(() => Achievement)
    // @JoinTable({
    //     name: 'user_achievements'
    // })
    // achievements: Achievement[]
}