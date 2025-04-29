import React, { useState, useEffect } from "react";
import "./App.css";
import EditUserModal from './EditUser.js';
import EditMessage from "./EditMessage.js"; 

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
        { username: "Charbel Assaker", email: "user1@example.com", category_id: "Islam",  device_identifier: "MAC-001", last_active_at: "2025-04-02T10:30:00" },
        { username: "Jean-Pierre Younes", email: "user2@example.com", category_id: "Christianity",  device_identifier: "MAC-002", last_active_at: "2025-04-02T09:15:00" },
        { username: "Georges Chahine", email: "user3@example.com", category_id: "Motivational", device_identifier: "MAC-003", last_active_at: "2025-04-01T16:45:00" },
      ]);
      
      setCategories([
        {  category_id: "Christianity", message: "Daily verse: Love your neighbor as yourself.", enabled: true },
        {  category_id: "Islam", message: "Peace be upon you and Allah's mercy and blessings.", enabled: true },
        {   category_id: "Motivational", message: "The best way to predict the future is to create it.", enabled: false },
      ]);
      
      setLogs([
        { id: "log-1", category_id: "Islam", user_id: "uuid-1", status: "success", timestamp: "2025-04-02T10:35:00" },
        { id: "log-2", category_id: "Chad", user_id: "uuid-2", status: "success", timestamp: "2025-04-02T09:20:00" },
        { id: "log-3", category_id: "Motivational", user_id: "uuid-3", status: "failure", timestamp: "2025-04-01T16:50:00" },
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
  
  
  
  // Filter users based on search and category filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? user.category_id === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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
              <option key={category.category_id} value={category.category_id}>
                {category.category_id}
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
                  <td>{user.category_id}</td>
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
      
      {}
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
  const updateCategory = (categoryName, updatedCategoryData) => {
    setCategories(prevCategory => 
      prevCategory.map(category => 
        category.category_id === categoryName
          ? { ...category, ...updatedCategoryData } 
          : category
      )
    );
  };

  const [editingCategory, setEditingCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setEditingCategory(category);
  };
  
  // Handle cancel edit
  const handleCancelEditt = () => {
    setEditingCategory(null);
  };
  
  // Handle save user
  const handleSaveCategory = (categoryName, updatedCategoryData) => {
      updateCategory(categoryName, updatedCategoryData);
      setEditingCategory(null);
  };

  const toggleEnable = (category) => {
    setCategories(prevCategories =>
      prevCategories.map(item =>
        item.category_id === category.category_id
          ? { ...item, enabled: !item.enabled }
          : item
      )
    );
  };
  

  return (
    <div className="table-container">
      <div className="table-actions">
        <button className="add-btn">Add New Category</button>
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
            <tr key={category.category_id} className={!category.enabled ? "disabled-row" : ""}>
              <td>{category.category_id}</td>
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
                  <button className="action-btn delete">Delete</button>
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
    onCancel={handleCancelEditt}
  />
)}

    </div>
    
  );
}

function LogsTable({ logs, categories }) {
  // Function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_id : "Unknown";
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
            <tr key={log.id}>
              <td>{formatDate(log.timestamp)}</td>
              <td>{getCategoryName(log.category_id)}</td>
              <td>{log.user_id}</td>
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