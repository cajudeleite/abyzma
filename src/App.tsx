import logo from './assets/logo.png'
import FuzzyImage from './components/FuzzyImage'
import FuzzyText from './components/FuzzyText'
import Noise from './components/Noise'

const App = () => {
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
        baseIntensity={0.4}
        hoverIntensity={0.6}
        enableHover={true}
      />
      <FuzzyText 
        baseIntensity={0.1} 
        hoverIntensity={0.2} 
        enableHover={true}
        fontFamily='Anthrope'
        className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold select-none tracking-widest'
      >
        coming soon
      </FuzzyText>
    </div>
  )
}

export default App
