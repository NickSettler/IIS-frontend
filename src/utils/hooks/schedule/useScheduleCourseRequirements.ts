import { ValidResource } from '@devexpress/dx-react-scheduler';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../../api/schedule/types';
import { useCourseActivity } from '../course-activities/useCourseActivity';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../../../api/course-activities/types';

export type TUseScheduleCourseActivityRequirementsProps = {
  value: string;
  resource: ValidResource;
};

export const useScheduleCourseActivityRequirements = ({
  value,
  resource,
}: TUseScheduleCourseActivityRequirementsProps): string => {
  const [courseRequirements, setCourseRequirements] = useState<string>('');

  const { data: courseData } = useCourseActivity(value, {
    enabled:
      !isEmpty(value) &&
      resource.fieldName === E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY,
  });

  useEffect(() => {
    if (
      courseData &&
      courseData[E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS] !==
        courseRequirements
    ) {
      setCourseRequirements(
        courseData[E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData]);

  return courseRequirements;
};
