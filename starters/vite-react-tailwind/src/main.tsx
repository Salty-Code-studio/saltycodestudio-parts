import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// index.css pulls in the brand foundations (tokens → typography → palettes)
// and the three @tailwind layers. Importing it here is what makes every
// `bg-coral`, `font-display`, `var(--space-section)` etc. resolve.
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
