import axios from "axios";

const BASE_URL = "https://sg-mock-api.lalamove.com";

const submitRoute = async (origin, destination) => {
  try {
    const response = await axios.post(`${BASE_URL}/route`, {
      origin,
      destination,
    });
    return response.data.token;
  } catch (error) {
    console.error("Error submitting route:", error);
    throw error;
  }
};

const getRoute = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/route/${token}`);
    return response.data;
  } catch (error) {
    console.error("Error getting route:", error);
    throw error;
  }
};

export { submitRoute, getRoute };
