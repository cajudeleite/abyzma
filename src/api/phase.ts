import axios from "axios";
import type Phase from "../types/phase";

const fetchCurrentPhaseTicketsAmount = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/phases/current`);
  const data = await response.data;
  return data;
};

const fetchPhases = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/phases`);
  const data = await response.data.phases;
  
  return data as Phase[];
};

export { fetchCurrentPhaseTicketsAmount, fetchPhases };