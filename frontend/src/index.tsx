import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { Study } from './components';
import { Root } from './routes/root';
import { HomePage } from './routes/home-page';
import { ErrorPage } from './routes/error-page';
import { PlaylistSelectionPage, playlistLoader } from './routes/playlist-selection-page';
import { APIErrorPage } from './routes/api-error-page';
import { studyLoader } from './components/study/Study';
import { spotifyAPILoader } from './lib/spotify-api';
import { trainingLoader, TrainingPage } from './routes/training-page';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    element: <Root />,
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
            path: "/study/:playlist_id",
            loader: studyLoader,
            element: <Study />,
          },
          {
            path: "/train/:playlist_id",
            element: <TrainingPage />,
            loader: trainingLoader,
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
