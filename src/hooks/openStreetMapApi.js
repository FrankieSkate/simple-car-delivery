import axios from "axios";

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
      throw new Error("Address not found");
    }
    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

export const getAddress = async (lat, lon) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }
  const data = await response.json();
  return { address: data.display_name };
};
