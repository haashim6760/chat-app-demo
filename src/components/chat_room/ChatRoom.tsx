/* eslint-disable jsx-a11y/anchor-is-valid */

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import "./ChatRoom.css";
import { confirmAlert } from "react-confirm-alert";

function Chatroom() {
  let [newMessage, setNewMessage] = useState("");
  let [error, setError] = useState("");
  let [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let [username, setUsername] = useState("");
  let [role, setRole] = useState("");
  let [banStatus, setBanStatus] = useState(false);
  let { firestore } = useFirebase();
  let messageRef = collection(firestore!, `messages`);
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
          setUsername(userRoleSnap.data().username);
        }

        let allMessagesCollection = query(
          collection(firestore!, `messages`),
          orderBy("date", "asc")
        );

        onSnapshot(allMessagesCollection, (snapshot) => {
          setMessages(snapshot.docs);
        });
      }
    })();
  }, [newMessage, firestore, user, userRoleRef]);

  const sendNewMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (newMessage !== "") {
      try {
        addDoc(messageRef, {
          message_chat: newMessage,
          date: currentDate,
          uid: user?.uid,
          username: username,
        }).then(() => {
          setNewMessage("");
        });
      } catch (e) {
        setError("There Was An Error Sending Your Message");
        let error = e as FirebaseError;
        setError(error.message);
      }
    } else {
      setError("Cannot Send Empty Messages");
    }
  };

  return (
    <article className="app-main-article">
      <form className="message" onSubmit={sendNewMessage}>
        {messages === null ? (
          <div className="loading">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No Users found.</div>
        ) : (
          <table className="chat-app-main">
            {messages?.map((entry) => {
              return entry.data().message_chat && banStatus !== true ? (
                <>
                  <tr key={entry.id}>
                    {entry.data().uid !== user?.uid ? (
                      <>
                        <td className="username">{entry.data().username}</td>
                        <br />

                        <td>{entry.data().message_chat}</td>
                        <br />
                        {role === "Moderator" || role === "Admin" ? (
                          <a
                            type="button"
                            className="delete-button"
                            onClick={async () => {
                              const options = {
                                title: "Delete",
                                message:
                                  "Are you sure you want to delete this message?",
                                buttons: [
                                  {
                                    label: "Yes",
                                    onClick: async () => {
                                      await deleteDoc(
                                        doc(
                                          firestore!,
                                          "messages",
                                          `${entry.ref}`
                                        )
                                      );
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
                            Delete
                          </a>
                        ) : (
                          <div></div>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="users-message-username">
                          {entry.data().username}
                        </td>

                        <td className="users-messages">
                          {entry.data().message_chat}
                        </td>

                        <td className="users-messages">
                          <a
                            type="button"
                            className="delete-button"
                            onClick={async () => {
                              const options = {
                                title: "Delete",
                                message:
                                  "Are you sure you want to delete this message?",
                                buttons: [
                                  {
                                    label: "Yes",
                                    onClick: async () => {
                                      await deleteDoc(
                                        doc(
                                          firestore!,
                                          "messages",
                                          `${entry.id}`
                                        )
                                      );
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
                            Delete
                          </a>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              ) : (
                <tr></tr>
              );
            })}

            {error ? (
              <div className="error">
                <br />
                {error}
              </div>
            ) : (
              <div></div>
            )}

            <div className="new-message">
              <input
                className="new-message-input"
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMessage(event.target.value)
                }
              />

              <button className="send-button" type="submit">
                Send
              </button>
            </div>
          </table>
        )}
      </form>
    </article>
  );
}

export default Chatroom;
