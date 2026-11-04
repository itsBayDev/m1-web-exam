import { Col, Input, Modal, Row, Select, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { toNumber, validateBikeForm, type BikeFormErrors, type BikeFormValues } from './bikeForm';

interface BikeEditorProps {
  title: string;
  initialValues: BikeFormValues;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BikeFormValues) => Promise<void> | void;
  submitLabel: string;
  isSaving: boolean;
}

export const BikeEditor = ({
  title,
  initialValues,
  isOpen,
  onClose,
  onSubmit,
  submitLabel,
  isSaving,
}: BikeEditorProps) => {
  const [values, setValues] = useState<BikeFormValues>(initialValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentErrors = useMemo(() => {
    if (!isOpen) return {};
    return errors;
  }, [errors, isOpen]);

  const updateValue = <K extends keyof BikeFormValues>(key: K, value: BikeFormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  };

  const handleOk = () => {
    const validationErrors = validateBikeForm(values);
    setErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    Promise.resolve(onSubmit(values)).catch(error => {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'Unable to save this bike.';
        setSubmitError(message);
        return;
      }
      setSubmitError('Unable to save this bike.');
    });
  };

  const close = () => {
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title={title}
      onCancel={close}
      onOk={handleOk}
      confirmLoading={isSaving}
      okText={submitLabel}
    >
      {submitError && (
        <Typography.Text type='danger' style={{ display: 'block', marginBottom: 12 }}>
          {submitError}
        </Typography.Text>
      )}
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <label>Brand</label>
          <Input
            value={values.brand}
            status={currentErrors.brand ? 'error' : undefined}
            onChange={e => updateValue('brand', e.target.value)}
          />
          {currentErrors.brand && (
            <Typography.Text type='danger'>{currentErrors.brand}</Typography.Text>
          )}
        </Col>
        <Col span={12}>
          <label>Model</label>
          <Input
            value={values.model}
            status={currentErrors.model ? 'error' : undefined}
            onChange={e => updateValue('model', e.target.value)}
          />
          {currentErrors.model && (
            <Typography.Text type='danger'>{currentErrors.model}</Typography.Text>
          )}
        </Col>
        <Col span={24}>
          <label>Description</label>
          <Input
            value={values.description}
            onChange={e => updateValue('description', e.target.value)}
          />
        </Col>
        <Col span={12}>
          <label>Category</label>
          <Input
            value={values.category}
            status={currentErrors.category ? 'error' : undefined}
            onChange={e => updateValue('category', e.target.value)}
          />
          {currentErrors.category && (
            <Typography.Text type='danger'>{currentErrors.category}</Typography.Text>
          )}
        </Col>
        <Col span={12}>
          <label>Frame material</label>
          <Input
            value={values.frameMaterial}
            status={currentErrors.frameMaterial ? 'error' : undefined}
            onChange={e => updateValue('frameMaterial', e.target.value)}
          />
          {currentErrors.frameMaterial && (
            <Typography.Text type='danger'>{currentErrors.frameMaterial}</Typography.Text>
          )}
        </Col>
        <Col span={8}>
          <label>Frame size cm</label>
          <Input
            type='number'
            value={values.frameSizeCm ?? ''}
            status={currentErrors.frameSizeCm ? 'error' : undefined}
            onChange={e => updateValue('frameSizeCm', toNumber(Number(e.target.value)))}
          />
          {currentErrors.frameSizeCm && (
            <Typography.Text type='danger'>{currentErrors.frameSizeCm}</Typography.Text>
          )}
        </Col>
        <Col span={8}>
          <label>Wheel size in</label>
          <Input
            type='number'
            value={values.wheelSizeInches ?? ''}
            status={currentErrors.wheelSizeInches ? 'error' : undefined}
            onChange={e => updateValue('wheelSizeInches', toNumber(Number(e.target.value)))}
          />
          {currentErrors.wheelSizeInches && (
            <Typography.Text type='danger'>{currentErrors.wheelSizeInches}</Typography.Text>
          )}
        </Col>
        <Col span={8}>
          <label>Gear count</label>
          <Input
            type='number'
            value={values.gearCount ?? ''}
            status={currentErrors.gearCount ? 'error' : undefined}
            onChange={e => updateValue('gearCount', toNumber(Number(e.target.value)))}
          />
          {currentErrors.gearCount && (
            <Typography.Text type='danger'>{currentErrors.gearCount}</Typography.Text>
          )}
        </Col>
        <Col span={8}>
          <label>Weight kg</label>
          <Input
            type='number'
            value={values.weightKg ?? ''}
            status={currentErrors.weightKg ? 'error' : undefined}
            onChange={e => updateValue('weightKg', toNumber(Number(e.target.value)))}
          />
          {currentErrors.weightKg && (
            <Typography.Text type='danger'>{currentErrors.weightKg}</Typography.Text>
          )}
        </Col>
        <Col span={8}>
          <label>Electric</label>
          <Select
            value={values.electric ? 'yes' : 'no'}
            onChange={v => updateValue('electric', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={8}>
          <label>Price (cents)</label>
          <Input
            type='number'
            value={values.priceCents ?? ''}
            status={currentErrors.priceCents ? 'error' : undefined}
            onChange={e => updateValue('priceCents', toNumber(Number(e.target.value)))}
          />
          {currentErrors.priceCents && (
            <Typography.Text type='danger'>{currentErrors.priceCents}</Typography.Text>
          )}
        </Col>
      </Row>
    </Modal>
  );
};
