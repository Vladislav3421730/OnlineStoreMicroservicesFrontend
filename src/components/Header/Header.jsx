import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="users-buttons">
          <Link to="/admin/panel" className="btn btn-danger">Панель админа</Link>
          <Link to="/manager/panel" className="btn btn-primary">Панель менеджера</Link>
          <Link to="/login" className="btn btn-success">Войти</Link>
        </div>
      </nav>
    </header>
  );
};

export { Header };
