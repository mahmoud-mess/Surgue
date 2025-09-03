// /surgue-backend/src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { RedisModule } from '../redis/redis.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [RedisModule, LeaderboardModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}