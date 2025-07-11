// components/modals/AddLeadModal.jsx
import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Badge, Alert } from "react-bootstrap";
import axios from "../../utils/axios";

const AddLeadModal = ({ show, onHide, onLeadCreated }) => {
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    if (show) {
      fetchInitialData();
    }
  }, [show]);

  const fetchInitialData = async () => {
    try {
      const [agentsResponse, tagsResponse] = await Promise.all([
        axios.get("/agents"),
        axios.get("/tags"),
      ]);

      setAgents(agentsResponse.data);
      setTags(tagsResponse.data);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load form data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        salesAgent: formData.salesAgent,
        tags: formData.tags,
      };

      await axios.post("/leads", payload);

      // Reset form
      setFormData({
        name: "",
        source: "",
        salesAgent: "",
        status: "New",
        tags: [],
        timeToClose: 30,
        priority: "Medium",
      });

      // Notify parent component
      onLeadCreated();
      onHide();
    } catch (error) {
      console.error("Error creating lead:", error);
      setError(error.response?.data?.error || "Failed to create lead");
    } finally {
      setLoading(false);
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

  const getPriorityVariant = (priority) => {
    return priority === "High"
      ? "danger"
      : priority === "Medium"
      ? "warning"
      : "success";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h4 fw-bold">
          <i className="bi bi-plus-circle me-2 text-primary"></i>
          Add New Lead
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-building me-2"></i>
                  Lead Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter company/lead name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-globe me-2"></i>
                  Lead Source
                </Form.Label>
                <Form.Select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  required
                  className="shadow-sm"
                >
                  <option value="">Select Source</option>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-person-circle me-2"></i>
                  Assigned Sales Agent
                </Form.Label>
                <Form.Select
                  value={formData.salesAgent}
                  onChange={(e) =>
                    setFormData({ ...formData, salesAgent: e.target.value })
                  }
                  required
                  className="shadow-sm"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-flag-fill me-2"></i>
                  Priority
                </Form.Label>
                <div className="d-flex gap-2">
                  {priorityOptions.map((priority) => (
                    <Form.Check
                      key={priority}
                      type="radio"
                      name="priority"
                      id={`priority-${priority}`}
                      label={
                        <Badge
                          bg={getPriorityVariant(priority)}
                          className="px-3 py-2"
                        >
                          {priority}
                        </Badge>
                      }
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-hourglass-split me-2"></i>
                  Time to Close (Days)
                </Form.Label>
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
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Lead Status
                </Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="shadow-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-tags me-2"></i>
              Tags
            </Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Form.Check
                  key={tag.id}
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  label={
                    <Badge
                      bg={formData.tags.includes(tag.id) ? "primary" : "light"}
                      text={formData.tags.includes(tag.id) ? "white" : "dark"}
                      className="px-3 py-2"
                    >
                      {tag.name}
                    </Badge>
                  }
                  checked={formData.tags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
              ))}
            </div>
          </Form.Group>

          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="px-4"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Lead
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddLeadModal;
