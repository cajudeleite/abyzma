import { useEffect, useState } from 'react';
import createCheckoutSession from '../api/stripe';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-abyzma-dark text-abyzma-light">
      <div className="max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        {message && (
          <div className={`mb-6 p-4 rounded text-center ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {message}
          </div>
        )}
        
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
      </div>
    </div>
  )
}

export default Checkout