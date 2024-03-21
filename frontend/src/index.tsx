import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { Study, TestAPI } from './components';
import { Root } from './routes/root';
import { AuthProvider } from './providers/auth-provider';
import { HomePage } from './routes/home-page';
import { ErrorPage } from './routes/error-page';
import { PlaylistSelectionPage, loader as playlistLoader } from './routes/playlist-selection-page';
import { loader as spotifyAPILoader, APIErrorPage } from './routes/api-error-page';
import { loader as studyLoader } from './components/study/Study';

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
        loader: spotifyAPILoader,
        errorElement: <APIErrorPage />,
        children: [
          {
            path: "/home",
            element: <PlaylistSelectionPage />,
            loader: playlistLoader,
          },
          {
            path: "/api",
            element: <TestAPI />,
          },
          {
            path: "/study/:playlist_id",
            loader: studyLoader,
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
