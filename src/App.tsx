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
        width={300}
        height={300}
        baseIntensity={0.1}
        hoverIntensity={0.3}
        enableHover={false}
      />
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={0.3} 
        enableHover={false}
        fontSize="clamp(3rem, 8vw, 7rem)"
      >
        COMING SOON
      </FuzzyText>
    </div>
  )
}

export default App
