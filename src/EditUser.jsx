import React, { useState, useEffect } from "react"; 

function EditUserModal({ user, categories, onSave, onCancel }) {

  const [editedUserData, setEditedUserData] = useState({
    username: '',
    email: '',
    categoryID: '',
  });

 
  useEffect(() => {
    if (user) {
      setEditedUserData({
        username: user.username || '',
        email: user.email || '',
        categoryID: user.categoryID || '',
      });
    } else {
      setEditedUserData({ username: '', email: '', categoryID: '' });
    }
  }, [user]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDataToSend = {
        username: editedUserData.username,
        email: editedUserData.email,
        categoryID: editedUserData.categoryID
    };
    onSave(user.device_identifier, updatedDataToSend);
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User: {editedUserData.username}</h2>
        <form onSubmit={handleSubmit}>
          {}
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
          {}
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
          {}
          <div className="form-group">
            <label>Preferred Category</label>
            <select
              name="categoryID"                
              value={editedUserData.categoryID} 
              onChange={handleChange}          
              required
            >
              {}
              {}
              {categories.map(category => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          {}
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