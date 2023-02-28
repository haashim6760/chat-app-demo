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
  let [newMessage, setNewMessage] = useState<string>("");
  let [error, setError] = useState<string>("");
  let [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let [username, setUsername] = useState<string>("");
  let [role, setRole] = useState<string>("");
  let [banStatus, setBanStatus] = useState<boolean>(false);
  let { firestore } = useFirebase();
  let messageRef = collection(firestore!, `messages`);
  let { user } = useUser();
  let userRoleRef = doc(firestore!, "users", `${user?.uid}`);
  let currentDate = new Date();

  // On the initial render of the page, if the user and firestore are true, the role
  // ban status and username are retrieved from the currently logged in user's user document.
  // Next, all messages are collected from the messages collection and set to the value of messages.
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

  //This function handles sending the new message. If the newMessage variable are empty, then
  //the new message is added to the messages collection. The new message document contains the
  //message, date, uid and username fields.
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
      {/* The form calls the sendNewMessage function */}
      <form className="message" onSubmit={sendNewMessage}>
        {/* If the messages are null, then "Loading" will be displayed,
        else if there are 0 messages,  "No Messages found".  */}
        {messages === null ? (
          <div className="loading">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No Messages found.</div>
        ) : (
          <table className="chat-app-main">
            {/* The messages array is iterated over and each message is displayed */}
            {messages?.map((entry) => {
              // The messages are only shown if the currently logged in user isn't banned and the message isn't banned
              return entry.data().message_chat && banStatus !== true ? (
                <>
                  <tr key={entry.id}>
                    {/* Display the username and message under it. 
                    This will display messages that aren't the currently logged in users' messages on the left*/}
                    {entry.data().uid !== user?.uid ? (
                      <>
                        <td className="username">{entry.data().username}</td>
                        <br />
                        <td>{entry.data().message_chat}</td>
                        <br />
                        {/* If the currenly logged in user's role is moderator or admin,
                        they can delete messages, else the delete button will not appear*/}
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
                        {/* If the currenly logged in user's role is not moderator or admin (standard role),
                        they can delete their own messages, else the delete button will not appear*/}
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

            {/* The user can add new messages, the input is set to the newMessages variable */}
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
