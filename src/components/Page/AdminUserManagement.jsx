import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, PlusCircle, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { getAdminUsers, addAdminUser, deleteAdminUser } from '../../services/userAdminService';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ show: false, mode: 'add', user: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    (u.userName && u.userName.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (id === undefined || id === null) {
      alert('User ID is missing!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Send the ID to the service for deletion
        await deleteAdminUser(id);
        // Filter out the deleted user from the state to update the UI
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => setModal({ show: true, mode: 'edit', user });
  const handleAdd = () => setModal({ show: true, mode: 'add', user: null });

  const handleToggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 1 ? 0 : 1 } : u
    ));
  };

  const handleModalSave = async () => {
    const userName = document.getElementById('modal-userName').value;
    const email = document.getElementById('modal-email').value;
    const password = document.getElementById('modal-password')?.value;

    if (!userName || !email || (modal.mode === 'add' && !password)) {
      return alert('All fields are required');
    }

    if (modal.mode === 'edit') {
      setUsers(users.map(u => u.id === modal.user.id ? { ...u, userName, email } : u));
    } else {
      try {
        const newUser = await addAdminUser({ userName, email, password, roleId: 1, status: 1 });
        setUsers([...users, newUser]);
      } catch (err) {
        alert('Failed to create user');
        return;
      }
    }

    setModal({ show: false, mode: 'add', user: null });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin User Management</h2>
        <button onClick={handleAdd} className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <PlusCircle size={18} /> Add User
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-4 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full text-sm border shadow-sm rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">#</th>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u, i) => (
              <tr key={u.id} className="border-t hover:bg-white">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{u.userName}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  {Number(u.status) === 1 ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-500 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 items-center">
                  <button className="text-blue-600" title="View"><Eye size={16} /></button>
                  <button onClick={() => handleEdit(u)} className="text-yellow-600" title="Edit"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600" title="Delete"><Trash2 size={16} /></button>
                  <button
                    className="ml-2"
                    title="Toggle Status"
                    onClick={() => handleToggleStatus(u.id)}
                  >
                    {Number(u.status) === 1 ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border">
            <h3 className="text-lg font-semibold mb-4">
              {modal.mode === 'edit' ? 'Edit User' : 'Add User'}
            </h3>
            <div className="space-y-4">
              <input id="modal-userName" className="w-full border px-4 py-2 rounded" defaultValue={modal.user?.userName || ''} placeholder="Name" />
              <input id="modal-email" className="w-full border px-4 py-2 rounded" defaultValue={modal.user?.email || ''} placeholder="Email" />
              {modal.mode === 'add' && (
                <input id="modal-password" type="password" className="w-full border px-4 py-2 rounded" placeholder="Password" />
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal({ show: false, mode: 'add', user: null })} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleModalSave} className="px-4 py-2 bg-emerald-600 text-white rounded">
                  {modal.mode === 'edit' ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
