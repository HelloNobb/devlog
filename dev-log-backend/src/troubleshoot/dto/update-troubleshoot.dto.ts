// src/troubleshoot/dto/update-troubleshoot.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTroubleshootDto } from './create-troubleshoot.dto';

export class UpdateTroubleshootDto extends PartialType(CreateTroubleshootDto) { }
