import { JSX, useMemo, MouseEvent } from 'react';
import { Appointments } from '@devexpress/dx-react-scheduler';
import AppointmentContentProps = Appointments.AppointmentContentProps;
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export const ScheduleAppointmentContent = ({
  data,
  children,
}: AppointmentContentProps): JSX.Element => {
  const title = useMemo(() => {
    return data?.title ?? '';
  }, [data]);

  const dateString = useMemo(() => {
    if (!data.startDate || !data.endDate) return '';

    const format = 'HH:mm';

    const startTime = dayjs(data.startDate).format(format);
    const endTime = dayjs(data.endDate).format(format);

    return `${startTime} - ${endTime}`;
  }, [data.endDate, data.startDate]);

  // const classString = useMemo(() => {
  //   if (!resources.length) return '';
  //
  //   const classResource = find(resources, {
  //     fieldName: E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS,
  //   });
  //
  //   if (!classResource) return '';
  //
  //   return classResource.text;
  // }, [resources]);

  // const teacherString = useMemo(() => {
  //   if (!resources.length) return '';
  //
  //   const teacherResource = find(resources, {
  //     fieldName: E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER,
  //   });
  //
  //   if (!teacherResource) return '';
  //
  //   return teacherResource.text;
  // }, [resources]);

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <Stack
      sx={(theme) => ({
        height: '100%',
        py: 0.5,
        px: 1,
        color: theme.palette.grey['50'],
      })}
    >
      {children}
      <Typography variant={'body2'} fontWeight={'bold'}>
        {title}
      </Typography>
      <Typography variant={'body2'}>{dateString}</Typography>
      <Box flexGrow={1} />
      <Button
        size={'small'}
        onClick={handleButtonClick}
        sx={(theme) => ({
          alignSelf: 'flex-end',
          color: theme.palette.grey['200'],
        })}
      >
        Enroll
      </Button>
      {/* {!isEmpty(classString) && (*/}
      {/*  <Typography variant={'body2'}>*/}
      {/*    Class: <b>{classString}</b>*/}
      {/*  </Typography>*/}
      {/* )}*/}
      {/* {!isEmpty(teacherString) && (*/}
      {/*  <Typography variant={'body2'}>*/}
      {/*    Teacher: <b>{teacherString}</b>*/}
      {/*  </Typography>*/}
      {/* )}*/}
    </Stack>
  );
};
