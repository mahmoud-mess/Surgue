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
  revealedCountries: string[]; // Array of country codes that have been revealed
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
      revealedCountries: [], // Start with no countries revealed
    };
    
    // Start with 0 land area since no countries are revealed yet
    const initialTotalArea = 0;
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
      startingTotalLandArea: 0, // Start with empty world
      nextCountryHint: shuffled[0].land_area_sq_km // Hint for the first country
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
    const currentTotalArea = parseFloat(totalAreaData);
    const correctCountry = session.shuffledCountries[session.currentIndex];

    if (guess.trim().toLowerCase() === correctCountry.name.toLowerCase()) {
      // Correct guess - reveal the country
      session.score += 1;
      session.revealedCountries.push(correctCountry.country_code);
      session.currentIndex += 1;

      // Calculate the new total land area (add the revealed country's area)
      const newTotalArea = currentTotalArea + correctCountry.land_area_sq_km;

      // Check for win condition (all countries revealed)
      if (session.currentIndex >= session.shuffledCountries.length) {
        await this.leaderboardService.submitScore(userId, session.score);
        await this.redis.del(sessionKey);
        return { 
          correct: true, 
          gameWon: true, 
          finalScore: session.score, 
          newTotalArea,
          revealedCountryCode: correctCountry.country_code,
          nextCountryHint: null // No more countries to guess
        };
      }

      // Save the new session and total area back to Redis
      await this.redis.hmset(sessionKey, 'session', JSON.stringify(session), 'totalArea', newTotalArea);
      await this.redis.expire(sessionKey, 60 * 30); // Re-set expiry

      return {
        correct: true,
        revealedCountryCode: correctCountry.country_code,
        nextAreaChange: session.shuffledCountries[session.currentIndex].land_area_sq_km,
        newScore: session.score,
        newTotalArea, // Return the new total area
        nextCountryHint: session.shuffledCountries[session.currentIndex].land_area_sq_km, // Hint for next country
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