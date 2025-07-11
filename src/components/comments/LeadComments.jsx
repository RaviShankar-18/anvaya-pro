import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "../../utils/axios";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const LeadComments = ({ leadId, comments, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Get current user

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(`/leads/${leadId}/comments`, {
        lead: leadId, // Add lead ID
        author: user._id, // Add author ID from current user
        commentText: newComment, // Keep the comment text
      });

      onCommentAdded(response.data);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h4 className="mb-3">Comments</h4>

      {/* Comments List */}
      <div className="comments-list mb-4">
        {comments.map((comment) => (
          <Card key={comment._id} className="mb-2">
            {" "}
            {/* Change id to _id */}
            <Card.Body>
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  By {comment.author.name || "Unknown"} on{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
              <p className="mb-0 mt-2">{comment.commentText}</p>
            </Card.Body>
          </Card>
        ))}
        {comments.length === 0 && <p className="text-muted">No comments yet</p>}
      </div>

      {/* Add Comment Form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </Form>
    </div>
  );
};

export default LeadComments;
