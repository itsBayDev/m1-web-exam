import { ArrowLeftOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Col, Row, Skeleton, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ButtonLink } from '../../shared/components/ButtonLink';
import type { BikeModel } from '../models/BikeModel';
import { normalizeCreateInput } from './bikeForm';
import { DescriptionCard } from './BikeDetailsDescriptionCard';
import { OverviewCard } from './BikeDetailsOverviewCard';
import { SpecificationsCard } from './BikeDetailsSpecificationsCard';

export const BikeDetails = ({ bikeId }: { bikeId: string }) => {
  const [bike, setBike] = useState<BikeModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    axios
      .get<BikeModel>(`http://localhost:3000/bikes/${bikeId}`)
      .then(result => {
        if (isActive) setBike(result.data);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [bikeId]);

  const updateBike = async (changes: Partial<BikeModel>) => {
    if (!bike) return;
    const payload = normalizeCreateInput({
      brand: changes.brand ?? bike.brand,
      model: changes.model ?? bike.model,
      description: changes.description ?? bike.description,
      category: changes.category ?? bike.category,
      frameMaterial: changes.frameMaterial ?? bike.frameMaterial,
      frameSizeCm: changes.frameSizeCm ?? bike.frameSizeCm,
      wheelSizeInches: changes.wheelSizeInches ?? bike.wheelSizeInches,
      gearCount: changes.gearCount ?? bike.gearCount,
      weightKg: changes.weightKg ?? bike.weightKg,
      electric: changes.electric ?? bike.electric,
      priceCents: changes.priceCents ?? bike.priceCents,
    });

    const result = await axios.patch<BikeModel>(`http://localhost:3000/bikes/${bike.id}`, payload);
    setBike(result.data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '.25rem .5rem' }}>
      <ButtonLink to='/bikes' icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align='center'>
        <ShoppingOutlined style={{ fontSize: '1.5rem' }} />
        {isLoading ?
          <Skeleton.Input active size='large' />
        : <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : 'Bike not found'}
          </Title>
        }
      </Space>

      {isLoading ?
        <Skeleton />
      : bike ?
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col span={24}>
            <OverviewCard key={bike.id} bike={bike} isLoading={isLoading} onSave={updateBike} />
          </Col>
          <Col xs={24} md={12}>
            <SpecificationsCard
              key={bike.id}
              bike={bike}
              isLoading={isLoading}
              onSave={updateBike}
            />
          </Col>
          <Col xs={24} md={12}>
            <DescriptionCard key={bike.id} bike={bike} isLoading={isLoading} onSave={updateBike} />
          </Col>
        </Row>
      : null}
    </div>
  );
};
