import { JSX, SyntheticEvent, useState } from 'react';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import { ProfileUserInfo } from '../../components/profile/user-info';
import { ProfileTeacherRequirements } from '../../components/profile/teacher-requirements';

export enum E_PROFILE_TABS {
  INFO = 'info',
  TEACHER_REQUIREMENTS = 'teacher-requirements',
}

const ProfilePage = (): JSX.Element => {
  const [tab, setTab] = useState<E_PROFILE_TABS>(E_PROFILE_TABS.INFO);

  const handleChange = (_: SyntheticEvent, value: E_PROFILE_TABS) => {
    setTab(value);
  };

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label='User Info' value={E_PROFILE_TABS.INFO} />
        <Tab
          label='Teacher Requirements'
          value={E_PROFILE_TABS.TEACHER_REQUIREMENTS}
        />
      </Tabs>
      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        {tab === E_PROFILE_TABS.INFO && <ProfileUserInfo />}
        {tab === E_PROFILE_TABS.TEACHER_REQUIREMENTS && (
          <ProfileTeacherRequirements />
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
