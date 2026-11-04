import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository, BikeInUseError, BikeNotFoundError } from "./bikes.repository";
import type { BikeModel, CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository)
    private readonly repository: BikesRepository,
  ) {}

  findAll(
    page = 1,
    limit = 10,
  ): Promise<{ totalCount: number; bikes: BikeModel[] }> {
    return this.repository.findAll(page, limit);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    try {
      return await this.repository.update(id, input);
    } catch (error) {
      this.translateError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.repository.delete(id);
      if (!deleted) throw new NotFoundException("Bike not found");
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (error instanceof BikeNotFoundError)
      throw new NotFoundException("Bike not found");
    if (error instanceof BikeInUseError)
      throw new ConflictException("Bike is still associated with one or more sales");
    throw error;
  }
}
