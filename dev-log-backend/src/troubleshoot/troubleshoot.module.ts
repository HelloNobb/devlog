// src/troubleshoot/troubleshoot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TroubleshootController } from './troubleshoot.controller';
import { TroubleshootService } from './troubleshoot.service';
import { Troubleshoot } from './entities/troubleshoot.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Troubleshoot])],
    controllers: [TroubleshootController],
    providers: [TroubleshootService],
    exports: [TroubleshootService],
})
export class TroubleshootModule { }
