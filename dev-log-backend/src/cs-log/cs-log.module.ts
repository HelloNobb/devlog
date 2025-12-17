import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsLog } from './entities/cs-log.entity';
import { CsLogService } from './cs-log.service';
import { CsLogController } from './cs-log.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CsLog])],
    controllers: [CsLogController],
    providers: [CsLogService],
})
export class CsLogModule { }
