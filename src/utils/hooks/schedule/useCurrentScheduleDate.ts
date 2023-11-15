import { useState } from 'react';

export type TUseLastScheduleDate = {
  currentScheduleDate: Date;
  handleCurrentScheduleDateChange(newDate: Date): void;
};

export const useCurrentScheduleDate = (): TUseLastScheduleDate => {
  const [currentScheduleDate, setCurrentScheduleDate] = useState<Date>(
    new Date(),
  );

  const handleCurrentScheduleDateChange = (newDate: Date) => {
    setCurrentScheduleDate(newDate);
  };

  return {
    currentScheduleDate,
    handleCurrentScheduleDateChange,
  };
};
