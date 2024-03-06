import React, { useEffect, useState } from "react";

// import ENDPOINT and TOKEN from Github
const ENDPOINT_API = import.meta.env.VITE_API_ENDPOINT;
const MY_TOKEN = import.meta.env.VITE_JWT_SECRET;

const Crud = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    login: "",
    type: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(ENDPOINT_API, {
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENDPOINT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MY_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      const data = await response.json();
      setUsers([...users, data]);
      setFormData({ id: "", login: "", type: "" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${ENDPOINT_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      login: user.login,
      type: user.type || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${ENDPOINT_API}/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MY_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedUser = { ...selectedUser, ...formData };
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? updatedUser : user
          )
        );
        setFormData({ login: "", type: "" });
        setSelectedUser(null);
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRead = (user) => {
    alert(`Login: ${user.login}\nType: ${user.type}`);
  };
  console.log(users);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Profile Name"
          name="login"
          value={formData.login}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        />
        <br />
        {selectedUser ? (
          <button type="button" onClick={handleUpdate}>
            Update User
          </button>
        ) : (
          <button type="submit">Add User</button>
        )}
      </form>
      <ul>
        {users.length > 0 &&
          users.map((user) => (
            <li key={user.id}>
              <div>{user.id}</div>
              <div>{user.login}</div>
              <div>{user.type}</div>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleRead(user)}>Read</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Crud;
