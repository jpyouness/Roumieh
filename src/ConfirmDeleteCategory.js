import React from "react"; 

function DeleteCategoryForm({ category, onCancel, updateCategories }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // 🛑 Prevent form from reloading the page!

    updateCategories(prevCategories =>
      prevCategories.filter(c => c.category_id !== category)
    );

    onCancel(); // ✅ Close the modal after deletion
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Delete Category</h2>
        <form onSubmit={handleSubmit}>
          <p>Are you sure you want to delete the category <strong>{category}</strong>?</p>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteCategoryForm;
