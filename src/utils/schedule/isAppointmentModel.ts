import { AppointmentModel } from '@devexpress/dx-react-scheduler';

export const isAppointmentModel = (
  value: Record<PropertyKey, any>,
): value is AppointmentModel => {
  return 'startDate' in value && 'title' in value;
};
