import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser />
      <UserList />
    </div>
  );
}

export default App;
