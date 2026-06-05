import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import HomeView from './Views/HomeView/HomeView.tsx'

import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([ 
    {
        path: "/",
        Component: App,
        children: [
            {
               index: true,
               Component: HomeView
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
