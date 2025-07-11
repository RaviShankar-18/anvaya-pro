
// pages/Dashboard.jsx - Complete version
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "../utils/axios";
import AddLeadModal from "../components/modals/AddLeadModal";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
    closedLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter leads when activeFilter changes
  useEffect(() => {
    filterLeads();
  }, [recentLeads, activeFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const pipelineResponse = await axios.get("/report/pipeline");
      const pipelineData = pipelineResponse.data;

      const processedStats = {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        closedLeads: 0,
      };

      pipelineData.forEach((item) => {
        processedStats.totalLeads += item.count;
        switch (item.status) {
          case "New":
            processedStats.newLeads = item.count;
            break;
          case "Contacted":
            processedStats.contactedLeads = item.count;
            break;
          case "Qualified":
            processedStats.qualifiedLeads = item.count;
            break;
          case "Closed":
            processedStats.closedLeads = item.count;
            break;
        }
      });

      setStats(processedStats);

      const leadsResponse = await axios.get("/leads");
      const allLeads = leadsResponse.data;
      const sortedLeads = allLeads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentLeads(sortedLeads.slice(0, 6));

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...recentLeads];

    if (activeFilter !== "all") {
      filtered = recentLeads.filter(
        (lead) => lead.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    setFilteredLeads(filtered);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleLeadCreated = () => {
    // Refresh dashboard data after creating a new lead
    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>Error!</Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-0 fw-bold text-dark">
                Anvaya CRM Dashboard
              </h1>
              <p className="text-muted mb-0">
                Welcome back! Here's what's happening with your leads.
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

      {/* Status Cards */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-3 text-dark">Lead Status Overview</h5>
        <Row className="g-3">
          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-person-plus-fill text-primary fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{stats.newLeads}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  New Leads
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
                  <i className="bi bi-telephone-fill text-info fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{stats.contactedLeads}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Contacted
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
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{stats.qualifiedLeads}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Qualified
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-secondary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-trophy-fill text-secondary fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{stats.totalLeads}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Total Leads
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Recent Leads */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0 text-dark">Recent Leads</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => (window.location.href = "/leads")}
          >
            View All
          </Button>
        </div>
        <Row className="g-3">
          {filteredLeads.length === 0 ? (
            <Col>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body className="py-5">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <h6 className="text-muted">
                    {activeFilter === "all"
                      ? "No leads found"
                      : `No ${activeFilter.toLowerCase()} leads found`}
                  </h6>
                  <p className="text-muted small mb-3">
                    {activeFilter === "all"
                      ? "Start by adding your first lead to see them here."
                      : `Try a different filter or add new leads.`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddLeadModal(true)}
                  >
                    Add New Lead
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            filteredLeads.map((lead) => (
              <Col key={lead._id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{lead.name}</h6>
                        <small className="text-muted d-block">
                          <i className="bi bi-person-circle me-1"></i>
                          {lead.salesAgent?.name || "Unassigned"}
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-calendar3 me-1"></i>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge
                        bg={getStatusBadgeVariant(lead.status)}
                        className="ms-2"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      <Badge bg="light" text="dark" className="small">
                        <i className="bi bi-flag-fill me-1"></i>
                        {lead.priority}
                      </Badge>
                      <Badge bg="light" text="dark" className="small">
                        <i className="bi bi-globe me-1"></i>
                        {lead.source}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Quick Filters */}
      <div>
        <h5 className="fw-semibold mb-3 text-dark">Quick Filters</h5>
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "primary" : "outline-primary"}
            size="sm"
            className="rounded-pill"
            onClick={() => handleFilterClick("all")}
          >
            <i className="bi bi-list-ul me-2"></i>
            All Leads
          </Button>
          <Button
            variant={activeFilter === "new" ? "primary" : "outline-primary"}
            size="sm"
            className="rounded-pill"
            onClick={() => handleFilterClick("new")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New
          </Button>
          <Button
            variant={
              activeFilter === "contacted" ? "primary" : "outline-primary"
            }
            size="sm"
            className="rounded-pill"
            onClick={() => handleFilterClick("contacted")}
          >
            <i className="bi bi-telephone me-2"></i>
            Contacted
          </Button>
          <Button
            variant={
              activeFilter === "qualified" ? "primary" : "outline-primary"
            }
            size="sm"
            className="rounded-pill"
            onClick={() => handleFilterClick("qualified")}
          >
            <i className="bi bi-check-circle me-2"></i>
            Qualified
          </Button>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        show={showAddLeadModal}
        onHide={() => setShowAddLeadModal(false)}
        onLeadCreated={handleLeadCreated}
      />
    </Container>
  );
};

export default Dashboard;
