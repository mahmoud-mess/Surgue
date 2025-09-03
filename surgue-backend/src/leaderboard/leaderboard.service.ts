// /surgue-backend/src/leaderboard/leaderboard.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HighScore } from './entities/high-score.entity';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { UserService } from '../user/user.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(HighScore)
    private readonly highScoreRepository: Repository<HighScore>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly userService: UserService,
  ) {}

  private getDailyLeaderboardKey(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `leaderboard:daily:${today}`;
  }

  async submitScore(userId: string, score: number): Promise<void> {
    if (score <= 0) return;

    // 1. Update daily leaderboard in Redis
    const dailyKey = this.getDailyLeaderboardKey();
    await this.redis.zadd(dailyKey, score, userId);
    await this.redis.expire(dailyKey, 60 * 60 * 26); // Expire in 26 hours

    // 2. Check and update permanent high score in PostgreSQL
    const currentHighScore = await this.highScoreRepository.findOne({
      where: { user_id: userId },
      order: { score: 'DESC' },
    });

    if (!currentHighScore || score > currentHighScore.score) {
      const newHighScore = this.highScoreRepository.create({
        user_id: userId,
        score,
      });
      await this.highScoreRepository.save(newHighScore);
    }
  }

  async getDailyLeaderboard() {
    const key = this.getDailyLeaderboardKey();
    const results = await this.redis.zrevrange(key, 0, 99, 'WITHSCORES');
    
    const userIds = [];
    const scoresMap = new Map<string, number>();
    for (let i = 0; i < results.length; i += 2) {
      const userId = results[i];
      const score = parseInt(results[i + 1], 10);
      userIds.push(userId);
      scoresMap.set(userId, score);
    }

    const users = await this.userService.findByIds(userIds);
    const usersMap = new Map(users.map(u => [u.id, u.display_name]));

    return userIds.map((id, index) => ({
      rank: index + 1,
      displayName: usersMap.get(id) || 'Anonymous',
      score: scoresMap.get(id),
    }));
  }

  async getWorldwideLeaderboard() {
    const highScores = await this.highScoreRepository.find({
      relations: ['user'],
      order: { score: 'DESC' },
      take: 100,
    });
    
    return highScores.map((entry, index) => ({
      rank: index + 1,
      displayName: entry.user.display_name,
      score: entry.score,
    }));
  }
}