import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Algorithm } from './entities/algo.entity';
import { AlgoService } from './algo.service';
import { AlgoController } from './algo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Algorithm])],
    controllers: [AlgoController],
    providers: [AlgoService],
    exports: [AlgoService],
})
export class AlgoModule { }
