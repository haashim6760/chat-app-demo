import { Outlet } from "react-router-dom";
import Authentication from "./routes/authentication/Authentication";

import Header from "./components/header/Header";
import { useUser } from "./providers/UserProvider";

function Layout() {
  let { user } = useUser();

  return (
    <div className="layout">
      {/* If the user is true(logged in), the header is displayed */}
      {user && <Header />}
      <main className="layout-main">
        {/* If the user is undefined, loading is displayed */}
        {user === undefined && <div className="loading">Loading...</div>}
        {/* If the user is null, the sign in page is shown */}
        {user === null && <Authentication />}
        {user && <Outlet />}
      </main>
    </div>
  );
}

export default Layout;
