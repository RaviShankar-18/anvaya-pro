// src/services/agentService.js
import axios from "../utils/axios";

export const agentService = {
  getAgents: async () => {
    try {
      const response = await axios.get("/agents");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
