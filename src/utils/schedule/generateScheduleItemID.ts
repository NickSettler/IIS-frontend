import { AppointmentModel } from '@devexpress/dx-react-scheduler';
import { v4 } from 'uuid';

export const generateScheduleItemID = (
  items: Array<AppointmentModel>,
): string => {
  const ids = items.map((item) => item.id);

  const generateID = (): string => {
    const id = v4();

    if (ids.includes(id)) return generateID();

    return id;
  };

  return generateID();
};
