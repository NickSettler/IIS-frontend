import { JSX, useMemo } from 'react';
import { AppointmentForm } from '@devexpress/dx-react-scheduler';
import ResourceEditorProps = AppointmentForm.ResourceEditorProps;
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  ListItemIcon,
  MenuItem,
  Select,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useScheduleTeacherRequirements } from '../../utils/hooks/schedule/useScheduleTeacherRequirements';
import { useScheduleResourceValue } from '../../utils/hooks/schedule/useScheduleResourceValue';
import {
  groupTeacherRequirements,
  TGroupedTeacherRequirements,
} from '../../utils/teacher-requirements/group';
import { E_TEACHER_REQUIREMENT_MODE } from '../../api/teacher-requirements/types';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../api/schedule/types';
import { useScheduleCourseActivityRequirements } from '../../utils/hooks/schedule/useScheduleCourseRequirements';
import { isEmpty } from 'lodash';

export const ScheduleResourceEditor = ({
  appointmentResources,
  resource,
  onResourceChange,
}: ResourceEditorProps): JSX.Element => {
  const { instances } = resource;

  const [value, setValue] = useScheduleResourceValue({
    appointmentResources,
    resource,
    onResourceChange,
  });

  const teacherRequirements = useScheduleTeacherRequirements({
    value,
    resource,
  });

  const courseRequirements = useScheduleCourseActivityRequirements({
    value,
    resource,
  });

  const teacherRequirementsGrouped: TGroupedTeacherRequirements =
    useMemo(() => {
      if (!teacherRequirements.length) return {} as TGroupedTeacherRequirements;

      return groupTeacherRequirements(teacherRequirements);
    }, [teacherRequirements]);

  const handleChange = (e: SelectChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <FormControl
      fullWidth
      sx={{
        mt: 2,
      }}
    >
      <InputLabel>{resource.title}</InputLabel>
      <Select label={resource.title} onChange={handleChange} value={value}>
        {instances.map((instance) => (
          <MenuItem key={instance.id} value={instance.id}>
            <ListItem sx={{ p: 0 }} component={'div'}>
              <ListItemIcon sx={{ minWidth: 24, height: 24, mr: 1 }}>
                <Circle sx={{ color: instance.color['400'] }} />
              </ListItemIcon>
              <ListItemText primary={instance.text} />
            </ListItem>
          </MenuItem>
        ))}
      </Select>
      {resource.fieldName === E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER &&
        !isEmpty(value) && (
          <FormHelperText>
            Include:{' '}
            {teacherRequirementsGrouped[E_TEACHER_REQUIREMENT_MODE.INCLUDE] ??
              'nothing'}
            <br />
            Exclude:{' '}
            {teacherRequirementsGrouped[E_TEACHER_REQUIREMENT_MODE.EXCLUDE] ??
              'nothing'}
          </FormHelperText>
        )}
      {resource.fieldName === E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY &&
        !isEmpty(value) &&
        !isEmpty(courseRequirements) && (
          <FormHelperText>{courseRequirements}</FormHelperText>
        )}
    </FormControl>
  );
};
