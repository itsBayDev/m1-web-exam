import type { CreateBikeModel } from '../models/BikeModel';

export interface BikeFormValues {
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number | undefined;
  wheelSizeInches: number | undefined;
  gearCount: number | undefined;
  weightKg: number | undefined;
  electric: boolean;
  priceCents: number | undefined;
}

export type BikeFormErrors = Partial<
  Record<
    | 'brand'
    | 'model'
    | 'description'
    | 'category'
    | 'frameMaterial'
    | 'frameSizeCm'
    | 'wheelSizeInches'
    | 'gearCount'
    | 'weightKg'
    | 'electric'
    | 'priceCents',
    string
  >
>;

export const emptyValues: BikeFormValues = {
  brand: '',
  model: '',
  description: '',
  category: '',
  frameMaterial: '',
  frameSizeCm: undefined,
  wheelSizeInches: undefined,
  gearCount: undefined,
  weightKg: undefined,
  electric: false,
  priceCents: undefined,
};

export const toNumber = (input: number | undefined) =>
  input === undefined || Number.isNaN(input) ? undefined : input;

export const validateBikeForm = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};

  if (!values.brand.trim()) errors.brand = 'Brand is required';
  if (!values.model.trim()) errors.model = 'Model is required';
  if (!values.category.trim()) errors.category = 'Category is required';
  if (!values.frameMaterial.trim()) errors.frameMaterial = 'Frame material is required';

  if (values.frameSizeCm === undefined || values.frameSizeCm <= 0) {
    errors.frameSizeCm = 'Frame size must be greater than 0';
  }
  if (values.wheelSizeInches === undefined || values.wheelSizeInches <= 0) {
    errors.wheelSizeInches = 'Wheel size must be greater than 0';
  }
  if (values.gearCount === undefined || values.gearCount <= 0) {
    errors.gearCount = 'Gear count must be greater than 0';
  }
  if (values.weightKg === undefined || values.weightKg <= 0) {
    errors.weightKg = 'Weight must be greater than 0';
  }
  if (values.priceCents === undefined || values.priceCents <= 0) {
    errors.priceCents = 'Price must be greater than 0';
  }

  return errors;
};

export const normalizeCreateInput = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: Number(values.frameSizeCm),
  wheelSizeInches: Number(values.wheelSizeInches),
  gearCount: Number(values.gearCount),
  weightKg: Number(values.weightKg),
  electric: values.electric,
  priceCents: Number(values.priceCents),
});
