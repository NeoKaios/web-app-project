import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { Root } from './routes/root';
import { HomePage } from './routes/home-page';
import { ErrorPage } from './routes/error-page';
import { PlaylistSelectionPage, playlistLoader } from './routes/playlist-selection-page';
import { APIErrorPage } from './routes/api-error-page';
import { spotifyAPILoader } from './lib/spotify-api';
import { trainingLoader, TrainingPage } from './routes/training-page';
import { studyLoader, StudyPage } from './routes/study-page';
import { progressionLoader, ProgressionPage } from './routes/progression-page';

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
            path: "/progression/:playlist_id",
            loader: progressionLoader,
            element: <ProgressionPage />,
          },
          {
            path: "/study/:playlist_id",
            loader: studyLoader,
            element: <StudyPage />,
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
