import { useLocalStorage } from 'usehooks-ts';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
} from '../../../api/user/types';
import { E_LOCAL_STORAGE_KEYS } from '../../local-storage';
import { useMemo } from 'react';
import { map } from 'lodash';

export type TUseLocalUserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  roles: Array<E_ROLE>;
};

export const useLocalUserInfo = (): TUseLocalUserInfo => {
  const [user] = useLocalStorage<TApiUserWithRoles | null>(
    E_LOCAL_STORAGE_KEYS.USER_INFO,
    null,
  );

  const id = useMemo(() => user?.[E_USER_ENTITY_KEYS.ID] ?? '', [user]);
  const firstName = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.FIRST_NAME] ?? '',
    [user],
  );
  const lastName = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.LAST_NAME] ?? '',
    [user],
  );
  const username = useMemo(
    () => user?.[E_USER_ENTITY_KEYS.USERNAME] ?? '',
    [user],
  );

  const roles = useMemo(() => {
    return map(user?.[E_USER_ENTITY_KEYS.ROLES], E_ROLE_ENTITY_KEYS.NAME);
  }, [user]);

  return {
    id,
    firstName,
    lastName,
    username,
    roles,
  };
};
