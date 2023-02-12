import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import { confirmAlert } from "react-confirm-alert";
import "../view_users/viewUsers.css";

function ViewUsers() {
  let [newMessage, setNewMessage] = useState("");
  let [error, setError] = useState("");
  let [users, setUsers] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let [role, setRole] = useState("");
  let [banStatus, setBanStatus] = useState(false);
  let { firestore } = useFirebase();
  let messageRef = collection(firestore!, `users`);
  let { user } = useUser();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);
  let currentDate = new Date();

  useEffect(() => {
    (async () => {
      if (user && firestore) {
        let userRoleSnap = await getDoc(userRoleRef);
        if (userRoleSnap.exists()) {
          setRole(userRoleSnap.data().role);
          setBanStatus(userRoleSnap.data().is_banned);
        }

        let allUsersCollection = query(collection(firestore!, `users`));

        onSnapshot(allUsersCollection, (snapshot) => {
          setUsers(
            snapshot.docs.sort((a, b) => b.data().username - a.data().username)
          );
        });

        console.log(users);
      }
    })();
  }, [newMessage]);

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
              try {
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
              } catch (e: any) {
                setError("There Was An Error Viewing Your Message");

                return;
              }
            })}

            {error ? (
              <div className="error">
                <br />
                {error}
              </div>
            ) : (
              <div></div>
            )}
          </table>
        )}
      </form>
    </article>
  );
}

export default ViewUsers;
