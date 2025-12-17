import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('cs_logs')
export class CsLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    /* ======== CS 학습 내용 ======== */

    @Column({ length: 50 })
    category: string; // 네트워크, 운영체제, 자료구조 등

    @Column({ length: 100 })
    topic: string; // 학습 주제 (예: HTTP Handshake)

    @Column({ type: 'text' })
    content: string; // 학습 내용 (마크다운 등)

    /* ======== 메타 데이터 ======== */

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
