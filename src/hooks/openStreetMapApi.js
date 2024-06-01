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

export const getSuggestions = async query => {
  if (!query) return [];
  // bounding for Hong Kong area, so that the predictions are more relevant
  const boundingBox = "113.8180,22.5202,114.5024,22.1533";
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    format: "json",
    q: query,
    viewbox: boundingBox,
    bounded: 1,
  });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item, index) => ({
      label: item.display_name,
      lat: item.lat,
      lon: item.lon,
      key: `${item.display_name}-${index}`,
    }));
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return [];
  }
};
