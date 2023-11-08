import {
  closeModal,
  E_MODALS,
  isModalOpenSelector,
  openModal,
  TDynModalMeta,
} from '../../../store/modals';
import { useAppDispatch } from '../../../store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useModal = <K extends E_MODALS>(modalFileName: K) => {
  const dispatch = useAppDispatch();

  const onOpen = useCallback(
    (meta: TDynModalMeta<K>) => dispatch(openModal(modalFileName, meta)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalFileName],
  );
  const onClose = useCallback(
    () =>
      dispatch(
        closeModal({
          modal: modalFileName,
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalFileName],
  );

  const isOpen = useSelector(isModalOpenSelector(modalFileName));

  return {
    isOpen,
    onOpen,
    onClose,
  };
};
