import axios from "axios";

const fetchCupon = async (cuponCode: string) => {
	const response = await axios.get(`${import.meta.env.VITE_API_URL}/cupon/${cuponCode}`);
	const data = await response.data;
	
	return data;
};
  

export { fetchCupon }