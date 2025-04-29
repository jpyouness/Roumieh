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
      setEditedCategory(category.category_id || '');
      // No need to handle 'enabled' anymore
    } else {
      // Optional: Reset form if category becomes null (e.g., modal closes)
      setEditedMessageContent('');
      setEditedCategory('');
    }
  }, [category]); // Dependency array: run effect when 'category' prop changes

  // 4. Specific handler for the message input change
  const handleMessageChange = (e) => {
    setEditedMessageContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setEditedCategory(e.target.value);
  };
  // 5. Fix handleSubmit to send only the updated message data
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create an object containing ONLY the field(s) meant to be updated
    const updatedDataToSend = {
        message: editedMessageContent,
        category_id: editedCategory,
        // 'enabled' field is removed
    };
    // Pass the original category ID and the cleaned update object
    onSave(category.category_id, updatedDataToSend);
  };

  // Prevent rendering if the category prop isn't available yet
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
              name="category_id"
              value={editedCategory}
              onChange={handleCategoryChange} // Use specific handler
              required
               // Display original ID from prop
               // Display original ID from prop
               // Make the category name uneditable in this form
             // Optional: Add class for styling read-only fields
            />
          </div>
          {}
          <div className="form-group">
            <label>Message Content</label>
            <input
              type="text"
              name="message" // Important: name matches the data field key
              value={editedMessageContent} // Bind value to state
              onChange={handleMessageChange} // Use specific handler
              required
            />
          </div>
          {/* 'enabled' field completely removed */}
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