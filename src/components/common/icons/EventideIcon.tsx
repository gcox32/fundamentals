import Image from 'next/image';

export default function EventideIcon() {
  return (
    <Image
      src="/images/icons/eventide.svg"
      alt="Eventide icon"
      width={16}
      height={16}
      style={{ filter: 'var(--icon-filter)' }}
    />
  );
} 