import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success && response.users) {
        setUsers(response.users.map(user => ({
          ...user,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.email,
          verified: user.isVerified || false,
          status: user.status || 'active',
          registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
          lastLogin: user.lastLogin || 'Never'
        })));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, newStatus);
      if (response.success) {
        alert('User status updated successfully!');
        await loadUsers();
        setSelectedUser(null);
      } else {
        alert(response.message || 'Failed to update user status.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => 
    (filterRole === '' || user.role === filterRole) &&
    (filterStatus === '' || user.status === filterStatus)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return '#3b82f6';
      case 'institute': return '#10b981';
      case 'company': return '#8b5cf6';
      case 'admin': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
          User Management
        </h2>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>
          Total: {users.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Role:</label>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px' 
              }}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="institute">Institution</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Filter by Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px' 
              }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 400px' : '1fr', gap: '25px' }}>
        {/* Users List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Users ({filteredUsers.length})
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No users found matching your filter criteria.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Verified</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      style={{ 
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        background: selectedUser?.id === user.id ? '#f0f9ff' : 'white'
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{user.name}</div>
                          <div style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: getRoleColor(user.role) + '20',
                          color: getRoleColor(user.role)
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: getStatusColor(user.status) + '20',
                          color: getStatusColor(user.status)
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: user.verified ? '#10b98120' : '#f59e0b20',
                          color: user.verified ? '#10b981' : '#f59e0b'
                        }}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                        {user.lastLogin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Sidebar */}
        {selectedUser && (
          <div className="card" style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                User Details
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
              <p style={{ marginBottom: '5px' }}><strong>Name:</strong> {selectedUser.name}</p>
              <p style={{ marginBottom: '5px' }}><strong>Email:</strong> {selectedUser.email}</p>
              <p style={{ marginBottom: '5px' }}><strong>Role:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: getRoleColor(selectedUser.role) + '20',
                  color: getRoleColor(selectedUser.role),
                  marginLeft: '8px'
                }}>
                  {selectedUser.role}
                </span>
              </p>
              <p style={{ marginBottom: '5px' }}><strong>Status:</strong> 
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: getStatusColor(selectedUser.status) + '20',
                  color: getStatusColor(selectedUser.status),
                  marginLeft: '8px'
                }}>
                  {selectedUser.status}
                </span>
              </p>
              <p style={{ marginBottom: '5px' }}><strong>Verified:</strong> {selectedUser.verified ? 'Yes' : 'No'}</p>
              <p style={{ marginBottom: '5px' }}><strong>Registered:</strong> {selectedUser.registrationDate}</p>
              <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                className="btn btn-primary"
                disabled={selectedUser.status === 'active'}
                style={{ width: '100%' }}
              >
                Activate User
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                className="btn btn-secondary"
                disabled={selectedUser.status === 'suspended'}
                style={{ width: '100%', background: '#f59e0b', color: 'white' }}
              >
                Suspend User
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedUser.id, 'inactive')}
                className="btn btn-secondary"
                disabled={selectedUser.status === 'inactive'}
                style={{ width: '100%', background: '#6b7280', color: 'white' }}
              >
                Deactivate User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
