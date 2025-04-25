import React, { useState } from "react";

function EditMessage({ categories, onSave, onCancel }) {
  const [editedMessage, setEditedMessage] = useState({
    category : categories.name,
    message : categories.message,
    enabled : categories.enabled,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(categories.name, editedMessage);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Category & Message content</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="category"
              value={editedMessage.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Message Content</label>
            <input
              type="text"
              name="message"
              value={editedMessage.message}
              onChange={handleChange}
              required
            />
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

export default EditMessage;