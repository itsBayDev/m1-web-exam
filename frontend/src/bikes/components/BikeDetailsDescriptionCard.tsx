import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Typography } from 'antd';
import { useState } from 'react';
import type { BikeModel } from '../models/BikeModel';

const toDescriptionValues = (bike: BikeModel) => ({
  description: bike.description,
});

interface DescriptionCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  onSave: (values: Partial<BikeModel>) => Promise<void>;
}

export const DescriptionCard = ({ bike, isLoading, onSave }: DescriptionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() =>
    bike ? toDescriptionValues(bike) : { description: '' },
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      await onSave({ description: values.description.trim() });
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
      title='Description'
      extra={
        isEditing ?
          <Space>
            <Button
              icon={<CloseOutlined />}
              onClick={() => {
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
            aria-label='Edit description'
            disabled={!bike || isLoading}
            onClick={() => {
              if (bike) {
                setValues(toDescriptionValues(bike));
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
        <Input.TextArea
          rows={6}
          value={values.description}
          onChange={e => setValues(prev => ({ ...prev, description: e.target.value }))}
        />
      : <p>{bike?.description ?? '—'}</p>}
    </Card>
  );
};
