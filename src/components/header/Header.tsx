import { useUser } from "../../providers/UserProvider";
import "./Header.css";

function Header() {
  let { user, signOut } = useUser();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {user && (
          <div className="app-header-navbar">
            <button className="app-header-navbar-item" onClick={signOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
