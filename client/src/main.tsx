import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import HomeView from './Views/HomeView/HomeView.tsx'

import './index.css'

import App from './App.tsx'
import HotelsView from './Views/HotelsView/HotelsView.tsx'
import HotelView from './Views/HotelView/HotelView.tsx'
import BookingView from './Views/BookingView/BookingView.tsx'
import SuccessBookingView from './Views/BookingView/SuccessBookingView.tsx'

const router = createBrowserRouter([ 
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: HomeView
            },
            {
                path: "/hotels",
                Component: HotelsView
            },
            {
                path: "/booking",
                Component: BookingView
            },
            {
                path: "/booking/confirmation",
                Component: SuccessBookingView
            },
            { 
                path: "/hotels/:hotelId", 
                Component: HotelView 
            },
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider useTransitions router={router} />
  </StrictMode>,
)
