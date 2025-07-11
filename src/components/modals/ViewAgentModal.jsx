// src/components/modals/ViewAgentModal.jsx
import { Modal, Button, ListGroup } from "react-bootstrap";

const ViewAgentModal = ({ show, onHide, agent }) => {
  console.log("Agent", agent);
  if (!agent) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agent Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item>
            <strong>Name:</strong> {agent.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email:</strong> {agent.email}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Total Leads:</strong> {agent.totalLeads || 0}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Created At:</strong>{" "}
            {new Date(agent.createdAt).toLocaleString()}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewAgentModal;
