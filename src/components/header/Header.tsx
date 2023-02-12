import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import "./Header.css";

function Header() {
  let { user, signOut } = useUser();
  let { firestore } = useFirebase();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);
  let [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      if (user && firestore) {
        let userRoleSnap = await getDoc(userRoleRef);
        if (userRoleSnap.exists()) {
          setRole(userRoleSnap.data().role);
        }
      }
    })();
  }, [firestore, userRoleRef, user]);

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {user && (
          <>
            <div className="app-header-role">{role}</div>
            <div className="app-header-navbar">
              {role === "Admin" && (
                <>
                  <span className="app-header-navbar-link">
                    <a href="/">Chat App</a>
                  </span>
                  <span className="app-header-navbar-link">
                    <a href="View_Users">View Users</a>
                  </span>
                </>
              )}
              <button className="app-header-navbar-item" onClick={signOut}>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
