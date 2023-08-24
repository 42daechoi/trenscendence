import axios from "axios";

export const whoami = async () => {
  try {
    const response = await axios.get("http://localhost:3001/users/whoami", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
