import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

export class CreateBikeDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  @IsNumber()
  @Min(1)
  frameSizeCm: number;

  @IsNumber()
  @Min(1)
  wheelSizeInches: number;

  @IsInt()
  @Min(1)
  gearCount: number;

  @IsNumber()
  @Min(0.1)
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}

export class UpdateBikeDto {
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  frameSizeCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  wheelSizeInches?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  gearCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  electric?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;
}
