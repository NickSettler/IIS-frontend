import React, { ChangeEvent, JSX, useMemo, useState } from 'react';
import {
  Toolbar,
  Typography,
  AppBar as MUIAppBar,
  styled,
  alpha,
  InputBase,
  Stack,
  IconButton,
} from '@mui/material';
import { Link } from '../../utils/router/link';
import { useCurrentRoute } from '../../utils/hooks/router/useCurrentRoute';
import { Settings, Search as SearchIcon } from '@mui/icons-material';
import { debounce } from 'lodash';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background'),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '44ch',
      '&:focus': {
        width: '52ch',
      },
    },
  },
}));

export const AppBar = (): JSX.Element => {
  const currentRoute = useCurrentRoute();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const searchCall = (query: string) => {
    // Search logic
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateURL = useMemo(() => debounce(searchCall, 1000), []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <MUIAppBar
      position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography
          component={Link}
          to={'/'}
          variant='h6'
          noWrap
          color={'inherit'}
          style={{ textDecoration: 'none' }}
        >
          Schedule Planner {currentRoute ? `- ${currentRoute.label}` : ''}
        </Typography>
        <Stack
          direction={'row'}
          justifyContent={'center'}
          spacing={1}
          flexGrow={1}
          component={'form'}
          // onSubmit={handleSubmit}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search'
            />
          </Search>
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <IconButton color={'inherit'} onClick={() => {}}>
            <Settings />
          </IconButton>
        </Stack>
      </Toolbar>
    </MUIAppBar>
  );
};
