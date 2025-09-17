import { useEffect, useState } from 'react';
import createCheckoutSession from '../api/stripe';
import Stepper, { Step } from '../components/Stepper';
import Magnet from '../components/Magnet';

const Checkout = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for success or cancel parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setMessage('Payment successful! Thank you for your purchase.');
    } else if (urlParams.get('canceled') === 'true') {
      setMessage('Payment canceled. You can try again.');
    }
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const { checkoutUrl } = await createCheckoutSession();
      // Redirect to Stripe's hosted checkout page
      window.location.href = checkoutUrl;
    } catch {
      setMessage('Failed to create checkout session. Please try again.');
      setIsLoading(false);
    }
  };

  return <>
		<Magnet padding={500} disabled={false} magnetStrength={10}>
			<Stepper
				initialStep={1}
				onStepChange={(step) => {
					console.log(step);
				}}
				onFinalStepCompleted={() => console.log("All steps completed!")}
				backButtonText="Previous"
				nextButtonText="Next"
				contentClassName="w-[50dvw]"
			>
				<Step>
					<h2>Welcome to the React Bits stepper!</h2>
					<p>Check out the next step!</p>
				</Step>
				<Step>
					<h2>Step 2</h2>
					<img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" />
					<p>Custom step content!</p>
				</Step>
				<Step>
					<div className="bg-gray-800 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">Abyzma Ticket</h2>
						<p className="text-gray-300 mb-4">Ticket for the event</p>
						<p className="text-2xl font-bold mb-6">$20.00</p>
						
						<button
							onClick={handleCheckout}
							disabled={isLoading}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
						>
							{isLoading ? 'Processing...' : 'Pay with Stripe'}
						</button>
					</div>
				</Step>
				<Step>
					<h2>Final Step</h2>
					<p>You made it!</p>
				</Step>
			</Stepper>
		</Magnet>

		{message && (
			<div className={`mb-6 p-4 rounded text-center ${
				message.includes('successful') 
					? 'bg-green-100 text-green-800' 
					: 'bg-yellow-100 text-yellow-800'
			}`}>
				{message}
			</div>
		)} 
  </>
}

export default Checkout