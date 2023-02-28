import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import "./Header.css";

function Header() {
  let { user, signOut } = useUser();
  let { firestore } = useFirebase();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);
  let [role, setRole] = useState<string>("");

  // On initial render, get the currently logged in users role and set it to the role variable
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
        {/* If the user true(logged in), display the header */}
        {user && (
          <>
            <div className="app-header-role">{role}</div>
            <div className="app-header-navbar">
              {/* If the user's role is admin display the chat app and view users buttons in the header */}
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
