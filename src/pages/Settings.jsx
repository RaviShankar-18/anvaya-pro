// pages/Settings.jsx
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

const Settings = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "sales_agent",
    notifications: true,
    emailAlerts: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Settings saved:", formData);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Success Alert */}
      {showAlert && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          Settings saved successfully!
        </Alert>
      )}

      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-0 fw-bold text-dark">Settings</h1>
              <p className="text-muted mb-0">
                Manage your account preferences and system configuration.
              </p>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="d-flex align-items-center shadow-sm"
                onClick={handleSave}
              >
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Settings Form */}
      <Row className="g-4">
        {/* Personal Information */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-person-fill text-primary fs-5"></i>
                </div>
                <div>
                  <h5 className="mb-1 fw-semibold text-dark">
                    Personal Information
                  </h5>
                  <p className="text-muted mb-0 small">
                    Update your personal details
                  </p>
                </div>
              </div>

              <Form>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Enter your email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Role</Form.Label>
                      <Form.Select
                        value={formData.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                      >
                        <option value="sales_agent">Sales Agent</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Notification Settings */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <i className="bi bi-bell-fill text-warning fs-5"></i>
                </div>
                <div>
                  <h5 className="mb-1 fw-semibold text-dark">
                    Notification Settings
                  </h5>
                  <p className="text-muted mb-0 small">
                    Control your notification preferences
                  </p>
                </div>
              </div>

              <Row className="g-3">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div>
                      <span className="fw-semibold d-block">
                        Email Notifications
                      </span>
                      <small className="text-muted">
                        Receive updates and alerts via email
                      </small>
                    </div>
                    <Form.Check
                      type="switch"
                      id="notifications"
                      checked={formData.notifications}
                      onChange={(e) =>
                        handleChange("notifications", e.target.checked)
                      }
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div>
                      <span className="fw-semibold d-block">
                        Alert Notifications
                      </span>
                      <small className="text-muted">
                        Get notified about important system alerts
                      </small>
                    </div>
                    <Form.Check
                      type="switch"
                      id="emailAlerts"
                      checked={formData.emailAlerts}
                      onChange={(e) =>
                        handleChange("emailAlerts", e.target.checked)
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
