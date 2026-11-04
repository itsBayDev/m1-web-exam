import { Pagination, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useBikesProvider } from '../providers/useBikesProvider';
import { AddBikeButton } from './AddBikeButton';
import { BikeEditor } from './BikeEditor';
import { emptyValues, normalizeCreateInput, type BikeFormValues } from './bikeForm';
import { BikeListItem } from './BikeListItem';

export const BikesList = () => {
  const { bikes, totalCount, page, pageSize, isLoading, load, deleteBike, createBike } =
    useBikesProvider();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = (values: BikeFormValues) => {
    setIsSaving(true);
    return createBike(normalizeCreateInput(values))
      .then(() => setIsCreateOpen(false))
      .finally(() => setIsSaving(false));
  };

  return (
    <Space orientation='vertical' style={{ padding: '.25rem .5rem', width: '100%' }}>
      <AddBikeButton onClick={() => setIsCreateOpen(true)} />
      {isLoading ?
        <Skeleton />
      : <>
          {bikes.map(bike => (
            <BikeListItem key={bike.id} bike={bike} deleteBike={deleteBike} />
          ))}
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalCount}
            onChange={(nextPage, nextPageSize) => load(nextPage, nextPageSize)}
            showSizeChanger={false}
          />
        </>
      }
      <BikeEditor
        key={isCreateOpen ? 'bike-create-open' : 'bike-create-closed'}
        title='New bike'
        initialValues={emptyValues}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        submitLabel='Add bike'
        isSaving={isSaving}
      />
    </Space>
  );
};
