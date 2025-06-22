import React, { useEffect, useState } from 'react';
import './AccountManagement.css'; // Chúng ta sẽ tạo file CSS này ở bước sau

// --- Helper Functions để định dạng dữ liệu ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Dùng toLocaleString để có định dạng ngày giờ thân thiện hơn
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatBoolean = (value) => {
  return value ? 'Có' : 'Không';
};


// --- Component Modal để hiển thị chi tiết ---
const UserDetailsModal = ({ user, onClose }) => {
  // Nếu không có user được chọn, không hiển thị gì cả
  if (!user) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Chi tiết tài khoản: {user.firstName} {user.lastName}</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Họ và tên:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phoneNumber || 'N/A'}</p>
          <p><strong>Ngày sinh:</strong> {formatDate(user.dateOfBirth).split(',')[0]}</p>
          <hr />
          <p><strong>Vai trò (Role):</strong> {user.role}</p>
          <p><strong>Trạng thái hoạt động:</strong> <span className={user.isActive ? 'text-success' : 'text-danger'}>{formatBoolean(user.isActive)}</span></p>
          <p><strong>Email đã xác thực:</strong> <span className={user.isEmailVerified ? 'text-success' : 'text-danger'}>{formatBoolean(user.isEmailVerified)}</span></p>
          <hr />
          <p><strong>Ngày tạo tài khoản:</strong> {formatDate(user.createdAt)}</p>
          <p><strong>Lần đăng nhập cuối:</strong> {formatDate(user.lastLoginAt)}</p>
        </div>
        <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  );
};


// --- Component chính quản lý tài khoản ---
const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State để quản lý người dùng đang được xem chi tiết
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token'); // Lấy token để xác thực nếu cần
      try {
        const response = await fetch('https://localhost:7166/api/Auth/users', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (response.status === 401) throw new Error('Phiên đăng nhập hết hạn!');
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu người dùng');
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="account-management">
      <div className="header">
        <h2>Quản lý tài khoản</h2>
        {/* Bạn có thể thêm nút "Thêm mới" ở đây */}
      </div>

      {loading && <div className="loading">Đang tải dữ liệu...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="table-responsive">
            <table className="account-table">
                <thead>
                    <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user.userId}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role}</span>
                        </td>
                        <td>
                        {user.isActive ? (
                            <span className="status-active">Hoạt động</span>
                        ) : (
                            <span className="status-inactive">Khoá</span>
                        )}
                        </td>
                        <td className="text-center">
                            <button onClick={() => handleViewDetails(user)} className="btn btn-details">
                                Xem chi tiết
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Render component Modal */}
      <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
};

export default AccountManagement;