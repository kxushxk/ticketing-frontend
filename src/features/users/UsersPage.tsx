import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "./userService";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../shared/context/useToast";
import { DataTable } from "../../shared/components/DataTable";
import type { Column } from "../../shared/components/DataTable";
import type { UserRole } from "../../redux/auth/authTypes";
import type { UserWithStatus } from "./userService";
import { PermissionGuard } from "../auth/PermissionGuard";
import { Permissions } from "../auth/permissions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Shield, UserX, UserCheck, Loader2 } from "lucide-react";

const inviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MANAGER", "DEVELOPER", "USER"]),
});

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "DEVELOPER", "USER"];

function UsersPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<{ id: number; name: string; email: string; role: UserRole } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const inviteForm = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", password: "", role: "USER" as UserRole },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setInviteOpen(false);
      inviteForm.reset();
      addToast("User invited successfully", "success");
    },
    onError: () => addToast("Failed to invite user", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditUser(null);
      addToast("User updated", "success");
    },
    onError: () => addToast("Failed to update user", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteId(null);
      addToast("User deleted", "success");
    },
    onError: () => addToast("Failed to delete user", "error"),
  });

  const columns: Column<UserWithStatus>[] = useMemo(() => [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <Badge variant="default" className="gap-1">
          <Shield className="h-3 w-3" />
          {user.role}
        </Badge>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (user) => {
        const isActive = user.active !== false;
        return (
          <Badge variant={isActive ? "success" : "destructive"} className="gap-1">
            {isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex items-center gap-2">
          <PermissionGuard permission={Permissions.USERS_MANAGE}>
            <Button
              variant="link"
              size="sm"
              onClick={() => setEditUser({ id: Number(user.id), name: user.name, email: user.email, role: user.role as UserRole })}
            >
              Edit
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => updateMutation.mutate({
                id: Number(user.id),
                data: { active: user.active !== false ? false : true },
              })}
            >
              {user.active !== false ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => setDeleteId(Number(user.id))}
              className="text-earth"
            >
              Delete
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ], [updateMutation]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text dark:text-text-dark">
            <Users className="h-6 w-6" />
            Users
          </h1>
          <p className="text-sm text-muted dark:text-muted-dark">Manage team members and their roles</p>
        </div>
        <PermissionGuard permission={Permissions.USERS_MANAGE}>
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite User
          </Button>
        </PermissionGuard>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-border dark:bg-surface-dark-hover" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users ?? []}
            keyExtractor={(u) => String(u.id)}
          />
        )}
      </div>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User">
        <form onSubmit={inviteForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-3">
          <Input {...inviteForm.register("name")} label="Name" error={inviteForm.formState.errors.name?.message} />
          <Input {...inviteForm.register("email")} type="email" label="Email" error={inviteForm.formState.errors.email?.message} />
          <Input {...inviteForm.register("password")} type="password" label="Password" error={inviteForm.formState.errors.password?.message} />
          <Select {...inviteForm.register("role")} label="Role" options={ROLES.map((r) => ({ value: r, label: r }))} />
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Inviting...</> : "Invite"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-3">
            <Input
              defaultValue={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              label="Name"
            />
            <Select
              defaultValue={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
              label="Role"
              options={ROLES.map((r) => ({ value: r, label: r }))}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button
                type="button"
                onClick={() => updateMutation.mutate({ id: editUser.id, data: { name: editUser.name, role: editUser.role } })}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User">
        <p className="text-sm text-muted dark:text-muted-dark">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => deleteId !== null && deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default UsersPage;
