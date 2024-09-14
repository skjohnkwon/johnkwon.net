import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/tailwind.css';
createRoot(document.getElementById('root')).render(React.createElement(StrictMode, null,
    React.createElement(App, null)));
