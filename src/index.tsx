import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Meme from './Meme';
import Vanya from './Vanya';
import Statistics from './Statistics';
import { StyledEngineProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/meme",
    element: <Meme />,
  },
  {
    path: "/vanya",
    element: <Vanya />,
  },
  {
    path: "/statistics",
    element: <Statistics />,
  },
]);

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
    <RouterProvider router={router} />
    </StyledEngineProvider>
    <ToastContainer />
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
