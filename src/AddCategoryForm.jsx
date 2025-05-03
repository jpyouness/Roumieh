import { useState } from "react";

function AddCategoryForm({ onSave, onCancel, nextCategoryID }) {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      categoryName,
      categoryID: nextCategoryID,
      message,
      enabled
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Category Name:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Message:</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Enabled:</label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddCategoryForm;