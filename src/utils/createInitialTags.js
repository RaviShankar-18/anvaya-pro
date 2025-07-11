import axios from "./axios";

const initialTags = [
  { name: "High Value" },
  { name: "Tech" },
  { name: "Finance" },
  { name: "Healthcare" },
  { name: "Follow-up" },
];

export const createInitialTags = async () => {
  try {
    for (const tag of initialTags) {
      await axios.post("/tags", tag);
    }
    console.log("Tags created successfully");
  } catch (error) {
    console.error("Error creating tags:", error);
  }
};
