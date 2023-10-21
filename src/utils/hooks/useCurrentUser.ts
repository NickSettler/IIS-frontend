import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../local-storage';
import { TApiUserWithRoles } from '../../api/user/types';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] =
    useLocalStorage<TApiUserWithRoles | null>(
      E_LOCAL_STORAGE_KEYS.USER_INFO,
      null,
    );

  return {
    currentUser,
    setCurrentUser,
  };
};
