import logo from '../assets/images/logo.png'
import FuzzyImage from '../components/FuzzyImage'
import FuzzyText from '../components/FuzzyText'
import CountUp from '../components/CountUp'
import SplitText from '../components/SplitText'
import { useEffect, useState } from 'react'
import { fetchCurrentPhaseTicketsAmount } from '../api/phase'

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

  return (
    <>
      <FuzzyImage
        src={logo}
        className='w-2/3 sm:w-1/2 md:w-1/3 xl:w-1/4'
        baseIntensity={0.6}
        hoverIntensity={0.8}
        enableHover={true}
      />
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={0.3} 
        enableHover={true}
        className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold select-none'
      >
        COMING SOON
      </FuzzyText>
      {currentPhaseTicketsAmount && currentPhaseTicketsLeft && <>
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
    </>
  )
}

export default App
