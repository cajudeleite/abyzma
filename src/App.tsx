import logo from './assets/images/logo.png'
import Dock from './components/Dock'
import FuzzyImage from './components/FuzzyImage'
import FuzzyText from './components/FuzzyText'
import Noise from './components/Noise'
import InstagramAnimation from './components/InstagramAnimation'

const App = () => {
  const items = [
    { 
      icon: (
        <InstagramAnimation 
          size={40} 
          strokeColor='white' 
          fillColor='white'
        />
      ), 
      label: 'Instagram', 
      onClick: () => window.open('https://www.instagram.com/abyzmacrew/', '_blank') 
    }
  ];

  return (
    <div className="h-screen w-screen bg-abyzma-dark text-abyzma-light flex flex-col items-center justify-center relative space-y-10 overflow-hidden">
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={20}
      />
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
      <h1 className="hidden text-6xl font-bold masked-text">
        Roots of the Fall
      </h1>
      <div className="absolute bottom-2">
        <Dock 
          items={items}
          panelHeight={70}
          baseItemSize={50}
          magnification={60}
          className='border-none *:border-white *:bg-transparent'
        />
      </div>
    </div>
  )
}

export default App
