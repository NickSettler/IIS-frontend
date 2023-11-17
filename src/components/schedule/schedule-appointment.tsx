import { JSX, MouseEvent } from 'react';
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import AppointmentProps = Appointments.AppointmentProps;
import { Color, styled } from '@mui/material';
import { blue } from '@mui/material/colors';
import { ValidResourceInstance } from '@devexpress/dx-react-scheduler';

export const ensureColor = (level: keyof Color, color: Color) =>
  color[level] || blue[level];

export const getResourceColor = (
  resources: Array<ValidResourceInstance>,
): Color | string | undefined => {
  if (resources?.length) {
    return resources.find((resource: ValidResourceInstance) => resource.isMain)
      ?.color;
  }
  return undefined;
};

export const getAppointmentColor = (
  level: keyof Color,
  color: Color | string | undefined,
  defaultColor: Color,
) => {
  if (!color) return ensureColor(level, defaultColor);
  if (typeof color === 'string') return color;
  return ensureColor(level, color);
};

const StyledDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'resources',
})<{ resources: Array<ValidResourceInstance> }>(
  ({ theme: { palette, typography, spacing }, resources }) => ({
    ['&']: {
      userSelect: 'none',
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      border: `1px solid ${palette.background.paper}`,
      backgroundClip: 'padding-box',
      borderRadius: spacing(0.5),
      ...typography.caption,
      '&:focus': {
        backgroundColor: getAppointmentColor(
          100,
          getResourceColor(resources),
          blue,
        ),
        outline: 0,
      },
      transition: 'background-color 0.1s ease-in-out',
      cursor: 'pointer',
      backgroundColor: getAppointmentColor(
        300,
        getResourceColor(resources),
        blue,
      ),
      '&:hover': {
        backgroundColor: getAppointmentColor(
          400,
          getResourceColor(resources),
          blue,
        ),
      },
    },
  }),
);

export const ScheduleAppointment = ({
  children,
  data,
  resources,
  onClick: handleClick,
  onDoubleClick,
}: AppointmentProps): JSX.Element => {
  const onClick = handleClick
    ? (e: MouseEvent<HTMLDivElement>) => {
        handleClick({ target: e.target, data });
      }
    : () => {};

  return (
    <StyledDiv
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      resources={resources}
    >
      {children}
    </StyledDiv>
  );
};
