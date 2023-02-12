import "./App.css";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { Route, Routes } from "react-router-dom";
import Authentication from "./components/authentication/Authentication";
import Layout from "./Layout";
import Chatroom from "./components/chat_room/ChatRoom";
import ViewUsers from "./components/view_users/viewUsers";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Chatroom />} />
        <Route path="Chat_Room" element={<Authentication />} />
        <Route path="View_Users" element={<ViewUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
