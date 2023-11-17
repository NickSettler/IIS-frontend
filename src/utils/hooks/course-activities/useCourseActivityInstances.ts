import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../../../api/course-activities/types';
import { E_COURSE_ENTITY_KEYS } from '../../../api/course/types';
import { useCourseActivities } from './useCourseActivities';
import { ResourceInstance } from '@devexpress/dx-react-scheduler';

export const useCourseActivityInstances = (): Array<ResourceInstance> => {
  const { data } = useCourseActivities();

  if (!data) return [];

  return data.map((item) => {
    const course = item[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE];

    const courseTextPart = course[E_COURSE_ENTITY_KEYS.ABBR];
    const courseActivityTextPart = item[E_COURSE_ACTIVITY_ENTITY_KEYS.FORM];

    const text = `${courseTextPart} - ${courseActivityTextPart}`;

    return {
      id: item[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
      text,
    };
  });
};
