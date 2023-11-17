import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../../api/teacher-requirements/types';
import { ValidResource } from '@devexpress/dx-react-scheduler';
import { useEffect, useState } from 'react';
import { useTeacherRequirements } from '../teacher-requirements/useTeacherRequirements';
import { isEmpty, sortBy } from 'lodash';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../../api/schedule/types';
import { compare } from '../../object/compare';

export type TUseScheduleTeacherRequirementsProps = {
  value: string;
  resource: ValidResource;
};

export const useScheduleTeacherRequirements = ({
  value,
  resource,
}: TUseScheduleTeacherRequirementsProps): Array<TTeacherRequirement> => {
  const [teacherRequirements, setTeacherRequirements] = useState<
    Array<TTeacherRequirement>
  >([]);

  const { data: teacherRequirementsData } = useTeacherRequirements(
    {
      enabled:
        !isEmpty(value) &&
        resource.fieldName === E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER,
    },
    value,
  );

  useEffect(() => {
    const sortedTeacherRequirements = sortBy(
      teacherRequirements,
      E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID,
    );
    const sortedTeacherData = sortBy(
      teacherRequirementsData,
      E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID,
    );

    if (
      teacherRequirementsData &&
      !compare(sortedTeacherRequirements, sortedTeacherData)
    ) {
      setTeacherRequirements(teacherRequirementsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherRequirementsData]);

  return teacherRequirements;
};
