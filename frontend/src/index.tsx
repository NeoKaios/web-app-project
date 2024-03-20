import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { SessionSelector, Study, TestAPI } from './components';
import { Root } from './root';
import { AuthProvider } from './providers/auth-provider';
import { loader as spotifyAPILoader, SpotifyAPIProvider } from './providers/spotify-api-provider';
import { HomePage } from './routes/home-page';
import { ErrorPage } from './routes/error-page';
import { PlaylistSelectionPage, loader as playlistLoader } from './routes/playlist-selection-page';
import { APIErrorPage } from './routes/api-error-page';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    element: <AuthProvider><Root /></AuthProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        element: <SpotifyAPIProvider />,
        loader: spotifyAPILoader,
        errorElement: <APIErrorPage />,
        children: [
          {
            path: "/home",
            element: <SessionSelector />,
          },
          {
            path: "/home2",
            element: <PlaylistSelectionPage />,
            loader: playlistLoader,
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
