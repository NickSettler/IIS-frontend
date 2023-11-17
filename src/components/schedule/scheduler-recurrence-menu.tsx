import { EditRecurrenceMenu } from '@devexpress/dx-react-scheduler-material-ui';
import { JSX } from 'react';

export const SchedulerRecurrenceMenu = (
  props: EditRecurrenceMenu.LayoutProps,
): JSX.Element => {
  return (
    <EditRecurrenceMenu.Layout
      {...props}
      availableOperations={[
        {
          value: 'all',
          title: 'All appointments',
        },
      ]}
    ></EditRecurrenceMenu.Layout>
  );
};
