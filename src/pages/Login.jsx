import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const testAccounts = [
    {
      role: "Admin",
      email: "admin@test.com",
      password: "123456",
      description: "Full system access",
      color: "danger",
    },
    {
      role: "Manager",
      email: "manager@test.com",
      password: "123456",
      description: "Team management access",
      color: "warning",
    },
    {
      role: "Agent",
      email: "agent@test.com",
      password: "123456",
      description: "Lead management access",
      color: "info",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await axios.post("/auth/login", { email, password });
      login(response.data.token);
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccountClick = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <Container className="d-flex align-items-center justify-content-center min-vh-100 py-4">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-2">
                    Login to Anvaya CRM
                  </h2>
                  <p className="text-muted">
                    Welcome back! Please sign in to your account
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-control-lg shadow-sm"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="form-control-lg shadow-sm"
                        required
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        onClick={togglePasswordVisibility}
                        style={{ zIndex: 10 }}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 btn-lg fw-semibold"
                    disabled={loading}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      border: "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="test-accounts-section">
                  <h6 className="text-center text-muted mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Test Accounts for Demo
                  </h6>

                  <Row className="g-2">
                    {testAccounts.map((account, index) => (
                      <Col xs={12} key={index}>
                        <Card
                          className={`test-account-card border-${account.color} cursor-pointer`}
                          onClick={() => handleTestAccountClick(account)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <span
                                    className={`badge bg-${account.color} me-2`}
                                  >
                                    {account.role}
                                  </span>
                                  <small className="text-muted">
                                    {account.description}
                                  </small>
                                </div>
                                <div className="text-sm">
                                  <strong>Email:</strong> {account.email}
                                </div>
                                <div className="text-sm">
                                  <strong>Password:</strong> {account.password}
                                </div>
                              </div>
                              <i className="bi bi-arrow-right-circle text-muted"></i>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-hand-index me-1"></i>
                      Click on any test account to auto-fill credentials
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
