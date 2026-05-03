"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/Admin/DataTable";
import { Ban, CheckCircle, Loader2, User2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types";
import { AdminService } from "@/services/adminService";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import AdminGuard from "@/components/Admin/AdminGuard";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.reference_id === userId) {
        const newStatus = user.is_banned  ? false : true;
        return { ...user, is_banned: newStatus };
      }
      return user;
    }));
  };

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
  const formattedDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBanUnban = async (user: User) => {
    try {
      if (user.is_banned) {
        const response = await AdminService.unbanUser(user.reference_id)
        toast.success(response.data.message)
      } else {
        const response = await AdminService.banUser(user.reference_id)
        toast.success(response.data.message)
      }
      toggleUserStatus(user.reference_id)
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const columns = [
    {
      key: "name",
      title: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.full_name.charAt(0).toUpperCase()}
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
        <Badge variant="secondary">{user.is_admin ? "Admin" : "User"}</Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (user: User) => (
        <Badge variant={!user.is_banned ? "default" : "banned"}>
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
        <Button
          disabled={user.is_admin}
          variant={user.is_banned ? "default" : "destructive"}
          size="sm"
          onClick={() => handleBanUnban(user)}
        >
          {user.is_banned ? (
            <>
            
              <CheckCircle className="w-4 h-4 mr-1" />
              Unban
            </>
          ) : (
            <>
              <Ban className="w-4 h-4 mr-1" />
              Ban
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <AdminGuard >
   <div className="min-h-screen flex">
    <AdminSidebar />
    <div className="flex-1 p-8">
      <div className="space-y-6 animate-fade-in bg-(--gray-500)">
       <div className="bg-white border-b px-8 py-2 " style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Users Management</h2>
          </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User2 className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
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
    </AdminGuard>
  );
}
