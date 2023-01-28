import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
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
  let currentDate = new Date();

  useEffect(() => {
    if (user && firestore) {
      let allMessagesCollection = query(
        collection(firestore!, `messages`),
        orderBy("date")
      );

      onSnapshot(allMessagesCollection, (snapshot) => {
        setMessages(
          snapshot.docs.sort(
            (a, b) => b.data().message_chat - a.data().message_chat
          )
        );
      });
    }
  }, [newMessage]);

  const sendNewMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      addDoc(messageRef, {
        message_chat: newMessage,
        date: currentDate,
      }).then(() => {
        console.log("Sent");
      });
    } catch (e) {
      setError("There Was An Error Sending Your Message");
      let error = e as FirebaseError;
      setError(error.message);
    }
  };

  return (
    <article className="app-main-article">
      <form className="new-message" onSubmit={sendNewMessage}>
        <table>
          {messages?.map((entry) => {
            try {
              return entry.data().message_chat ? (
                <>
                  <tr key={entry.id}>
                    <td>{entry.data().message_chat}</td>
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
          {/* </div> */}
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
