import { JSX } from 'react';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { Stack, Typography } from '@mui/material';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import ServerService from '../../../api/server/server.service';
import { ErrorOutline } from '@mui/icons-material';

export type TSettingsModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.SETTINGS>;

const SettingsModal = ({ onClose }: TSettingsModalProps): JSX.Element => {
  const restartMutation = useMutation(async () => ServerService.restart());

  const handleRestartClick = () => {
    restartMutation.mutate();
  };

  return (
    <BaseModal show title={'Settings'} onClose={onClose}>
      <Stack alignItems={'start'} spacing={2}>
        <Button
          variant={'contained'}
          color={'error'}
          fullWidth
          disableElevation
          onClick={handleRestartClick}
          startIcon={<ErrorOutline />}
        >
          Restart server
        </Button>
        <Typography color={'error'} align={'justify'}>
          This will restart the server and it will be down for some time. This
          should be used in case you have encountered a bug and you cannot get
          rid of it. This action will delete all entered data and the database
          will be restored to its initial state.
        </Typography>
      </Stack>
    </BaseModal>
  );
};

export default SettingsModal;
