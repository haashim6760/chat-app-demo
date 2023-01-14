import { Outlet } from "react-router-dom";
import Authentication from "./components/authentication/Authentication";

import Header from "./components/header/Header";
import { useUser } from "./providers/UserProvider";

function Layout() {
    let {user} = useUser();

    return (
        <div className="layout">
            {user && <Header />}
            <main className="layout-main">
            {user === undefined && <div className="loading">Loading...</div>}
            {user === null && <Authentication />}
            {user && <Outlet />}
            </main>
      
        </div>
    )
}

export default Layout;