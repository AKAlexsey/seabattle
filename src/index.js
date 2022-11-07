import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Battlefield from './Battlefield';
import EditPage from './EditPage';
import { AppProvider } from './context';
// import 


import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'

const router = createBrowserRouter([
  { path: "/", element: <EditPage />},
  { path: "/battlefield", element: <Battlefield />},
  { path: "/test", element: <h1>ROuter works</h1> },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);

