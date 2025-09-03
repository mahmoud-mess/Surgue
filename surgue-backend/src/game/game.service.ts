// /surgue-backend/src/game/game.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { REDIS_CLIENT } from '../redis/redis.module';
import { Redis } from 'ioredis';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

interface Country {
  name: string;
  country_code: string;
  land_area_sq_km: number;
}

interface GameSession {
  shuffledCountries: Country[];
  currentIndex: number;
  score: number;
}

@Injectable()
export class GameService implements OnModuleInit {
  private countries: Country[] = [];
  private totalLandArea = 0;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  async onModuleInit() {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'countries.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    this.countries = JSON.parse(fileContent);
    this.totalLandArea = this.countries.reduce(
      (sum, country) => sum + country.land_area_sq_km,
      0,
    );
  }

  private getSessionKey(userId: string): string {
    return `game-session:${userId}`;
  }
  
  private shuffleCountries(): Country[] {
    const array = [...this.countries];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async startNewGame(userId: string) {
    const shuffled = this.shuffleCountries();
    const session: GameSession = {
      shuffledCountries: shuffled,
      currentIndex: 0,
      score: 0,
    };
    
    const initialTotalArea = this.totalLandArea;
    await this.redis.hmset(
      this.getSessionKey(userId),
      'session',
      JSON.stringify(session),
      'totalArea',
      initialTotalArea,
    );
    await this.redis.expire(this.getSessionKey(userId), 60 * 30); // 30 minute session expiry
    return {
      totalLandArea: this.totalLandArea,
      startingTotalLandArea: this.totalLandArea
    };
  }
  
  async processGuess(userId: string, guess: string) {
    const sessionKey = this.getSessionKey(userId);
    // Use HMGET to get both the session and the totalArea from Redis
    const [sessionData, totalAreaData] = await this.redis.hmget(sessionKey, 'session', 'totalArea');

    if (!sessionData || !totalAreaData) {
      throw new Error('Game session not found or expired.');
    }

    const session: GameSession = JSON.parse(sessionData);
    const totalLandArea = parseFloat(totalAreaData);
    const correctCountry = session.shuffledCountries[session.currentIndex];

    if (guess.trim().toLowerCase() === correctCountry.name.toLowerCase()) {
      // Correct guess
      session.score += 1;
      session.currentIndex += 1;

      // Calculate the new total land area
      const newTotalArea = totalLandArea - correctCountry.land_area_sq_km;

      // Check for win condition
      if (session.currentIndex >= session.shuffledCountries.length) {
        await this.leaderboardService.submitScore(userId, session.score);
        await this.redis.del(sessionKey);
        return { correct: true, gameWon: true, finalScore: session.score, newTotalArea };
      }

      // Save the new session and total area back to Redis
      await this.redis.hmset(sessionKey, 'session', JSON.stringify(session), 'totalArea', newTotalArea);
      await this.redis.expire(sessionKey, 60 * 30); // Re-set expiry

      return {
        correct: true,
        removedCountryCode: correctCountry.country_code,
        nextAreaChange: session.shuffledCountries[session.currentIndex].land_area_sq_km,
        newScore: session.score,
        newTotalArea, // Return the new total area
      };
    } else {
      // Incorrect guess
      await this.leaderboardService.submitScore(userId, session.score);
      await this.redis.del(sessionKey);
      
      return {
        correct: false,
        answer: correctCountry.name,
        finalScore: session.score,
      };
    }
  }
}