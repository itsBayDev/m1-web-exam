import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Space, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { ButtonLink } from '../../shared/components/ButtonLink';
import { ListItem } from '../../shared/components/ListItem';
import type { BikeModel } from '../models/BikeModel';

const formatPrice = (priceCents: number) => `${(priceCents / 100).toFixed(2)} €`;

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void> | void;
}

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    Promise.resolve(deleteBike(bike.id))
      .then(() => setIsOpen(false))
      .catch(error => {
        if (isAxiosError(error)) {
          setError(error.response?.data?.message ?? 'This bike could not be deleted.');
          return;
        }
        setError('This bike could not be deleted.');
      });
  };

  return (
    <>
      <ListItem>
        <Col span={8}>
          <Space>
            <Typography.Text strong>{bike.brand}</Typography.Text>
            <Typography.Text>{bike.model}</Typography.Text>
          </Space>
        </Col>
        <Col span={8}>
          <Typography.Text>{bike.category}</Typography.Text>
        </Col>
        <Col span={4}>
          <Typography.Text>{formatPrice(bike.priceCents)}</Typography.Text>
        </Col>
        <Col span={4}>
          <Space>
            <ButtonLink to={`/bikes/${bike.id}`}>
              <EyeOutlined />
            </ButtonLink>
            <Button danger icon={<DeleteOutlined />} onClick={() => setIsOpen(true)} />
          </Space>
        </Col>
      </ListItem>
      <Modal
        open={isOpen}
        okButtonProps={{ danger: true }}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={() => {
          setError(null);
          setIsOpen(false);
        }}
        onOk={handleDelete}
        okText='Yes, delete'
      >
        <Typography.Text>
          You are about to delete {bike.brand} {bike.model}. This action cannot be undone, are you
          sure?
        </Typography.Text>
        {error && (
          <Typography.Text type='danger' style={{ display: 'block', marginTop: 12 }}>
            {error}
          </Typography.Text>
        )}
      </Modal>
    </>
  );
};
