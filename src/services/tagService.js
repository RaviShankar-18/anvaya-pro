import axios from "../utils/axios";

export const tagService = {
  createTag: async (tagName) => {
    try {
      const response = await axios.post("/tags", { name: tagName });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getTags: async () => {
    try {
      const response = await axios.get("/tags");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
