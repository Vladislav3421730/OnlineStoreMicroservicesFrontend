import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../hook/useAuth";

const Header = () => {

  const { isAdmin, isManager, isAuthorized, logout } = useAuth()

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-dark">
        <NavLink className="inscription" to="/" style={{ marginInline: "10px" }}>Главная</NavLink>
        <div className="users-buttons">
          {(isAdmin || isManager) && <NavLink className="inscription" to="/admin/panel">Пользователи</NavLink>}
          {isManager &&
            <>
              <NavLink className="inscription" to="/orders">Заказы</NavLink>
              <NavLink className="inscription" to="/products">Продукты</NavLink>
            </>
          }

          {isAuthorized ? (
            <>
              <Link to="/cart">
                <img className="image" src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-z0k5-p-korzina-belaya-png-9.png"/>
              </Link>
              <Link to="/account" >
              <img class="profileImage"
                  src="https://cdn4.iconfinder.com/data/icons/popular-ui/24/23_ui_user_interface_user_account_avatar_profile_web_ios-512.png"/>
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
