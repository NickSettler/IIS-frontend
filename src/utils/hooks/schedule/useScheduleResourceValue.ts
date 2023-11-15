import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { find } from 'lodash';
import {
  ValidResource,
  ValidResourceInstance,
} from '@devexpress/dx-react-scheduler';

export type TUseScheduleResourceValueProps = {
  appointmentResources: Array<ValidResourceInstance>;
  resource: ValidResource;
  onResourceChange(nextValue: Array<number | string> | number | string): void;
};

export const useScheduleResourceValue = ({
  appointmentResources,
  resource,
  onResourceChange,
}: TUseScheduleResourceValueProps): [
  string,
  Dispatch<SetStateAction<string>>,
] => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const currentResource = find(appointmentResources, {
      fieldName: resource.fieldName,
    });

    if (!currentResource) return;

    setValue(`${currentResource.id}`);
  }, [appointmentResources, resource]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onResourceChange({ [resource.fieldName]: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
};
