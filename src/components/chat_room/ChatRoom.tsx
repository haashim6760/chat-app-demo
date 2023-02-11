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
import "./ChatRoom.css";
import { confirmAlert } from "react-confirm-alert";

function Chatroom() {
  let [newMessage, setNewMessage] = useState("");
  let [error, setError] = useState("");
  let [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
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
        }

        let allMessagesCollection = query(
          collection(firestore!, `messages`),
          orderBy("date", "asc")
        );

        onSnapshot(allMessagesCollection, (snapshot) => {
          setMessages(
            snapshot.docs.sort(
              (a, b) => b.data().message_chat - a.data().message_chat
            )
          );
        });
      }
    })();
  }, [newMessage]);

  const sendNewMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (newMessage !== "") {
      try {
        console.log("message", newMessage);
        addDoc(messageRef, {
          message_chat: newMessage,
          date: currentDate,
          uid: user?.uid,
          email: user?.email,
        }).then(() => {
          console.log("Sent");
          setNewMessage("");
          console.log("should be empty", newMessage);
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
        <table className="chat-app-main">
          {messages?.map((entry) => {
            try {
              return entry.data().message_chat && banStatus !== true ? (
                <>
                  <tr key={entry.id}>
                    {entry.data().uid !== user?.uid ? (
                      <>
                        {role === "Admin" ? (
                          <button
                            className="ban-button"
                            onClick={async () => {
                              const options = {
                                title: "Ban",
                                message:
                                  "Are you sure you want to ban this user?",
                                buttons: [
                                  {
                                    label: "Yes",
                                    onClick: async () => {
                                      setDoc(
                                        doc(
                                          firestore!,
                                          "users",
                                          `${entry.data().uid}`
                                        ),
                                        {
                                          is_banned: "true",
                                        },
                                        { merge: true }
                                      );
                                    },
                                  },
                                ],
                                closeOnEscape: true,
                                closeOnClickOutside: true,
                                keyCodeForClose: [8, 32],
                                willUnmount: () => {},
                                afterClose: () => {},
                                onClickOutside: () => {},
                                onKeypress: () => {},
                                onKeypressEscape: () => {},
                                overlayClassName: "overlay-custom-class-name",
                              };
                              confirmAlert(options);
                            }}
                          >
                            <td>{entry.data().email}</td>
                          </button>
                        ) : (
                          <td>{entry.data().email}</td>
                        )}

                        <td>{entry.data().message_chat}</td>
                        {role === "Moderator" ? (
                          <button
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
                                      updateDoc(entry.ref, {
                                        is_deleted: "true",
                                      });
                                    },
                                  },
                                ],
                                closeOnEscape: true,
                                closeOnClickOutside: true,
                                keyCodeForClose: [8, 32],
                                willUnmount: () => {},
                                afterClose: () => {},
                                onClickOutside: () => {},
                                onKeypress: () => {},
                                onKeypressEscape: () => {},
                                overlayClassName: "overlay-custom-class-name",
                              };
                              confirmAlert(options);
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="users-message-email">
                          {entry.data().email}
                        </td>
                        <td className="users-messages">
                          {entry.data().message_chat}
                          {role === "Standard" ? (
                            <button
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
                                        updateDoc(entry.ref, {
                                          is_deleted: "true",
                                        });
                                      },
                                    },
                                  ],
                                  closeOnEscape: true,
                                  closeOnClickOutside: true,
                                  keyCodeForClose: [8, 32],
                                  willUnmount: () => {},
                                  afterClose: () => {},
                                  onClickOutside: () => {},
                                  onKeypress: () => {},
                                  onKeypressEscape: () => {},
                                  overlayClassName: "overlay-custom-class-name",
                                };
                                confirmAlert(options);
                              }}
                            >
                              Delete
                            </button>
                          ) : (
                            <div></div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                </>
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
          {role === "Standard" ? (
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
          ) : (
            <div></div>
          )}
        </table>
      </form>
    </article>
  );
}

export default Chatroom;
