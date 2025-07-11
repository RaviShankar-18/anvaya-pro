import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../utils/axios";
import AddLeadModal from "../components/modals/AddLeadModal";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL or set defaults
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    salesAgent: searchParams.get("salesAgent") || "",
    source: searchParams.get("source") || "",
    priority: searchParams.get("priority") || "",
  });

  const statusOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const sourceOptions = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const priorityOptions = ["High", "Medium", "Low"];

  useEffect(() => {
    fetchAgents();
    fetchLeads();
  }, [filters]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get("/agents");
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("Failed to load agents");
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert filters to URL parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/leads?${params.toString()}`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    setSearchParams(params);
  };

  const handleLeadCreated = () => {
    // Refresh leads after creating a new one
    fetchLeads();
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      New: "primary",
      Contacted: "info",
      Qualified: "success",
      "Proposal Sent": "warning",
      Closed: "secondary",
    };
    return variants[status] || "secondary";
  };

  const getPriorityBadgeVariant = (priority) => {
    const variants = {
      High: "danger",
      Medium: "warning",
      Low: "success",
    };
    return variants[priority] || "secondary";
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      {/* Header - Same as Dashboard */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-0 fw-bold text-dark">Leads Management</h1>
              <p className="text-muted mb-0">
                Manage and track all your leads in one place.
              </p>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="d-flex align-items-center shadow-sm"
                onClick={() => setShowAddLeadModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Lead
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters Card */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <h5 className="fw-semibold mb-3 text-dark">
            <i className="bi bi-funnel me-2 text-primary"></i>
            Filter Leads
          </h5>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="shadow-sm"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Sales Agent</Form.Label>
                <Form.Select
                  value={filters.salesAgent}
                  onChange={(e) =>
                    handleFilterChange("salesAgent", e.target.value)
                  }
                  className="shadow-sm"
                >
                  <option value="">All Agents</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Source</Form.Label>
                <Form.Select
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
                  className="shadow-sm"
                >
                  <option value="">All Sources</option>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Priority</Form.Label>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="shadow-sm"
                >
                  <option value="">All Priorities</option>
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Leads Table Card */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="p-4 border-bottom">
            <h5 className="fw-semibold mb-0 text-dark">
              <i className="bi bi-table me-2 text-primary"></i>
              All Leads ({leads.length})
            </h5>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="text-muted mt-2">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <h6 className="text-muted">No leads found</h6>
              <p className="text-muted">
                {Object.values(filters).some((f) => f)
                  ? "Try adjusting your filters or add a new lead."
                  : "Start by adding your first lead to get started."}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAddLeadModal(true)}
              >
                Add New Lead
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Lead Name
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Status
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Priority
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Assigned To
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Source
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Time to Close
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id || lead._id}>
                      <td className="py-3">
                        <div className="fw-semibold">{lead.name}</div>
                        <small className="text-muted">
                          Created:{" "}
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td className="py-3">
                        <Badge bg={getStatusBadgeVariant(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge bg={getPriorityBadgeVariant(lead.priority)}>
                          {lead.priority}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-circle me-2 text-muted"></i>
                          {lead.salesAgent?.name || "Unassigned"}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-globe me-2 text-muted"></i>
                          {lead.source}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">
                          {lead.timeToClose} days
                        </span>
                      </td>
                      <td className="py-3">
                        <Link to={`/leads/${lead.id || lead._id}`}>
                          <Button variant="outline-primary" size="sm">
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Lead Modal */}
      <AddLeadModal
        show={showAddLeadModal}
        onHide={() => setShowAddLeadModal(false)}
        onLeadCreated={handleLeadCreated}
      />
    </Container>
  );
};

export default LeadList;
