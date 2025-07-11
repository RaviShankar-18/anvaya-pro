import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          <i className="bi bi-speedometer2"></i>
          Dashboard
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/leads"
          className={location.pathname.startsWith("/leads") ? "active" : ""}
        >
          <i className="bi bi-person-lines-fill"></i>
          Leads
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/agents"
          className={location.pathname.startsWith("/agents") ? "active" : ""}
        >
          <i className="bi bi-people"></i>
          Sales Agents
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/reports"
          className={location.pathname.startsWith("/reports") ? "active" : ""}
        >
          <i className="bi bi-graph-up"></i>
          Reports
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/settings"
          className={location.pathname.startsWith("/settings") ? "active" : ""}
        >
          <i className="bi bi-gear"></i>
          Settings
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
