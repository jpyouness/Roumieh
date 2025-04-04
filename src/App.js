import React, { useState, useEffect } from "react";
import "./App.css";
import EditUserModal from './EditUser.js'; // Import the EditUserModal component

function App() {
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add updateUser function
  const updateUser = (userId, updatedUserData) => {
    // In a real app, this would be an API call
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
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
        { id: "uuid-1", username: "user1", email: "user1@example.com", preferred_category_id: "cat-1",  device_identifier: "MAC-001", last_active_at: "2025-04-02T10:30:00" },
        { id: "uuid-2", username: "user2", email: "user2@example.com", preferred_category_id: "cat-2",  device_identifier: "MAC-002", last_active_at: "2025-04-02T09:15:00" },
        { id: "uuid-3", username: "user3", email: "user3@example.com", preferred_category_id: "cat-1", device_identifier: "MAC-003", last_active_at: "2025-04-01T16:45:00" },
      ]);
      
      setCategories([
        { id: "cat-1", name: "Christianity", message: "Daily verse: Love your neighbor as yourself.", enabled: true },
        { id: "cat-2", name: "Islam", message: "Peace be upon you and Allah's mercy and blessings.", enabled: true },
        { id: "cat-3", name: "Motivational", message: "The best way to predict the future is to create it.", enabled: false },
      ]);
      
      setLogs([
        { id: "log-1", category_id: "cat-1", user_id: "uuid-1", status: "success", timestamp: "2025-04-02T10:35:00" },
        { id: "log-2", category_id: "cat-2", user_id: "uuid-2", status: "success", timestamp: "2025-04-02T09:20:00" },
        { id: "log-3", category_id: "cat-1", user_id: "uuid-3", status: "failure", timestamp: "2025-04-01T16:50:00" },
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
              {activeSection === "messages" && <MessagesSection categories={categories} logs={logs} />}
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
    const matchesCategory = filterCategory ? user.preferred_category_id === filterCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get category name from ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "None";
  }; // This closing brace was missing in your code

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
              <option key={category.id} value={category.id}>
                {category.name}
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
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{getCategoryName(user.preferred_category_id)}</td>
                  <td>{user.device_identifier}</td>
                  <td>{formatDate(user.last_active_at)}</td>
                  <td>
                    <div className="action-buttons">
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
      
      {/* Render EditUserModal when a user is being edited */}
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

function MessagesSection({ categories, logs }) {
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
        <CategoriesTable categories={categories} />
      ) : (
        <LogsTable logs={logs} categories={categories} />
      )}
    </div>
  );
}

function CategoriesTable({ categories }) {
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
            <tr key={category.id} className={!category.enabled ? "disabled-row" : ""}>
              <td>{category.name}</td>
              <td className="message-cell">{category.message}</td>
              <td>
                <span className={`status-badge ${category.enabled ? "active" : "inactive"}`}>
                  {category.enabled ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn toggle">
                    {category.enabled ? "Disable" : "Enable"}
                  </button>
                  <button className="action-btn delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogsTable({ logs, categories }) {
  // Function to get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
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
            <th>Timestamp</th>
            <th>Category</th>
            <th>User ID</th>
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