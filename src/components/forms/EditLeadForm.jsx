import { useState, useEffect, useCallback, useMemo } from "react";
import { Form, Button, Row, Col, Badge, Alert, Spinner } from "react-bootstrap";
import axios from "../../utils/axios";

const EditLeadForm = ({ lead, onSave, onCancel }) => {
  // Memoize initial form data to prevent recreating on each render
  const initialFormData = useMemo(
    () => ({
      name: lead.name || "",
      source: lead.source || "",
      salesAgent: lead?.salesAgent?._id || "",
      status: lead.status || "",
      tags: lead.tags || [],
      timeToClose: lead.timeToClose || 30,
      priority: lead.priority || "",
    }),
    [lead]
  );

  const [formData, setFormData] = useState(initialFormData);
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Memoize static options
  const sourceOptions = useMemo(
    () => [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ],
    []
  );

  const statusOptions = useMemo(
    () => ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    []
  );

  const priorityOptions = useMemo(() => ["High", "Medium", "Low"], []);

  // Memoize fetch function to prevent recreation on each render
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [agentsResponse, tagsResponse] = await Promise.all([
        axios.get("/agents"),
        axios.get("/tags"),
      ]);

      setAgents(agentsResponse.data);
      const fetchedTags = tagsResponse.data;
      setTags(fetchedTags);

      const processedTags = lead.tags.map((tag) => {
        if (typeof tag === "string") {
          const matchingTag = fetchedTags.find((t) => t.name === tag);
          return matchingTag ? matchingTag.id : tag;
        }
        return tag;
      });

      setFormData((prev) => ({
        ...prev,
        tags: processedTags,
        salesAgent: lead.salesAgent?._id || "",
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load form data");
    } finally {
      setLoading(false);
    }
  }, [lead]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Memoize form field update handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleTagToggle = useCallback((tag) => {
    setFormData((prevData) => {
      const currentTags = prevData.tags || [];
      const tagExists = currentTags.includes(tag.id);
      return {
        ...prevData,
        tags: tagExists
          ? currentTags.filter((id) => id !== tag.id)
          : [...currentTags, tag.id],
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setSaving(true);
        setError(null);
        const response = await axios.put(`/leads/${lead.id}`, {
          ...formData,
          salesAgent: formData.salesAgent,
          tags: formData.tags,
        });
        onSave(response.data);
      } catch (error) {
        console.error("Error updating lead:", error);
        setError(error.response?.data?.error || "Failed to update lead");
      } finally {
        setSaving(false);
      }
    },
    [formData, lead.id, onSave]
  );

  const getPriorityVariant = (priority) => {
    return priority === "High"
      ? "danger"
      : priority === "Medium"
      ? "warning"
      : "success";
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted mt-2">Loading form data...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Lead Name & Source */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-building me-2 text-primary"></i>
                Lead Name
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter lead/company name"
                required
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-globe me-2 text-primary"></i>
                Lead Source
              </Form.Label>
              <Form.Select
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
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

        {/* Sales Agent & Status */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                Sales Agent
              </Form.Label>
              <Form.Select
                value={formData.salesAgent}
                onChange={(e) =>
                  handleInputChange("salesAgent", e.target.value)
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
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-clipboard-check me-2 text-primary"></i>
                Status
              </Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
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

        {/* Priority & Time to Close */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-flag-fill me-2 text-primary"></i>
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
                      handleInputChange("priority", e.target.value)
                    }
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-hourglass-split me-2 text-primary"></i>
                Time to Close (Days)
              </Form.Label>
              <Form.Control
                type="number"
                value={formData.timeToClose}
                onChange={(e) =>
                  handleInputChange("timeToClose", parseInt(e.target.value))
                }
                min="1"
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Tags */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold d-flex align-items-center">
            <i className="bi bi-tags me-2 text-primary"></i>
            Tags
          </Form.Label>
          <div className="p-3 bg-light rounded">
            {tags.length === 0 ? (
              <p className="text-muted mb-0 small">No tags available</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Form.Check
                    key={tag.id}
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    label={
                      <Badge
                        bg={
                          formData.tags.includes(tag.id)
                            ? "primary"
                            : "outline-secondary"
                        }
                        text={formData.tags.includes(tag.id) ? "white" : "dark"}
                        className="px-3 py-2 tag-badge"
                      >
                        {tag.name}
                      </Badge>
                    }
                    checked={formData.tags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag)}
                  />
                ))}
              </div>
            )}
          </div>
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 pt-3 border-top">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            disabled={saving}
            className="px-4"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            className="px-4"
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditLeadForm;
