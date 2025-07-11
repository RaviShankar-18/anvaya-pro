import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "../utils/axios";
import AddAgentModal from "../components/modals/AddAgentModal";
import ViewAgentModal from "../components/modals/ViewAgentModal";
import DeleteAgentModal from "../components/modals/DeleteAgentModal";

const SalesAgents = () => {
  const [agents, setAgents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/agents");
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("Failed to load sales agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentAdded = (newAgent) => {
    setAgents((prev) => [...prev, newAgent]);
  };

  const handleView = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleDeleteClick = (agent) => {
    setSelectedAgent(agent);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/agents/${selectedAgent._id}`);
      setAgents(agents.filter((agent) => agent._id !== selectedAgent._id));
      setShowDeleteModal(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error("Error deleting agent:", error);
      setError("Failed to delete agent");
    }
  };

  // Calculate agent statistics
  const totalLeads = agents.reduce(
    (sum, agent) => sum + (agent.totalLeads || 0),
    0
  );
  const activeAgents = agents.length;
  const avgLeadsPerAgent =
    activeAgents > 0 ? Math.round(totalLeads / activeAgents) : 0;
  const topPerformer = agents.reduce(
    (top, agent) =>
      (agent.totalLeads || 0) > (top.totalLeads || 0) ? agent : top,
    agents[0] || {}
  );

  if (loading) {
    return (
      <Container fluid className="p-4 bg-light min-vh-100">
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-0 fw-bold text-dark">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Sales Agents
              </h1>
              <p className="text-muted mb-0">
                Manage your sales team and track their performance.
              </p>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="d-flex align-items-center shadow-sm"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add New Agent
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statistics Cards */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-3 text-dark">Team Overview</h5>
        <Row className="g-3">
          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-people text-primary fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{activeAgents}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Active Agents
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-graph-up text-success fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{totalLeads}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Total Leads
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-calculator text-info fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{avgLeadsPerAgent}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Avg per Agent
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-trophy text-warning fs-4"></i>
                </div>
                <h3
                  className="mb-1 fw-bold text-truncate"
                  style={{ fontSize: "1.5rem" }}
                >
                  {topPerformer.name || "N/A"}
                </h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Top Performer
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Agents Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {/* Table Header */}
          <div className="px-4 py-3 border-bottom bg-light">
            <Row className="align-items-center">
              <Col>
                <h6 className="mb-0 fw-semibold text-dark">
                  <i className="bi bi-table me-2"></i>
                  All Sales Agents ({agents.length})
                </h6>
              </Col>
            </Row>
          </div>

          {agents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
              <h6 className="text-muted">No sales agents found</h6>
              <p className="text-muted small mb-3">
                Start by adding your first sales agent to get started.
              </p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="bi bi-person-plus me-2"></i>
                Add New Agent
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Agent Details
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Contact
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Performance
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Status
                    </th>
                    <th className="fw-semibold text-dark border-0 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent._id}>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="bi bi-person-fill text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{agent.name}</div>
                            <small className="text-muted">
                              Member since{" "}
                              {new Date(agent.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-envelope me-2 text-muted"></i>
                            <span>{agent.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-graph-up me-2 text-success"></i>
                          <span className="fw-semibold">
                            {agent.totalLeads || 0}
                          </span>
                          <span className="text-muted ms-1">leads</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge bg="success" className="px-3 py-2">
                          <i
                            className="bi bi-circle-fill me-1"
                            style={{ fontSize: "0.5rem" }}
                          ></i>
                          Active
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleView(agent)}
                            className="d-flex align-items-center"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(agent)}
                            className="d-flex align-items-center"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddAgentModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAgentAdded={handleAgentAdded}
      />

      <ViewAgentModal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setSelectedAgent(null);
        }}
        agent={selectedAgent}
      />

      <DeleteAgentModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedAgent(null);
        }}
        onConfirm={handleDeleteConfirm}
        agentName={selectedAgent?.name}
      />
    </Container>
  );
};

export default SalesAgents;
