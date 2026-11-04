import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { BikeResponseDto } from "./dto/bike-response.dto";
import { CreateBikeDto, UpdateBikeDto } from "./dto/create-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

interface BikePageResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];
}

@Controller("bikes")
export class BikesController {
  constructor(
    @Inject(BikesService) private readonly service: BikesService,
  ) {}

  @Get()
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ): Promise<BikePageResponseDto> {
    const currentPage = this.parsePositiveInteger(page, 1, "page");
    const perPage = this.parsePositiveInteger(limit, 10, "limit", 50);
    const payload = await this.service.findAll(currentPage, perPage);
    return {
      totalCount: payload.totalCount,
      bikes: payload.bikes.map((model) => BikeResponseDto.fromModel(model)),
    };
  }

  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }

  private parsePositiveInteger(
    value: string | undefined,
    defaultValue: number,
    label: "page" | "limit",
    max?: number,
  ): number {
    const raw = value ?? String(defaultValue);
    if (!/^[1-9]\d*$/.test(raw)) {
      throw new BadRequestException(`${label} must be a positive integer`);
    }
    const parsed = Number(raw);
    if (max !== undefined && parsed > max) {
      throw new BadRequestException(
        `${label} must not exceed ${max}`,
      );
    }
    return parsed;
  }
}
