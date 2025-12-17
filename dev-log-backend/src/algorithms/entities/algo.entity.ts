// src/algorithms/entities/algorithm.entity.ts
import {
    Entity,     // 해당 클래스가 DB테이블 명시
    Column,     // 테이블의 열 정의
    PrimaryGeneratedColumn, // 자동으로 증가하는 ID (primary-key)
    ManyToOne,  // N:1 관계 - 여러 에티티가 하나를 참조 (알고리즘 여러개 -> 유저 1명)
    CreateDateColumn,   // 생성 시간 자동 등록  
    UpdateDateColumn,   // 수정 시간 자동 기록
    JoinColumn, // 외래키 컬럼 명시 (ManyToOne쪽에만 사용)
} from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('algorithms')
export class Algorithm {
    @PrimaryGeneratedColumn() //기본키
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' }) //→ 사용자 삭제 시 알고리즘 기록도 함께 삭제
    @JoinColumn({ name: 'user_id' })// @JoinColumn: 외래키 컬럼 지정
    user: User;

    /* ======== 알고리즘 기본 정보 ======== */

    @Column({ length: 255 })
    title: string;

    @Column({ length: 100, nullable: true })
    platform: string; // BOJ, Programmers, LeetCode 등

    @Column({
        type: 'enum',
        enum: ['Easy', 'Medium', 'Hard'],
    })
    difficulty: string;

    @Column({ type: 'json', nullable: true })
    tags: string[]; // ['DP', 'Graph', 'DFS'] 등 카테고리

    @Column({ type: 'text', nullable: true })
    approach: string; // 풀이 접근법

    @Column({ type: 'text', nullable: true })
    memo: string; // 메모

    @Column({ type: 'datetime', nullable: true })
    solvedAt: Date;

    @Column({ nullable: true })
    timeSpent: number; // 분 단위

    @Column({ length: 500, nullable: true })
    problemUrl: string; // 문제 링크

    /* ======== 자동 생성 시간 정보 ======== */

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}