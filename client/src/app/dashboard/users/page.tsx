'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/state/api';
import { useAppSelector } from '@/app/redux';
import Image from 'next/image';

interface User {
  userId: string;
  name: string;
  email?: string;
  role: 'ADMIN' | 'USER';
  password?: string;
}

const dummyImages = [
  '/images/users/user1.png',
  '/images/users/user2.png',
  '/images/users/user3.png',
  '/images/users/user4.png',
  '/images/users/user5.png',
];

export default function UsersPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isDarkMode = useAppSelector(state => state.global.isDarkMode);

  const { data: usersData, isLoading, isError } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'USER', password: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(6);

  const users: User[] = useMemo(() => usersData || [], [usersData]);
  const filteredUsers = useMemo(() =>
    users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, page, usersPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleOpen = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'USER', password: '' });
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email || '', role: user.role, password: '' });
    setOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        alert('User deleted successfully ✅');
        if (paginatedUsers.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch {
        alert('Failed to delete user ❌');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.userId, ...formData }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      setOpen(false);
    } catch {
      alert('Failed to save user ❌');
    }
  };

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (isError || !usersData) return <div className="p-4 text-red-500">Failed to load users</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Users</h1>
        {isAdmin && (
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md transition-shadow"
          >
            + Add User
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table - FIXED ALIGNMENT */}
      <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}>
            <tr>
              <th className="p-3 border-b text-center w-20">Avatar</th>
              <th className="p-3 border-b text-center w-40">Name</th>
              <th className="p-3 border-b text-center w-48">Email</th>
              <th className="p-3 border-b text-center w-32">Role</th>
              <th className="p-3 border-b text-center w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr
                key={user.userId}
                className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                {/* Avatar - FIXED */}
                <td className="p-3 border-b text-center align-middle">
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full border mx-auto">
                    <Image
                      src={dummyImages[index % dummyImages.length]}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="object-cover rounded-full w-full h-full"
                    />
                  </div>
                </td>

                {/* Name - FIXED */}
                <td className="p-3 border-b text-center align-middle">
                  {user.name}
                </td>

                {/* Email - FIXED */}
                <td className="p-3 border-b text-center align-middle">
                  {user.email || '-'}
                </td>

                {/* Role - FIXED */}
                <td className="p-3 border-b text-center align-middle">
                  {user.role}
                </td>
                
                {/* Actions - FIXED */}
                <td className="p-3 border-b text-center align-middle">
                  {isAdmin ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 shadow-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Read-only</span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isAdmin && open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required={!editingUser}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' })}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}