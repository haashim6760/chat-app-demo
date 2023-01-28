import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";

function Chatroom() {
  let [newMessage, setNewMessage] = useState("");
  let [error, setError] = useState("");
  let [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData>[] | null
  >(null);
  let { firestore } = useFirebase();
  let messageRef = collection(firestore!, `messages`);
  let { user } = useUser();
  useEffect(() => {
    if (user && firestore) {
      let allMessagesCollection = collection(firestore!, `messages`);

      onSnapshot(allMessagesCollection, (snapshot) => {
        setMessages(
          snapshot.docs.sort(
            (a, b) => b.data().message_chat - a.data().message_chat
          )
        );
      });
    }
  });

  const sendNewMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      addDoc(messageRef, {
        message_chat: newMessage,
      });
    } catch {
      setError("There Was An Error Sending Your Message");
    }
  };

  return (
    <article className="app-main-article">
      {/* <div className="view-messages"> */}
      <form className="new-message" onSubmit={sendNewMessage}>
        <table>
          {/* {messages?.map((entry) =>     
                        <td>{entry.data().message_chat}</td>
                )} */}

          {messages?.map((entry) => {
            try {
              return entry.data().message_chat ? (
                <>
                  <tr key={entry.id}>
                    <td>{entry.data().message_chat}</td>
                  </tr>
                  {console.log("NOW")}
                </>
              ) : (
                <tr></tr>
              );
            } catch (e: any) {
              return;
            }
          })}
          {/* </div> */}

          <div className="new-message">
            <input
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
      </form>
    </article>
  );
}

export default Chatroom;
