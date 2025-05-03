import React, { useState, useEffect } from "react"; // Import useEffect

// 1. Changed prop name from 'categories' to 'category'
function EditMessage({ category, onSave, onCancel }) {

  // 2. State specifically for the editable message field
  const [editedMessageContent, setEditedMessageContent] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  // 3. Use useEffect to safely initialize/reset state when the 'category' prop changes
  useEffect(() => {
    if (category) {
      // Initialize state with the message from the category prop
      setEditedMessageContent(category.message || '');
      setEditedCategory(category.categoryName || '');
      // No need to handle 'enabled' anymore
    } else {
      // Optional: Reset form if category becomes null (e.g., modal closes)
      setEditedMessageContent('');
      setEditedCategory('');
    }
  }, [category]); 

  const handleMessageChange = (e) => {
    setEditedMessageContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setEditedCategory(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDataToSend = {
        message: editedMessageContent,
        categoryName: editedCategory,
    };
    onSave(category.categoryID, updatedDataToSend);
  };

  if (!category) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Category & Message content</h2>
        <form onSubmit={handleSubmit}>
          {}
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={editedCategory}
              onChange={handleCategoryChange} 
              required
            />
          </div>
          {}
          <div className="form-group">
            <label>Message Content</label>
            <input
              type="text"
              name="message"
              value={editedMessageContent} 
              onChange={handleMessageChange} 
              required
            />
          </div>
          {}
          <div className="modal-actions">
            <button type="submit" >Save</button>
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