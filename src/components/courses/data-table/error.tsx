import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { TApiError } from '../../../api/base/types';
import { JSX } from 'react';

export type TCourseDataTableErrorProps = {
  isLoading: boolean;
  error: TApiError | null;
  refetch(): void;
};

export const CourseDataTableError = ({
  isLoading,
  error,
  refetch,
}: TCourseDataTableErrorProps): JSX.Element => (
  <Card>
    <CardContent>
      <Stack
        justifyContent={'space-between'}
        alignItems={'center'}
        direction={'row'}
      >
        {isLoading && <CircularProgress />}
        {error && (
          <>
            <Typography variant={'h6'}>
              Error: {error?.message ?? 'Unknown error'}
            </Typography>
            <Button size={'small'} onClick={async () => refetch()}>
              Retry
            </Button>
          </>
        )}
      </Stack>
    </CardContent>
  </Card>
);
