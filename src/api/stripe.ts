import axios from "axios";

const createCheckoutSession = async (quantity: number, name: string, email: string, cuponCode?: string) => {
    try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, { 
      quantity, 
      name, 
      email, 
      ...(cuponCode && { cuponCode })
    });

    if (response.status !== 200) {
      throw new Error('Failed to create checkout session');
    }
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const checkForSuccess = async (sessionId: string) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/payment-success`, { params: { session_id: sessionId } });
  return response.data;
};

export { createCheckoutSession, checkForSuccess };