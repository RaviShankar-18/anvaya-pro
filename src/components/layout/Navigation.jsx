import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const { logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar">
      <Container fluid>
        <Navbar.Brand href="/">Anvaya CRM</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
