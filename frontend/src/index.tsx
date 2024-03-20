import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { SessionSelector, Study, TestAPI } from './components';
import { Root } from './root';
import { AuthProvider } from './providers/auth-provider';
import { SpotifyAPIProvider } from './providers/spotify-api-provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    element: <AuthProvider><Root/></AuthProvider>,
    errorElement: <div>Error page</div>,
    children: [
      {
        path: "/",
        element: <div style={{textAlign: "center"}}>Please login</div>,
      },
      {
        element: <SpotifyAPIProvider />,
        children: [
          {
            path: "/home",
            element: <SessionSelector />,
          },
          {
            path: "/api",
            element: <TestAPI />,
          },
          {
            path: "/study/:playlist_id",
            element: <Study />,
          },
        ]
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
