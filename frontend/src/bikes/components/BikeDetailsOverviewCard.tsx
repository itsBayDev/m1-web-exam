import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Select, Space, Typography } from 'antd';
import { useState } from 'react';
import type { BikeModel } from '../models/BikeModel';

const formatPrice = (priceCents: number) => `${(priceCents / 100).toFixed(2)} €`;

const toOverviewValues = (bike: BikeModel) => ({
  brand: bike.brand,
  model: bike.model,
  category: bike.category,
  electric: bike.electric,
  priceCents: bike.priceCents,
});

interface OverviewCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  onSave: (values: Partial<BikeModel>) => Promise<void>;
}

export const OverviewCard = ({ bike, isLoading, onSave }: OverviewCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() =>
    bike ?
      toOverviewValues(bike)
    : { brand: '', model: '', category: '', electric: false, priceCents: 0 },
  );
  const [errors, setErrors] = useState<
    Partial<Record<'brand' | 'model' | 'category' | 'priceCents', string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    if (!bike) return;
    setValues(toOverviewValues(bike));
    setErrors({});
    setError(null);
    setIsEditing(true);
  };

  const cancel = () => {
    setErrors({});
    setError(null);
    setIsEditing(false);
  };

  const save = async () => {
    const nextErrors: Partial<Record<'brand' | 'model' | 'category' | 'priceCents', string>> = {};
    if (!values.brand.trim()) nextErrors.brand = 'Brand is required';
    if (!values.model.trim()) nextErrors.model = 'Model is required';
    if (!values.category.trim()) nextErrors.category = 'Category is required';
    if (values.priceCents <= 0) nextErrors.priceCents = 'Price must be greater than 0';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      await onSave({
        brand: values.brand.trim(),
        model: values.model.trim(),
        category: values.category.trim(),
        electric: values.electric,
        priceCents: values.priceCents,
      });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      const message =
        (
          err &&
          typeof err === 'object' &&
          'response' in err &&
          (err as any).response?.data?.message
        ) ?
          (err as any).response.data.message
        : 'Unable to update this bike.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      title='Overview'
      extra={
        isEditing ?
          <Space>
            <Button icon={<CloseOutlined />} onClick={cancel}>
              Cancel
            </Button>
            <Button type='primary' icon={<SaveOutlined />} loading={isSaving} onClick={save}>
              Save
            </Button>
          </Space>
        : <Button
            icon={<EditOutlined />}
            aria-label='Edit overview'
            disabled={!bike || isLoading}
            onClick={startEditing}
          />
      }
    >
      {error && (
        <Typography.Text type='danger' style={{ display: 'block', marginBottom: 12 }}>
          {error}
        </Typography.Text>
      )}
      {isEditing && bike ?
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <label>Brand</label>
            <Input
              value={values.brand}
              status={errors.brand ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, brand: e.target.value }))}
            />
            {errors.brand && <Typography.Text type='danger'>{errors.brand}</Typography.Text>}
          </Col>
          <Col span={12}>
            <label>Model</label>
            <Input
              value={values.model}
              status={errors.model ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, model: e.target.value }))}
            />
            {errors.model && <Typography.Text type='danger'>{errors.model}</Typography.Text>}
          </Col>
          <Col span={12}>
            <label>Category</label>
            <Input
              value={values.category}
              status={errors.category ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, category: e.target.value }))}
            />
            {errors.category && <Typography.Text type='danger'>{errors.category}</Typography.Text>}
          </Col>
          <Col span={12}>
            <label>Electric</label>
            <Select
              value={values.electric ? 'yes' : 'no'}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              style={{ width: '100%' }}
              onChange={value => setValues(prev => ({ ...prev, electric: value === 'yes' }))}
            />
          </Col>
          <Col span={24}>
            <label>Price (cents)</label>
            <Input
              type='number'
              value={values.priceCents}
              status={errors.priceCents ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, priceCents: Number(e.target.value) }))}
            />
            {errors.priceCents && (
              <Typography.Text type='danger'>{errors.priceCents}</Typography.Text>
            )}
          </Col>
        </Row>
      : <>
          <p>
            <strong>Brand:</strong> {bike?.brand ?? '—'}
          </p>
          <p>
            <strong>Model:</strong> {bike?.model ?? '—'}
          </p>
          <p>
            <strong>Category:</strong> {bike?.category ?? '—'}
          </p>
          <p>
            <strong>Price:</strong> {bike ? formatPrice(bike.priceCents) : '—'}
          </p>
          <p>
            <strong>Electric:</strong>{' '}
            {bike ?
              bike.electric ?
                'Yes'
              : 'No'
            : '—'}
          </p>
        </>
      }
    </Card>
  );
};
