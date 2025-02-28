import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../hook/useAuth";
import { ACCOUNT_IMAGE_URL, BUCKET_IMAGE_URL } from "../../config";

const Header = () => {

  const { isAdmin, isManager, isAuthorized } = useAuth()

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-dark">
        <NavLink className="inscription" to="/" style={{ marginInline: "10px" }}>Главная</NavLink>
        <div className="users-buttons">
          {(isAdmin || isManager) && <NavLink className="inscription" to="/admin/panel">Пользователи</NavLink>}
          {isManager &&
            <>
              <NavLink className="inscription" to="/gallery">Галерея</NavLink>
              <NavLink className="inscription" to="/orders">Заказы</NavLink>
              <NavLink className="inscription" to="/products">Продукты</NavLink>
            </>
          }

          {isAuthorized ? (
            <>
              <Link to="/cart">
                <img className="image" src={BUCKET_IMAGE_URL}/>
              </Link>
              <Link to="/account" >
              <img class="profileImage"
                  src={ACCOUNT_IMAGE_URL}/>
              </Link>
            </>
          ) : (
            <NavLink className="inscription" to="/login">Войти</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export { Header };
