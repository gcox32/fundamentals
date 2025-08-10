import Modal from '@/components/common/Modal';
import FearGreedContainer from './FearGreedContainer';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    value: string;
    previous?: { value: number; valueText: string };
    oneWeekAgo?: { value: number; valueText: string };
    oneMonthAgo?: { value: number; valueText: string };
    oneYearAgo?: { value: number; valueText: string };
    lastUpdated?: string;
  };
};

export default function FearGreedModal({ isOpen, onClose, data }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fear & Greed Index" maxWidth="900px">
      <FearGreedContainer data={data} />
    </Modal>
  );
}