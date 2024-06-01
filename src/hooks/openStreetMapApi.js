import axios from "axios";
import { ERROR_ON_GET, ERROR_ON_FETCH } from "../utils/errors";
import { errorMessages } from "../utils/errorMessages";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

export const getCoordinates = async address => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        format: "json",
        q: address,
      },
    });
    if (response.data.length === 0) {
      throw new ERROR_ON_GET(errorMessages.address.notFound);
    }
    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  } catch (error) {
    throw new ERROR_ON_FETCH(errorMessages.address.coordinates);
  }
};

export const getAddress = async (lat, lon) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    const data = await response.json();
    return { address: data.display_name };
  } catch {
    throw new ERROR_ON_GET(errorMessages.address.get);
  }
};
