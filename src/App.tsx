import logo from './assets/images/logo.png'
import Dock from './components/Dock'
import FuzzyImage from './components/FuzzyImage'
import FuzzyText from './components/FuzzyText'
import Noise from './components/Noise'
import CountUp from './components/CountUp'
import SplitText from './components/SplitText'
import InstagramAnimation from './components/InstagramAnimation'
import { useEffect, useState } from 'react'
import { fetchCurrentPhaseTicketsAmount } from './api/phase'

const App = () => {
  const [currentPhaseName, setCurrentPhaseName] = useState('');
  const [currentPhaseTicketsAmount, setCurrentPhaseTicketsAmount] = useState(null);
  const [currentPhaseTicketsLeft, setCurrentPhaseTicketsLeft] = useState(null);

  useEffect(() => {
    fetchCurrentPhaseTicketsAmount().then((data) => {      
      setCurrentPhaseName(data.name);
      setCurrentPhaseTicketsAmount(data.ticket_amount);
      setCurrentPhaseTicketsLeft(data.tickets_left);
    });
  }, []);

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

  return (
    <div className="h-[100dvh] w-[100dvw] bg-abyzma-dark text-abyzma-light flex flex-col items-center justify-center relative space-y-10 overflow-hidden">
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={20}
      />
      <FuzzyImage
        src={logo}
        className='hidden w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4'
        baseIntensity={0.6}
        hoverIntensity={0.8}
        enableHover={true}
      />
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={0.3} 
        enableHover={true}
        className='hidden text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold select-none'
      >
        COMING SOON
      </FuzzyText>
      <h1 className="hidden text-6xl font-bold masked-text">
        Roots of the Fall
      </h1>
      <SplitText
        text={currentPhaseName}
        className="text-6xl font-bold"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />
      {currentPhaseTicketsAmount && currentPhaseTicketsLeft && <>
        <CountUp
          from={currentPhaseTicketsAmount}
          to={currentPhaseTicketsLeft}
          separator=","
          direction="up"
          duration={1}
          className="text-6xl font-bold"
          />
        <p className='text-2xl font-bold'>Tickets left</p>
      </>}
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
  )
}

export default App
