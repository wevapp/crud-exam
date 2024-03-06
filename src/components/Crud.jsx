import React, { useEffect, useState } from "react";

// import ENDPOINT and TOKEN from Github
const ENDPOINT_API = "https://api.github.com/users";
// Need to be authenticate to get users from api
const MY_TOKEN =
  "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";

const Crud = () => {
  // Variable to handle data from api
  const [users, setUsers] = useState([]);
  // form data for new entry data
  const [formData, setFormData] = useState({
    id: "",
    login: "",
    type: "",
  });
  // to selected user for edit
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);
  // fetch data from api using async
  const fetchUsers = async () => {
    try {
      const response = await fetch(ENDPOINT_API, {
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`,
        },
      });
      const data = await response.json();
      // set to variable
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Get the details from field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // try to send request to server to save data
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

  // delete user
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

  return (
    <div className="container">
      {/* form field */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          name="id"
          value={formData.id}
          className="form-control"
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Profile Name"
          name="login"
          value={formData.login}
          className="form-control"
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Type"
          name="type"
          value={formData.type}
          className="form-control"
          onChange={handleChange}
        />
        <br />
        {selectedUser ? (
          <button
            className="btn btn-success"
            type="button"
            onClick={handleUpdate}
          >
            Update User
          </button>
        ) : (
          <button className="btn btn-success" type="submit">
            Add User
          </button>
        )}
      </form>

      {/* Display to table using map method */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Profile Name</th>
            <th scope="col">Type</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.type}</td>
              <td>
                <button
                  className="mx-1 btn btn-sm btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  className="mx-1 btn btn-sm btn-warning"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="mx-1 btn btn-sm btn-info"
                  onClick={() => handleRead(user)}
                >
                  Read
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;
