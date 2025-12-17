// src/troubleshoot/entities/troubleshoot.entity.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('troubleshoots')
export class Troubleshoot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    /* ======== 트러블슈팅 정보 ======== */

    @Column({ type: 'text' })
    problem: string; // 문제 상황

    @Column({ length: 255, nullable: true })
    moment: string; // 트러블 모먼트 (언제 발생?)

    @Column({ type: 'text' })
    solution: string; // 해결 방법

    @Column({ type: 'text', nullable: true })
    insight: string; // 인사이트/메모

    /* ======== 자동 생성 시간 정보 ======== */

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
