import '@mantine/core/styles.css';
import './app.css'
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div className='content'>
      <Router />
      </div>
    </MantineProvider>
  );
}
