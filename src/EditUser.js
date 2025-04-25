import React, { useState } from "react";

function EditUserModal({ user, categories, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState({
    username: user.username,
    email: user.email,
    preferred_category_id: user.category_id,
    device_identifier: user.device_identifier
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.device_identifier, editedUser);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Preferred Category</label>
            <select
              name="category_id"
              value={editedUser.category_id}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_id}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;