import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from "react-cookie";

import { Provider } from 'react-redux';
import redux from './Redux/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={redux}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>,
);
