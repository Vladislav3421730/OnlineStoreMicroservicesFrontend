import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-dark">
      <Link to="/" className=" btn btn-success" style={{marginInline : "10px"}}>Главная</Link>
        <div className="users-buttons">
          <Link to="/admin/panel" className="btn btn-danger">Панель админа</Link>
          <Link to="/orders" className="btn btn-primary">Панель менеджера</Link>
          <Link to="/login" className="btn btn-success">Войти</Link>
        </div>
      </nav>
    </header>
  );
};

export { Header };
