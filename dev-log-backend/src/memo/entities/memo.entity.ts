// src/memo/entities/memo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('memos')
export class Memo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    color: string;  // 스티커 색상 (선택)

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => MemoComment, comment => comment.memo, { cascade: true })
    comments: MemoComment[];
}

@Entity('memo_comments')
export class MemoComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @ManyToOne(() => Memo, memo => memo.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'memoId' })
    memo: Memo;

    @Column()
    memoId: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}
