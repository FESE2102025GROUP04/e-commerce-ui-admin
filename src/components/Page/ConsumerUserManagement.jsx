import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, Search, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { getConsumerUsers } from '../../services/userService'; // Assuming the service is named userService.js

const ConsumerUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });

  useEffect(() => {
    // Fetch users from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getConsumerUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    (u.userName && u.userName.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 1 ? 0 : 1 } : u
    ));
  };

  const deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteConsumerUser(id); // Call API to delete the user
        setUsers(users.filter(user => user.id !== id)); // Remove user from state
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditData({ name: user.userName, email: user.email });
  };

  const saveEdit = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, ...editData } : user
    ));
    setEditingUser(null);
    setEditData({ name: '', email: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Consumer User Management</h2>

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
          {filteredUsers.map((user, index) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {editingUser === user.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  user.userName // Access userName instead of name
                )}
              </td>
              <td className="px-4 py-2">
                {editingUser === user.id ? (
                  <input
                    type="email"
                    className="border px-2 py-1 rounded w-full"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="px-4 py-2">
              {Number(user.status) === 1 ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-500 font-medium">Inactive</span>
                  )}
              </td>
              <td className="px-4 py-2 flex gap-2 items-center">
                <button className="text-blue-600" title="View"><Eye size={16} /></button>
                {editingUser === user.id ? (
                  <>
                    <button className="text-green-600" onClick={() => saveEdit(user.id)} title="Save"><Save size={16} /></button>
                    <button className="text-gray-500" onClick={() => setEditingUser(null)} title="Cancel"><X size={16} /></button>
                  </>
                ) : (
                  <button className="text-yellow-600" title="Edit" onClick={() => handleEdit(user)}><Pencil size={16} /></button>
                )}
                <button onClick={() => deleteUser(user.id)} className="text-red-600" title="Delete"><Trash2 size={16} /></button>
                <button title="Toggle Status" onClick={() => toggleStatus(user.id)}>
                  {user.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsumerUserManagement;
