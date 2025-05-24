import { FC } from 'react';

interface TimeDisplayProps {
  time: string;
}

const TimeDisplay: FC<TimeDisplayProps> = ({ time }) => {
  return (
    <div className="text-xl font-semibold">
      Current Time: {time}
    </div>
  );
};

export default TimeDisplay;
