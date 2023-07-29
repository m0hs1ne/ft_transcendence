import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({nullable: true, type: 'timestamp'})
    public mutedTill: Date

    @ManyToOne(() => User, (user) => user.userChat, {onDelete: 'CASCADE'})
    public user: User

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.userChat, {onDelete: 'CASCADE'})
    public chatRoom: ChatRoom

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    updateCreatedAt() {
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.mutedTill = new Date();
    }
  
    @BeforeUpdate()
    updateUpdatedAt() {
      this.updatedAt = new Date();
    }
}
