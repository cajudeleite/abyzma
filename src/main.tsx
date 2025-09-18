import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Dock from './components/Dock'
import Noise from './components/Noise.tsx';
import InstagramAnimation from './components/InstagramAnimation'
import './index.css'
import App from './pages/App.tsx'
import Checkout from './pages/Checkout.tsx'
import Success from './pages/Success.tsx';
import logo from './assets/images/logo.png'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/success",
    element: <Success />,
  },
]);

const items = [
  { 
    icon: (
      <InstagramAnimation 
        size={40} 
        strokeColor='#d7cec7' 
        fillColor='#d7cec7'
      />
    ), 
    label: 'Instagram', 
    onClick: () => window.open('https://www.instagram.com/abyzmacrew/', '_blank') 
  }
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="h-[100dvh] w-[100dvw] bg-abyzma-dark text-abyzma-light flex flex-col items-center justify-center relative space-y-10 overflow-hidden">
      <img src={logo} alt="Abyzma" className='absolute top-4 right-4 size-14 sm:size-16 md:size-20 cursor-pointer' onClick={() => router.navigate('/')} />
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={20}
      />
      <RouterProvider router={router} />
      <div className="absolute bottom-0">
        <Dock 
          items={items}
          panelHeight={70}
          baseItemSize={50}
          magnification={60}
          className='border-none *:border-abyzma-light *:bg-transparent'
        />
      </div>
    </div>
  </StrictMode>,
)
