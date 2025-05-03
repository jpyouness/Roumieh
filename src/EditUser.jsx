import React, { useState, useEffect } from "react"; // Import useEffect

function EditUserModal({ user, categories, onSave, onCancel }) {
  // Use state keys that match the user data structure ('category_id')
  const [editedUserData, setEditedUserData] = useState({
    username: '',
    email: '',
    categoryName: '', // Use 'category_id' consistently
  });

  // Use useEffect to safely initialize state when the 'user' prop changes
  useEffect(() => {
    if (user) {
      setEditedUserData({
        username: user.username || '',
        email: user.email || '',
        categoryName: user.categoryName || '', // Initialize using 'category_id'
      });
    } else {
      // Optional: Reset form if user becomes null
      setEditedUserData({ username: '', email: '', categoryName: '' });
    }
  }, [user]); // Rerun when user prop changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean the data: only send back fields meant to be updated
    const updatedDataToSend = {
        username: editedUserData.username,
        email: editedUserData.email,
        categoryName: editedUserData.categoryName // Use the consistent state key
    };
    onSave(user.device_identifier, updatedDataToSend);
  };

  if (!user) return null; // Don't render if no user

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User: {editedUserData.username}</h2>
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editedUserData.username}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editedUserData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Category Dropdown */}
          <div className="form-group">
            <label>Preferred Category</label>
            <select
              name="categoryName"                 // Name is "category_id"
              value={editedUserData.categoryName} // FIX: Value bound to state.category_id
              onChange={handleChange}           // Handler updates state.category_id
              required
            >
              {/* Optional: Add a default disabled option if needed */}
              {/* <option value="" disabled>Select a category</option> */}
              {categories.map(category => (
                <option key={category.categoryID} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          {/* Actions */}
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