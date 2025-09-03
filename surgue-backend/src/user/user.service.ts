import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by their OAuth provider and ID, or creates a new one if not found.
   * @param provider - The OAuth provider (e.g., 'google').
   * @param providerId - The user's ID from the provider.
   * @param displayName - The user's display name.
   * @returns The found or created user.
   */
  async findOrCreate(
    provider: string,
    providerId: string,
    displayName: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { oauth_provider_id: providerId },
    });

    if (!user) {
      const newUser = this.userRepository.create({
        oauth_provider: provider,
        oauth_provider_id: providerId,
        display_name: displayName,
      });
      user = await this.userRepository.save(newUser);
    } else if (user.display_name !== displayName) {
      user.display_name = displayName;
      await this.userRepository.save(user);
    }

    return user;
  }
  
  /**
   * Finds a user by their internal UUID.
   * @param id - The user's UUID.
   * @returns The user entity or null.
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Finds multiple users by their IDs.
   * @param ids - An array of user UUIDs.
   * @returns An array of User entities.
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];
    return this.userRepository.createQueryBuilder('user')
      .whereInIds(ids)
      .getMany();
  }
}