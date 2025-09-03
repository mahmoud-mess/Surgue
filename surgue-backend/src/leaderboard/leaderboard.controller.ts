// /surgue-backend/src/leaderboard/leaderboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('daily')
  getDaily() {
    return this.leaderboardService.getDailyLeaderboard();
  }

  @Get('worldwide')
  getWorldwide() {
    return this.leaderboardService.getWorldwideLeaderboard();
  }
}
