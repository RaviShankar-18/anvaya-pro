// src/components/modals/DeleteAgentModal.jsx
import { Modal, Button } from "react-bootstrap";

const DeleteAgentModal = ({ show, onHide, onConfirm, agentName }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Agent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete agent "{agentName}"? This action cannot
        be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAgentModal;
