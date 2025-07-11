import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const LeadForm = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: 30,
    priority: "Medium",
  });

  const sourceOptions = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const statusOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const priorityOptions = ["High", "Medium", "Low"];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch agents and tags in parallel
      const [agentsResponse, tagsResponse] = await Promise.all([
        axios.get("/agents"),
        axios.get("/tags"),
      ]);

      setAgents(agentsResponse.data);
      setTags(tagsResponse.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // Ensure we're sending the correct format for both salesAgent and tags
        salesAgent: formData.salesAgent,
        tags: formData.tags,
      };

      await axios.post("/leads", payload);
      navigate("/leads");
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData((prevData) => {
      const currentTags = prevData.tags || [];
      const tagExists = currentTags.includes(tagId);

      return {
        ...prevData,
        tags: tagExists
          ? currentTags.filter((id) => id !== tagId)
          : [...currentTags, tagId],
      };
    });
  };

  return (
    <div className="p-4">
      <h2>Add New Lead</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Lead Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter lead name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lead Source</Form.Label>
          <Form.Select
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            required
          >
            <option value="">Select Source</option>
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Assigned Sales Agent</Form.Label>
          <Form.Select
            value={formData.salesAgent}
            onChange={(e) =>
              setFormData({ ...formData, salesAgent: e.target.value })
            }
            required
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lead Status</Form.Label>
          <Form.Select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Form.Check
                key={tag.id}
                type="checkbox"
                id={`tag-${tag.id}`}
                label={tag.name}
                checked={formData.tags.includes(tag.id)}
                onChange={() => handleTagToggle(tag.id)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time to Close (Days)</Form.Label>
          <Form.Control
            type="number"
            value={formData.timeToClose}
            onChange={(e) =>
              setFormData({
                ...formData,
                timeToClose: parseInt(e.target.value),
              })
            }
            min="1"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Lead
        </Button>
      </Form>
    </div>
  );
};

export default LeadForm;
