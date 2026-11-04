import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import type { BikeModel } from '../models/BikeModel';

const toSpecificationsValues = (bike: BikeModel) => ({
  frameMaterial: bike.frameMaterial,
  frameSizeCm: bike.frameSizeCm,
  wheelSizeInches: bike.wheelSizeInches,
  gearCount: bike.gearCount,
  weightKg: bike.weightKg,
});

interface SpecificationsCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  onSave: (values: Partial<BikeModel>) => Promise<void>;
}

export const SpecificationsCard = ({ bike, isLoading, onSave }: SpecificationsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() =>
    bike ?
      toSpecificationsValues(bike)
    : { frameMaterial: '', frameSizeCm: 0, wheelSizeInches: 0, gearCount: 0, weightKg: 0 },
  );
  const [errors, setErrors] = useState<
    Partial<
      Record<'frameMaterial' | 'frameSizeCm' | 'wheelSizeInches' | 'gearCount' | 'weightKg', string>
    >
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    const nextErrors: Partial<
      Record<'frameMaterial' | 'frameSizeCm' | 'wheelSizeInches' | 'gearCount' | 'weightKg', string>
    > = {};
    if (!values.frameMaterial.trim()) nextErrors.frameMaterial = 'Frame material is required';
    if (values.frameSizeCm <= 0) nextErrors.frameSizeCm = 'Frame size must be greater than 0';
    if (values.wheelSizeInches <= 0)
      nextErrors.wheelSizeInches = 'Wheel size must be greater than 0';
    if (values.gearCount <= 0) nextErrors.gearCount = 'Gear count must be greater than 0';
    if (values.weightKg <= 0) nextErrors.weightKg = 'Weight must be greater than 0';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      await onSave({
        frameMaterial: values.frameMaterial.trim(),
        frameSizeCm: values.frameSizeCm,
        wheelSizeInches: values.wheelSizeInches,
        gearCount: values.gearCount,
        weightKg: values.weightKg,
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
      title='Specifications'
      extra={
        isEditing ?
          <Space>
            <Button
              icon={<CloseOutlined />}
              onClick={() => {
                setErrors({});
                setError(null);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type='primary' icon={<SaveOutlined />} loading={isSaving} onClick={save}>
              Save
            </Button>
          </Space>
        : <Button
            icon={<EditOutlined />}
            aria-label='Edit specifications'
            disabled={!bike || isLoading}
            onClick={() => {
              if (bike) {
                setValues(toSpecificationsValues(bike));
                setErrors({});
                setError(null);
                setIsEditing(true);
              }
            }}
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
          <Col span={24}>
            <label>Frame material</label>
            <Input
              value={values.frameMaterial}
              status={errors.frameMaterial ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, frameMaterial: e.target.value }))}
            />
            {errors.frameMaterial && (
              <Typography.Text type='danger'>{errors.frameMaterial}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label>Frame size cm</label>
            <Input
              type='number'
              value={values.frameSizeCm}
              status={errors.frameSizeCm ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, frameSizeCm: Number(e.target.value) }))}
            />
            {errors.frameSizeCm && (
              <Typography.Text type='danger'>{errors.frameSizeCm}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label>Wheel size in</label>
            <Input
              type='number'
              value={values.wheelSizeInches}
              status={errors.wheelSizeInches ? 'error' : undefined}
              onChange={e =>
                setValues(prev => ({ ...prev, wheelSizeInches: Number(e.target.value) }))
              }
            />
            {errors.wheelSizeInches && (
              <Typography.Text type='danger'>{errors.wheelSizeInches}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label>Gear count</label>
            <Input
              type='number'
              value={values.gearCount}
              status={errors.gearCount ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, gearCount: Number(e.target.value) }))}
            />
            {errors.gearCount && (
              <Typography.Text type='danger'>{errors.gearCount}</Typography.Text>
            )}
          </Col>
          <Col span={12}>
            <label>Weight kg</label>
            <Input
              type='number'
              value={values.weightKg}
              status={errors.weightKg ? 'error' : undefined}
              onChange={e => setValues(prev => ({ ...prev, weightKg: Number(e.target.value) }))}
            />
            {errors.weightKg && <Typography.Text type='danger'>{errors.weightKg}</Typography.Text>}
          </Col>
        </Row>
      : <>
          <p>
            <strong>Frame material:</strong> {bike?.frameMaterial ?? '—'}
          </p>
          <p>
            <strong>Frame size:</strong> {bike ? `${bike.frameSizeCm} cm` : '—'}
          </p>
          <p>
            <strong>Wheel size:</strong> {bike ? `${bike.wheelSizeInches} in` : '—'}
          </p>
          <p>
            <strong>Gear count:</strong> {bike?.gearCount ?? '—'}
          </p>
          <p>
            <strong>Weight:</strong> {bike ? `${bike.weightKg} kg` : '—'}
          </p>
        </>
      }
    </Card>
  );
};
