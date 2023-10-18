import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  closeModal,
  E_MODALS,
  isModalOpenSelector,
  modalMetaSelector,
} from '../../store/modals';
import { useAppDispatch } from '../../store';

type TLazyComponentProps = {
  filename: E_MODALS;
};

export const LazyComponent = ({ filename }: TLazyComponentProps) => {
  const isOpen = useSelector(isModalOpenSelector(filename));

  const meta = useSelector(modalMetaSelector(filename));

  const dispatch = useAppDispatch();

  const handleModalClose = () => {
    dispatch(
      closeModal({
        modal: filename,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const Component = lazy(() => import(`./modals/${filename}.tsx`));

  return (
    <Suspense fallback={null}>
      {filename ? (
        <Component isOpen={isOpen} onClose={handleModalClose} {...meta} />
      ) : null}
    </Suspense>
  );
};
