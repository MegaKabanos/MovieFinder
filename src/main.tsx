import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import MoviePage from './components/MoviePage' // Import MoviePage here

const router = createBrowserRouter([
  {
    path: '/', 
    element: <App/>, // homepage
  },
  //{
  //   path: '/movie/:id', 
  //   element: <MoviePage />,
  // },
  {
    path: '/movie/:id',
    element: <MoviePage />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)