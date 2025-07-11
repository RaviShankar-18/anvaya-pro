import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axios from "../utils/axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [reports, setReports] = useState({
    lastWeek: [],
    pipeline: [],
    closedByAgent: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [lastWeek, pipeline, closedByAgent] = await Promise.all([
        axios.get("/report/last-week"),
        axios.get("/report/pipeline"),
        axios.get("/report/closed-by-agent"),
      ]);

      setReports({
        lastWeek: lastWeek.data,
        pipeline: pipeline.data,
        closedByAgent: closedByAgent.data,
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalLeads = reports.pipeline.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalClosed = reports.closedByAgent.reduce(
    (sum, item) => sum + item.totalClosed,
    0
  );

  // Enhanced Pie Chart Configuration
  const pipelineChartData = {
    labels: reports.pipeline.map((item) => item.status),
    datasets: [
      {
        data: reports.pipeline.map((item) => item.count),
        backgroundColor: [
          "#0d6efd", // Primary blue
          "#17a2b8", // Info cyan
          "#28a745", // Success green
          "#ffc107", // Warning yellow
          "#6c757d", // Secondary gray
          "#dc3545", // Danger red
          "#6f42c1", // Purple
          "#fd7e14", // Orange
        ],
        borderWidth: 3,
        borderColor: "#fff",
        hoverBorderWidth: 4,
        hoverBorderColor: "#fff",
        hoverBackgroundColor: [
          "#0056b3", // Darker blue
          "#117a8b", // Darker cyan
          "#1e7e34", // Darker green
          "#e0a800", // Darker yellow
          "#545b62", // Darker gray
          "#bd2130", // Darker red
          "#59359a", // Darker purple
          "#dc6545", // Darker orange
        ],
      },
    ],
  };

  const agentPerformanceData = {
    labels: reports.closedByAgent.map((item) => item.agentName),
    datasets: [
      {
        label: "Leads Closed",
        data: reports.closedByAgent.map((item) => item.totalClosed),
        backgroundColor: "rgba(13, 110, 253, 0.8)",
        borderColor: "rgba(13, 110, 253, 1)",
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(13, 110, 253, 0.9)",
      },
    ],
  };

  // Enhanced Chart Options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            weight: "500",
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => {
                const dataset = data.datasets[0];
                const value = dataset.data[index];
                const percentage =
                  totalLeads > 0 ? ((value / totalLeads) * 100).toFixed(1) : 0;
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: index,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `Lead Status: ${context[0].label}`;
          },
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const percentage =
              totalLeads > 0 ? ((value / totalLeads) * 100).toFixed(1) : 0;
            return [
              `Count: ${value} leads`,
              `Percentage: ${percentage}%`,
              `Total Leads: ${totalLeads}`,
            ];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context) => {
            return `Agent: ${context[0].label}`;
          },
          label: (context) => {
            const value = context.parsed.y;
            const percentage =
              totalClosed > 0 ? ((value / totalClosed) * 100).toFixed(1) : 0;
            return [
              `Closed Deals: ${value}`,
              `Share: ${percentage}%`,
              `Total Closed: ${totalClosed}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

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
                <i className="bi bi-graph-up me-2 text-primary"></i>
                Anvaya CRM Reports
              </h1>
              <p className="text-muted mb-0">
                Comprehensive analytics and performance insights for your sales
                team.
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center">
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <i className="bi bi-calendar3 me-2"></i>
                  Last Updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Key Metrics */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-3 text-dark">Key Performance Metrics</h5>
        <Row className="g-3">
          <Col xs={12} sm={6} lg={3}>
            <Card className="text-center border-0 shadow-sm h-100">
              <Card.Body className="py-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-people-fill text-primary fs-4"></i>
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
                  className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="bi bi-trophy-fill text-success fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{totalClosed}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Closed Deals
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
                  <i className="bi bi-percent text-info fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">
                  {totalLeads > 0
                    ? Math.round((totalClosed / totalLeads) * 100)
                    : 0}
                  %
                </h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Conversion Rate
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
                  <i className="bi bi-people text-warning fs-4"></i>
                </div>
                <h3 className="mb-1 fw-bold">{reports.closedByAgent.length}</h3>
                <p className="text-muted mb-0 small fw-semibold text-uppercase">
                  Active Agents
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Charts Section */}
      <Row className="g-4 mb-4">
        {/* Enhanced Pipeline Status Chart */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-pie-chart text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">Lead Status Distribution</h5>
                </div>
                <Badge bg="light" text="dark" className="px-2 py-1">
                  <i className="bi bi-pie-chart-fill me-1"></i>
                  {totalLeads} Total
                </Badge>
              </div>

              {reports.pipeline.length > 0 ? (
                <>
                  <div style={{ height: "300px" }}>
                    <Pie data={pipelineChartData} options={pieChartOptions} />
                  </div>

                  {/* Enhanced Status Summary */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-semibold mb-3 text-dark">
                      <i className="bi bi-list-check me-2"></i>
                      Status Summary
                    </h6>
                    <Row className="g-2">
                      {reports.pipeline.map((item, index) => {
                        const percentage =
                          totalLeads > 0
                            ? ((item.count / totalLeads) * 100).toFixed(1)
                            : 0;
                        return (
                          <Col xs={6} key={item.status}>
                            <div className="d-flex align-items-center p-2 rounded bg-light">
                              <div
                                className="rounded-circle me-2"
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  backgroundColor:
                                    pipelineChartData.datasets[0]
                                      .backgroundColor[index],
                                }}
                              ></div>
                              <div className="flex-grow-1">
                                <div className="fw-semibold small">
                                  {item.status}
                                </div>
                                <div className="text-muted small">
                                  {item.count} leads ({percentage}%)
                                </div>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-pie-chart fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No pipeline data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Enhanced Agent Performance Chart */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-bar-chart text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">Sales Agent Performance</h5>
                </div>
                <Badge bg="light" text="dark" className="px-2 py-1">
                  <i className="bi bi-people-fill me-1"></i>
                  {reports.closedByAgent.length} Agents
                </Badge>
              </div>

              {reports.closedByAgent.length > 0 ? (
                <>
                  <div style={{ height: "300px" }}>
                    <Bar
                      data={agentPerformanceData}
                      options={barChartOptions}
                    />
                  </div>

                  {/* Top Performer Highlight */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-semibold mb-3 text-dark">
                      <i className="bi bi-trophy-fill me-2"></i>
                      Top Performer
                    </h6>
                    {(() => {
                      const topAgent = reports.closedByAgent.reduce(
                        (prev, current) =>
                          prev.totalClosed > current.totalClosed
                            ? prev
                            : current
                      );
                      const percentage =
                        totalClosed > 0
                          ? (
                              (topAgent.totalClosed / totalClosed) *
                              100
                            ).toFixed(1)
                          : 0;
                      return (
                        <div className="d-flex align-items-center p-3 rounded bg-success bg-opacity-10">
                          <i className="bi bi-person-circle text-success fs-4 me-3"></i>
                          <div>
                            <div className="fw-bold text-dark">
                              {topAgent.agentName}
                            </div>
                            <div className="text-muted small">
                              {topAgent.totalClosed} closed deals ({percentage}%
                              of total)
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-bar-chart fs-1 text-muted mb-3"></i>
                  <p className="text-muted">
                    No agent performance data available
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Tables */}
      <Row className="g-4">
        {/* Pipeline Breakdown */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-funnel text-primary me-2 fs-5"></i>
                <h5 className="mb-0 fw-semibold">Pipeline Breakdown</h5>
              </div>
              {reports.pipeline.length > 0 ? (
                <div className="space-y-3">
                  {reports.pipeline.map((item, index) => (
                    <div
                      key={item.status}
                      className="d-flex justify-content-between align-items-center py-2"
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle me-3"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor:
                              pipelineChartData.datasets[0].backgroundColor[
                                index
                              ],
                          }}
                        ></div>
                        <span className="fw-semibold">{item.status}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-3">{item.count} leads</span>
                        <Badge bg="light" text="dark">
                          {totalLeads > 0
                            ? Math.round((item.count / totalLeads) * 100)
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No pipeline data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Closed Leads */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock-history text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">Recent Closed Leads</h5>
                </div>
                <Badge bg="primary">{reports.lastWeek.length}</Badge>
              </div>
              {reports.lastWeek.length > 0 ? (
                <div
                  className="space-y-2"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {reports.lastWeek.map((lead) => (
                    <div
                      key={lead.id}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <div>
                        <div className="fw-semibold">{lead.name}</div>
                        <small className="text-muted">
                          <i className="bi bi-person-circle me-1"></i>
                          {lead.salesAgent}
                        </small>
                      </div>
                      <Badge bg="success">Closed</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-2 text-muted mb-2"></i>
                  <p className="text-muted">No leads closed recently</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
