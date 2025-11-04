'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/state/api';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
  userId: string; // Changed to string to match API
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

  const { data: usersData, isLoading, isError } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: 'USER' as 'USER' | 'ADMIN', // Fixed type
    password: '' 
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(6);

  // Fixed: Handle API data type conversion
  const users: User[] = useMemo(() => {
    if (!usersData) return [];
    return usersData.map(user => ({
      userId: user.userId.toString(), // Convert number to string
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }, [usersData]);

  const filteredUsers = useMemo(() =>
    users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

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
    setFormData({ 
      name: user.name, 
      email: user.email || '', 
      role: user.role, 
      password: '' 
    });
    setOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      // Convert string userId back to number for API call
      await deleteUser(parseInt(userId)).unwrap();
      if (paginatedUsers.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      alert('Failed to delete user ❌');
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Convert string userId back to number for API call
        await updateUser({ 
          id: parseInt(editingUser.userId), 
          body: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password })
          }
        }).unwrap();
      } else {
        await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }).unwrap();
      }
      setOpen(false);
    } catch {
      alert('Failed to save user ❌');
    }
  };

  
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !usersData) {
    return (
      <Card className="m-6">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-destructive text-lg font-semibold">Failed to load users</div>
            <div className="text-muted-foreground mt-2">Please try again later</div>
          </div>
        </CardContent>
      </Card>
    );
  }

   return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and permissions</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={handleOpen}>
              + Add User
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search users by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow key={user.userId} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full border">
                      <Image
                        src={dummyImages[index % dummyImages.length]}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {isAdmin ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user
                                "{user.name}" from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.userId)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Read-only
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No users found matching your search
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <Card>
          <CardContent className="flex justify-between items-center py-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Page</span>
              <Badge variant="secondary">
                {page} of {totalPages}
              </Badge>
            </div>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User Modal */}
      {isAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information.' : 'Create a new user account.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to keep current" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'USER') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}