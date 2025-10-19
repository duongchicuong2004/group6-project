import React from "react";

function UserList({ users }) {
  return (
    <div>
      <h3>Danh sách người dùng</h3>
      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u._id}>
              {u.name} - {u.email}
            </li>
          ))
        ) : (
          <li>Chưa có người dùng nào</li>
        )}
      </ul>
    </div>
  );
}

export default UserList;
