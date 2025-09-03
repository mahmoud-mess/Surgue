// /surgue-backend/src/game/game.controller.ts
import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameService } from './game.service';
import { Request } from 'express';
import { GuessDto } from './dto/guess.dto';
import { User } from '../user/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  startGame(@Req() req: Request) {
    const user = req.user as User;
    return this.gameService.startNewGame(user.id);
  }

  @Post('guess')
  submitGuess(@Req() req: Request, @Body() guessDto: GuessDto) {
    const user = req.user as User;
    return this.gameService.processGuess(user.id, guessDto.guess);
  }
}