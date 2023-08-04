import { ChatRoom } from "src/chat_rooms/entities/chat_room.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    fromId: number;

    @Column({nullable: true})
    toId: number;

    @Column({nullable: true})
    chatroomId: number;

    @Column({nullable: true})
    type: string;

    @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE'})
    from: User;

    @ManyToOne(() => ChatRoom, (ChatRoom) => ChatRoom.messages, {onDelete: 'CASCADE'})
    chatroom: ChatRoom;

    @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE'})
    to: User;

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
