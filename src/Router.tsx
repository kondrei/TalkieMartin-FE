import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import Logout from './components/logout';
import EditPage from './pages/edit.page';
import ErrorPage from './pages/Error.page';
import { HomeContent, HomePage } from './pages/Home.page';
import Login from './pages/Login.page';
import { Memories } from './pages/Memories.page';
import UploadMemoryPage from './pages/upload.memory';

export function Router() {
  const routes = [
    {
      path: '/',
      element: <HomePage />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomeContent /> },
        { path: 'login', element: <Login /> },
        {
          path: 'memories/:id?',
          element: (
            <RequireAuth>
              <Memories />
            </RequireAuth>
          ),
        },
        {
          path: 'upload-memory',
          element: (
            <RequireAuth>
              <UploadMemoryPage />
            </RequireAuth>
          ),
        },
        {
          path: 'edit/:id?',
          element: (
            <RequireAuth>
              <EditPage />
            </RequireAuth>
          ),
        },
        { path: 'logout', element: <Logout /> },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
