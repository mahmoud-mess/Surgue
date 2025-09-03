// /surgue-backend/src/game/dto/guess.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class GuessDto {
  @IsString()
  @IsNotEmpty()
  guess!: string;
}
