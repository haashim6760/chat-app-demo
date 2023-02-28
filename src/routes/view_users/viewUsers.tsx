/* eslint-disable jsx-a11y/anchor-is-valid */

import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import { confirmAlert } from "react-confirm-alert";
import "./viewUsers.css";

function ViewUsers() {
  let [users, setUsers] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let [banStatus, setBanStatus] = useState(false);
  let { firestore } = useFirebase();
  let { user } = useUser();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);

  // On the initial render of the page, if the user and firestore are true, the
  // ban status are retrieved from the currently logged in user's user document.
  // Next, all users are collected from the users collection and set to the value of users.
  useEffect(() => {
    (async () => {
      if (user && firestore) {
        let userRoleSnap = await getDoc(userRoleRef);
        if (userRoleSnap.exists()) {
          setBanStatus(userRoleSnap.data().is_banned);
        }

        let allUsersCollection = query(collection(firestore!, `users`));

        onSnapshot(allUsersCollection, (snapshot) => {
          setUsers(
            snapshot.docs.sort((a, b) => b.data().username - a.data().username)
          );
        });
      }
    })();
  });

  return (
    <article className="app-main-article">
      <form className="users">
        {/* If the users are null, then "Loading" will be displayed,
        else if there are 0 users,  "No Users found".  */}
        {users === null ? (
          <div className="loading">Loading...</div>
        ) : users.length === 0 ? (
          <div className="no-users">No Users found.</div>
        ) : (
          <table className="view-users-main">
            {/* The users array is iterated over and each user is displayed */}
            {users?.map((entry) => {
              // The users are only shown if the currently logged in user isn't banned,
              // the item from the users array doesn't contain the same uid as the
              // currently logged in user and the user from the users array isn't banned.
              // This means that the currently logged in users isn't displayed.

              return banStatus !== true &&
                entry.data().is_banned !== true &&
                entry.id !== user?.uid ? (
                // display the username, email and role of each user
                //  and a ban button under the user info.
                <div className="user-box">
                  <tr key={entry.id}>
                    <td>Username: {entry.data().username}</td>
                  </tr>

                  <tr>
                    <td>Email: {entry.data().email}</td>
                  </tr>

                  <tr>
                    <td>Role: {entry.data().role}</td>
                  </tr>
                  {/* This will add a ban field to the user's user document */}
                  <tr>
                    <a
                      type="button"
                      className="delete-button"
                      onClick={async () => {
                        const options = {
                          title: "Ban",
                          message: "Are you sure you want to ban this user?",
                          buttons: [
                            {
                              label: "Yes",
                              onClick: async () => {
                                updateDoc(entry.ref, {
                                  is_banned: true,
                                });
                              },
                            },
                            {
                              label: "No",
                            },
                          ],
                        };
                        confirmAlert(options);
                      }}
                    >
                      Ban User
                    </a>
                  </tr>
                </div>
              ) : (
                <tr></tr>
              );
            })}
          </table>
        )}
      </form>
    </article>
  );
}

export default ViewUsers;
