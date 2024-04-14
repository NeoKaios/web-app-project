import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { Root } from './routes/root';
import { IndexPage } from './routes/index-page';
import { ErrorPage } from './routes/error-page';
import { HomePage, playlistLoader } from './routes/home-page';
import { APIErrorPage } from './routes/api-error-page';
import { spotifyAPILoader } from './lib/spotify-api';
import { trainingLoader, TrainingPage } from './routes/game/training-page';
import { studyLoader, StudyPage } from './routes/game/study-page';
import { progressionLoader, ProgressionPage } from './routes/game/progression-page';
import { requestsLoader, RequestsPage } from './routes/admin/requests-page';
import { LoginPage } from './routes/login-page';
import { analyseLoader, AnalysePage } from './routes/admin/analyse-page';
import { adminSecureLoader } from './lib/backend-api';
import { HardcorePage } from './routes/game/hardcore-page';

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
        element: <IndexPage />,
      },
      {
        loader: spotifyAPILoader,
        errorElement: <APIErrorPage />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            loader: adminSecureLoader,
            errorElement: <APIErrorPage />,
            children: [
              {
                path: "/analyse/:playlist_id",
                element: <AnalysePage />,
                loader: analyseLoader,
              },
              {
                path: "/requests",
                element: <RequestsPage />,
                loader: requestsLoader,
              }
            ],
          },
          {
            path: "/home",
            element: <HomePage />,
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
          {
            path: "/hardcore/:playlist_id",
            element: <HardcorePage />,
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
