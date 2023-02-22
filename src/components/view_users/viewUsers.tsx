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
import "../view_users/viewUsers.css";

function ViewUsers() {
  let [users, setUsers] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let [banStatus, setBanStatus] = useState(false);
  let { firestore } = useFirebase();
  let { user } = useUser();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);

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
        {users === null ? (
          <div className="loading">Loading...</div>
        ) : users.length === 0 ? (
          <div className="no-timesheets">No Users found.</div>
        ) : (
          <table className="view-users-main">
            {users?.map((entry) => {
              return banStatus !== true &&
                entry.data().is_banned !== true &&
                entry.id !== user?.uid ? (
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
