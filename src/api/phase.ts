import axios from "axios";

const fetchCurrentPhaseTicketsAmount = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/phases/current`);
  const data = await response.data;
  return data;
};

export { fetchCurrentPhaseTicketsAmount };