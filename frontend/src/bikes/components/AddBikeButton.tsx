import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface AddBikeButtonProps {
  onClick: () => void;
}

export const AddBikeButton = ({ onClick }: AddBikeButtonProps) => (
  <Button type='primary' icon={<PlusOutlined />} onClick={onClick}>
    Add bike
  </Button>
);
