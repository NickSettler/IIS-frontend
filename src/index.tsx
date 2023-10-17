import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { client } from './utils/react-query/client';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme/theme';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './utils/modal/modal-provider';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={client}>
            <ModalProvider>
              <App />
            </ModalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
