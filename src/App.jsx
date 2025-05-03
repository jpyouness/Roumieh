import React, { useState, useEffect } from "react";
import "./App.css";
import EditUserModal from './EditUser.jsx';
import EditMessage from "./EditMessage.jsx"; 
import DeleteCategoryForm from "./ConfirmDeleteCategory.jsx";
import AddCategoryForm from "./AddCategoryForm.jsx";

function App() {
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add updateUser function
  const updateUser = (userId, updatedUserData) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.device_identifier === userId 
          ? { ...user, ...updatedUserData } 
          : user
      )
    );
  };

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUsers([
        { username: "Charbel Assaker", email: "user1@example.com", categoryID: "2",  device_identifier: "MAC-001", last_active_at: "2025-04-02T10:30:00" },
        { username: "Jean-Pierre Younes", email: "user2@example.com", categoryID: "1",  device_identifier: "MAC-002", last_active_at: "2025-04-02T09:15:00" },
        { username: "Georges Chahine", email: "user3@example.com", categoryID: "3", device_identifier: "MAC-003", last_active_at: "2025-04-01T16:45:00" },
      ]);
      
      setCategories([
        {  categoryName: "Christianity",categoryID: "1",message: "Daily verse: Love your neighbor as yourself.", enabled: true },
        {  categoryName: "Islam",categoryID:"2", message: "Peace be upon you and Allah's mercy and blessings.", enabled: true },
        {   categoryName: "Motivational",categoryID:"3", message: "The best way to predict the future is to create it.", enabled: false },
      ]);
      
      setLogs([
        { logID: "log-1", categoryID: "1", device_identifier: "uuid-1", status: "success", timestamp: "2025-04-02T10:35:00" },
        { logID: "log-2", categoryID: "2", device_identifier: "uuid-2", status: "success", timestamp: "2025-04-02T09:20:00" },
        { logID: "log-3", categoryID: "32", device_identifier: "uuid-3", status: "failure", timestamp: "2025-04-01T16:50:00" },
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="dashboard">
      <header className="top-nav">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${activeSection === "users" ? "active" : ""}`} 
            onClick={() => setActiveSection("users")}
          >
            Users
          </button>
          <button 
            className={`nav-btn ${activeSection === "messages" ? "active" : ""}`} 
            onClick={() => setActiveSection("messages")}
          >
            Messages Management
          </button>
        </div>
      </header>
      <main className="content">
        <div className="content-wrapper">
          {isLoading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <>
              {activeSection === "users" && <UsersSection users={users} categories={categories} updateUser={updateUser} />}
              {activeSection === "messages" && <MessagesSection categories={categories} setCategories={setCategories} logs={logs} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function UsersSection({ users, categories, updateUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  // Handle edit button click
  const handleEditClick = (user) => {
    setEditingUser(user);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };
  
  // Handle save user
  const handleSaveUser = (userId, updatedUserData) => {
      updateUser(userId, updatedUserData);
      setEditingUser(null);
  };
  
  
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? user.categoryID === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const debugUserAndCategories = () => {
      console.log("=== DEBUG: Current User Data ===");
      console.log(users);
  
      console.log("=== DEBUG: Current Categories ===");
      console.log(categories);
    };
  
    debugUserAndCategories();
  }, [users, categories]);

  return (
    <div className="section">
      <h2 className="section-title">Users Management</h2>
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Preferred Category</th>
              <th>Device ID</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.device_identifier}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{categories.find(cat => cat.categoryID === user.categoryID)?.categoryName || "Unkown"}</td>
                  <td>{user.device_identifier}</td>
                  <td>{formatDate(user.last_active_at)}</td>
                  <td>
                    <div className="action-buttons_Edit_Users">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          categories={categories}
          onSave={handleSaveUser}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

function MessagesSection( {categories, logs, setCategories}) {
  const [activeTab, setActiveTab] = useState("categories");
  
  return (
    <div className="section">
      <h2 className="section-title">Messages Management</h2>
      
      <div className="tab-buttons">
        <button 
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories & Messages
        </button>
        <button 
          className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          Message Logs
        </button>
      </div>
      
      {activeTab === "categories" ? (
        <CategoriesTable categories={categories} setCategories={setCategories}/>
      ) : (
        <LogsTable logs={logs} categories={categories} />
      )}
    </div>
  );
}

function CategoriesTable({ categories, setCategories }) {
  const updateCategory = (categoryId, updatedCategoryData) => {
    setCategories(prevCategory => 
      prevCategory.map(category => 
        category.categoryID === categoryId
          ? { ...category, ...updatedCategoryData } 
          : category
      )
    );}

  const [editingCategory, setEditingCategory] = useState(null);
  const [DeletingCategory, setDeletingCategory] = useState(null);
  const handleCategoryClick = (category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategoryClick = (category) => {
    setDeletingCategory(category);
  };
  
  // Handle cancel edit
  const handleCancelEditCategory = () => {
    setEditingCategory(null);
  };

  const handleCancelDeleteCategory = () => {
    setDeletingCategory(null);
  };
  
  // Handle save user
  const handleSaveCategory = (categoryName, updatedCategoryData) => {
      updateCategory(categoryName, updatedCategoryData);
      setEditingCategory(null);
  };

  const toggleEnable = (category) => {
    setCategories(prevCategories =>
      prevCategories.map(item =>
        item.categoryID === category.categoryID
          ? { ...item, enabled: !item.enabled }
          : item
      )
    );
  };

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setShowAddForm(false);
  };
  
  const handleCancelAdd = () => setShowAddForm(false);
  
  const nextCategoryID  = String(categories.length+1);
  return (
    <div className="table-container">
      <div className="table-actions">
        <button className="add-btn" onClick={() => setShowAddForm(true)}>Add New Category</button>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Current Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.categoryID} className={!category.enabled ? "disabled-row" : ""}>
              <td>{category.categoryName}</td>
              <td className="message-cell">{category.message}</td>
              <td>
                <span className={`status-badge ${category.enabled ? "active" : "inactive"}`}>
                  {category.enabled ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit" onClick={() => handleCategoryClick(category)}>Edit</button>
                  <button className="action-btn toggle" onClick={() => toggleEnable(category)}>
                    {category.enabled ? "Disable" : "Enable"}
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteCategoryClick(category)}
>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingCategory && (
  <EditMessage
    category={editingCategory}
    onSave={handleSaveCategory}
    onCancel={handleCancelEditCategory}
  />)}
  {DeletingCategory && (
    <DeleteCategoryForm
    category={DeletingCategory}
    onCancel={handleCancelDeleteCategory}
    updateCategories={setCategories}
  />
  )}

    {showAddForm && (
      <AddCategoryForm
        onSave={handleAddCategory}
        onCancel={handleCancelAdd}
        nextCategoryID={nextCategoryID} // Pass the next ID to the form 
      />
)}
    </div>
    
  );
}

function LogsTable({ logs, categories }) {
  // Function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryID === categoryId);
    return category ? category.categoryName : "Unknown";
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>timestamp</th>
            <th>Category</th>
            <th>Device ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.logID}>
              <td>{formatDate(log.timestamp)}</td>
              <td>{getCategoryName(log.categoryID)}</td>
              <td>{log.device_identifier}</td>
              <td>
                <span className={`status-badge ${log.status === "success" ? "success" : "failure"}`}>
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;