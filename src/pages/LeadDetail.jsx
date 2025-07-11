import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "../utils/axios";
import EditLeadForm from "../components/forms/EditLeadForm";
import DeleteLeadModal from "../components/modals/DeleteLeadModal";
import LeadComments from "../components/comments/LeadComments";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processedTags, setProcessedTags] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  const processTags = async (tags) => {
    try {
      const processedTags = await Promise.all(
        tags.map(async (tag) => {
          if (tag.match(/^[0-9a-fA-F]{24}$/)) {
            const response = await axios.get(`/tags/${tag}`);
            return response.data.name;
          }
          return tag;
        })
      );
      setProcessedTags(processedTags);
    } catch (error) {
      console.error("Error processing tags:", error);
      setProcessedTags(tags);
    }
  };

  const fetchLeadAndComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [leadResponse, commentsResponse] = await Promise.all([
        axios.get(`/leads/${id}`),
        axios.get(`/leads/${id}/comments`),
      ]);
      setLead(leadResponse.data);
      setComments(commentsResponse.data);

      if (leadResponse.data?.tags) {
        processTags(leadResponse.data.tags);
      }
    } catch (error) {
      console.error("Error fetching lead details:", error);
      setError("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadAndComments();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/leads/${id}`);
      navigate("/leads");
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseDeleteModal();
  };

  const handleEditSave = async (updatedLead) => {
    try {
      setLead(updatedLead);
      setIsEditing(false);
      await fetchLeadAndComments();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/leads/${id}/comments`, {
        commentText: newComment,
        author: lead.salesAgent?._id,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-4">
        <Alert variant="warning">
          <i className="bi bi-info-circle-fill me-2"></i>
          Lead not found
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-person-workspace me-2 text-primary fs-4"></i>
                <h1 className="h3 mb-0 fw-bold text-dark">{lead.name}</h1>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Badge
                  bg={getStatusBadgeVariant(lead.status)}
                  className="px-3 py-2"
                >
                  <i
                    className="bi bi-circle-fill me-1"
                    style={{ fontSize: "0.5rem" }}
                  ></i>
                  {lead.status}
                </Badge>
                <Badge
                  bg={getPriorityBadgeVariant(lead.priority)}
                  className="px-3 py-2"
                >
                  <i className="bi bi-flag-fill me-1"></i>
                  {lead.priority} Priority
                </Badge>
                <span className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  Created: {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button
                  variant={isEditing ? "outline-secondary" : "outline-primary"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="d-flex align-items-center"
                >
                  <i
                    className={`bi ${
                      isEditing ? "bi-x-circle" : "bi-pencil-square"
                    } me-2`}
                  ></i>
                  {isEditing ? "Cancel Edit" : "Edit Lead"}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleShowDeleteModal}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col lg={8}>
          {isEditing ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-pencil-square text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">Edit Lead Information</h5>
                </div>
                <EditLeadForm
                  lead={{ ...lead, id: id }}
                  onSave={handleEditSave}
                  onCancel={() => setIsEditing(false)}
                />
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-info-circle text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">Lead Information</h5>
                </div>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="info-item mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <i className="bi bi-person-circle text-muted me-2"></i>
                        <strong>Sales Agent</strong>
                      </div>
                      <div className="ps-4">
                        {lead.salesAgent?.name || "Unassigned"}
                      </div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <i className="bi bi-globe text-muted me-2"></i>
                        <strong>Source</strong>
                      </div>
                      <div className="ps-4">{lead.source}</div>
                    </div>
                    <div className="info-item">
                      <div className="d-flex align-items-center mb-1">
                        <i className="bi bi-clock text-muted me-2"></i>
                        <strong>Time to Close</strong>
                      </div>
                      <div className="ps-4">
                        <span className="badge bg-light text-dark">
                          {lead.timeToClose} days
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info-item">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-tags text-muted me-2"></i>
                        <strong>Tags</strong>
                      </div>
                      <div className="ps-4">
                        {processedTags.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {processedTags.map((tags, index) => (
                              <Badge
                                key={index}
                                bg="primary"
                                className="badge-tag me-1 mb-1"
                              >
                                {tags}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No tags</span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Comments Section */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-chat-dots text-primary me-2 fs-5"></i>
                  <h5 className="mb-0 fw-semibold">
                    Comments ({comments.length})
                  </h5>
                </div>
              </div>

              {/* Comments List */}
              <div className="comments-section mb-4">
                {comments.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-chat fs-1 text-muted mb-2"></i>
                    <p className="text-muted">
                      No comments yet. Be the first to add one!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="mb-3 border">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle text-primary me-2"></i>
                            <strong className="me-2">{comment.author}</strong>
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                        <p className="mb-0">{comment.commentText}</p>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <Form onSubmit={handleAddComment}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Add a comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or updates about this lead..."
                    className="shadow-sm"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!newComment.trim()}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Comment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-clock-history text-primary me-2 fs-5"></i>
                <h5 className="mb-0 fw-semibold">Lead Timeline</h5>
              </div>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <div className="fw-semibold">Lead Created</div>
                    <small className="text-muted">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <div className="fw-semibold">Status: {lead.status}</div>
                    <small className="text-muted">Current status</small>
                  </div>
                </div>
                {comments.length > 0 && (
                  <div className="timeline-item">
                    <div className="timeline-marker bg-success"></div>
                    <div className="timeline-content">
                      <div className="fw-semibold">Latest Comment</div>
                      <small className="text-muted">
                        {new Date(
                          comments[comments.length - 1].createdAt
                        ).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Modal */}
      <DeleteLeadModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
};

export default LeadDetail;
