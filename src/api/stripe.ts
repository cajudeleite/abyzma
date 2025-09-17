import axios from "axios";

const createCheckoutSession = async () => {
    try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`);
    if (response.status !== 200) {
      throw new Error('Failed to create checkout session');
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default createCheckoutSession;