import { JSX, useState } from 'react';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AppointmentForm } from '@devexpress/dx-react-scheduler';
import DateEditorProps = AppointmentForm.DateEditorProps;

export const ScheduleDateEditor = ({
  value,
  onValueChange,
}: DateEditorProps): JSX.Element => {
  const [pickerValue, setPickerValue] = useState<dayjs.Dayjs>(dayjs(value));

  const handleChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    setPickerValue(date);
    onValueChange(date.toDate());
  };

  return (
    <DateTimePicker
      value={pickerValue}
      onChange={handleChange}
      timezone={'system'}
      ampm={false}
      ampmInClock={false}
      sx={{
        flexGrow: 1,
        mt: 2,
      }}
    ></DateTimePicker>
  );
};
