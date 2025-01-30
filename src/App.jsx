import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data.map((user) => ({ ...user, isEditing: false })));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers([...users, { ...data, isEditing: false }]);
      setNewUser({ name: '', email: '', phone: '' });
      setIsAdding(false);
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleEditUser = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isEditing: true } : user
    ));
  };

  const handleUpdateUser = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(users.map(u => 
        u.id === id ? { ...data, isEditing: false } : u
      ));
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleInputChange = (id, field, value) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, [field]: value } : user
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add User
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isAdding && (
            <div className="mb-6 p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">
                      {user.isEditing ? (
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isEditing ? (
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isEditing ? (
                        <input
                          type="tel"
                          value={user.phone}
                          onChange={(e) => handleInputChange(user.id, 'phone', e.target.value)}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        user.phone
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-2">
                        {user.isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateUser(user.id)}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="Save"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setUsers(users.map(u => 
                                u.id === user.id ? { ...u, isEditing: false } : u
                              ))}
                              className="p-1 text-gray-600 hover:text-gray-700"
                              title="Cancel"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;