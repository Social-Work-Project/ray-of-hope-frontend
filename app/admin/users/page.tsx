"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/Admin/DataTable";
import {
  Ban,
  CheckCircle,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  User2,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types";
import { AdminService } from "@/services/adminService";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import AdminGuard from "@/components/Admin/AdminGuard";
import { CreateUserModal } from "@/components/Admin/CreateUserModal";
import DeleteConfirmModal from "@/components/common/DeleteDialogModal";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // View modal state
  const [viewUser, setViewUser] = useState<User | null>(null);

  // Edit modal state — wire up your own EditUserModal here
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    fetchAllUsers();
  }, [currentPage]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllUsers();
      setUsers(response.data.results || []);
      setTotalItems(response.data.count || 0);
    } catch (error: any) {
      toast.error(error.message);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === userId ? { ...u, is_banned: !u.is_banned } : u,
      ),
    );
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    setTotalItems((c) => c - 1);
  };

  const formattedDate = (isoDate: string) =>
    new Date(isoDate).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleBanUnban = async (user: User) => {
    try {
      if (user.is_banned) {
        const res = await AdminService.banunbanUser(user.user_id, {
          is_banned: false,
        });
        toast.success("User unbanned successfully!");
      } else {
        const res = await AdminService.banunbanUser(user.user_id, {
          is_banned: true,
        });
        toast.success("User banned successfully!");
      }
      toggleUserStatus(user.user_id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await AdminService.deleteUser(id); // add this method to AdminService
      toast.success("User deleted.");
      removeUser(id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSelectedUserId("");
    }
  };

   const handleClose = () => {
     setOpenModal(false);
     setSelectedUser(null);
   };

   const handleAddNew = () => {
     setSelectedUser(null);
     setOpenModal(true);
   };

   const handleEdit = (user: User) => {
     setSelectedUser(user);
     setOpenModal(true);
   };
  const columns = [
    {
      key: "name",
      title: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (user: User) => (
        <Badge className="bg-amber-500/90 text-gray-900" variant="secondary">
          {user.is_super_admin ? "Super Admin" : "Admin"}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (user: User) => (
        <Badge
          className={
            !user.is_banned
              ? "bg-green-600 text-white"
              : "bg-amber-400 text-black"
          }
        >
          {!user.is_banned ? "Active" : "Banned"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Joined",
      render: (user: User) => <p>{formattedDate(user.date_joined)}</p>,
    },
    {
      key: "actions",
      title: "Actions",
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            {/* View — available to everyone */}
            <DropdownMenuItem onClick={() => setViewUser(user)}>
              <User2 className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>

            {/* Edit — only for non-super-admins */}
            {!user.is_super_admin && (
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}

            {/* Ban / Unban — only for non-super-admins */}
            {!user.is_super_admin && (
              <DropdownMenuItem onClick={() => handleBanUnban(user)}>
                {user.is_banned ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Unban
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2 text-amber-500" />
                    Ban
                  </>
                )}
              </DropdownMenuItem>
            )}

            {/* Delete — only for non-super-admins */}
            {!user.is_super_admin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUserId(user.user_id);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div
              className="bg-white border-b px-8 py-2"
              style={{ borderColor: "var(--gray-100)" }}
            >
              <h2
                className="font-bold text-lg"
                style={{ color: "var(--navy)" }}
              >
                Users Management
              </h2>
            </div>

            {/* Add User button */}
            <div
              onClick={handleAddNew}
              className="justify-self-end mr-8 border px-3 py-2 rounded-lg bg-green-800/90 text-white flex items-center gap-2 hover:bg-green-700 transition-all duration-300 cursor-pointer w-fit"
            >
              <Plus size={20} /> Add User
            </div>

            {/* Table */}
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <User2 className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No users found
                    </h3>
                  </div>
                ) : (
                  <DataTable
                    data={users}
                    columns={columns}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    isLoading={loading}
                    pageSize={10}
                    totalItems={totalItems}
                    serverPagination={true}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        user={selectedUser}
        open={openModal}
        onClose={handleClose}
        onSuccess={fetchAllUsers}
      />

      {/* ── View User Dialog ── */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {viewUser && (
            <div className="space-y-4 pt-2">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {viewUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold">{viewUser.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{viewUser.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Email" value={viewUser.email} />
                <InfoRow
                  label="Role"
                  value={viewUser.is_super_admin ? "Super Admin" : "Admin"}
                />
                <InfoRow
                  label="Status"
                  value={viewUser.is_banned ? "Banned" : "Active"}
                />
                <InfoRow
                  label="Joined"
                  value={formattedDate(viewUser.date_joined)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(selectedUserId)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${users.find((m) => m.user_id === selectedUserId)?.username}" from User List? This action cannot be undone.`}
        isLoading={deleting}
      />
    </AdminGuard>
  );
}

/* Small helper for the View dialog */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
