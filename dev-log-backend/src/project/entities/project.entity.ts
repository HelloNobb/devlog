// src/project/entities/project.entity.ts
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

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    /* ======== 프로젝트 기본 정보 ======== */

    @Column({ length: 255 })
    projectName: string; // 프로젝트명

    @Column({ type: 'text' })
    implementation: string; // 구현한 부분

    @Column({ type: 'text', nullable: true })
    memo: string; // 메모

    /* ======== 자동 생성 시간 정보 ======== */

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
