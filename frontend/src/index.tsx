import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { TestAPI } from './components/test-api/TestAPI';
import { Home } from './components/home/Home';
import { Study } from './components/study/Study';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/api",
    element: <TestAPI />,
  },
  {
    path: "/study/:playlist_id",
    element: <Study />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
