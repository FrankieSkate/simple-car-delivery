import axios from "axios";
import { ERROR_ON_SUBMIT, ERROR_ON_GET } from "../utils/errors";
import { errorMessages } from "../utils/errorMessages";

const BASE_URL = "https://sg-mock-api.lalamove.com";

const submitRoute = async (origin, destination) => {
  try {
    const response = await axios.post(`${BASE_URL}/route`, {
      origin,
      destination,
    });
    return response.data.token;
  } catch (error) {
    throw new ERROR_ON_SUBMIT(errorMessages.route.submit);
  }
};

const getRoute = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/route/${token}`);
    return response.data;
  } catch (error) {
    throw new ERROR_ON_GET(errorMessages.route.get);
  }
};

export { submitRoute, getRoute };
