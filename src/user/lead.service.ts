import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';


@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepo: Repository<Lead>,
  ) {}

  async createLead(
    createPayload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.leadRepo.save(createPayload);
  }

  async updateLead(
    id: string,
    updatePayload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.leadRepo.update(id, updatePayload);
  }

  async findLead(filter: FindOneOptions<Lead>) {
    try {
      const leadData = await this.leadRepo.findOne(filter);

      if (leadData) {
        return {
          success: true,
          leadData,
        };
      }
      return {
        success: false,
      };
    } catch (error) {}
  }

  async DeleteLead(id: string) {
    return this.leadRepo.delete({
      id,
    });
  }
}
