import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingRequestsApi, approveRequestApi, rejectRequestApi, type PendingRequest } from "./authService";
import { Button } from "../../components/ui/button";
import { useToast } from "../../shared/context/useToast";
import { UserPlus, CheckCircle, XCircle, Loader2 } from "lucide-react";

function PendingApprovals() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: getPendingRequestsApi,
    refetchInterval: 10000,
  });

  const approveMutation = useMutation({
    mutationFn: approveRequestApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast("Registration approved", "success");
    },
    onError: () => addToast("Failed to approve request", "error"),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectRequestApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      addToast("Registration rejected", "success");
    },
    onError: () => addToast("Failed to reject request", "error"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <UserPlus className="h-12 w-12 text-muted dark:text-muted-dark" />
        <h3 className="mt-4 text-lg font-semibold text-text dark:text-text-dark">No pending requests</h3>
        <p className="mt-1 text-sm text-muted dark:text-muted-dark">
          New user registrations requiring approval will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text dark:text-text-dark">
            <UserPlus className="h-6 w-6" />
            Pending Approvals
          </h1>
          <p className="text-sm text-muted dark:text-muted-dark">
            {requests.length} request{requests.length !== 1 ? "s" : ""} waiting for your review
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border-dark">
                <th className="px-4 py-3 text-left font-medium text-muted dark:text-muted-dark">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted dark:text-muted-dark">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted dark:text-muted-dark">Requested</th>
                <th className="px-4 py-3 text-right font-medium text-muted dark:text-muted-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req: PendingRequest) => (
                <tr key={req.id} className="border-b border-border last:border-b-0 dark:border-border-dark">
                  <td className="px-4 py-3 font-medium text-text dark:text-text-dark">{req.name}</td>
                  <td className="px-4 py-3 text-muted dark:text-muted-dark">{req.email}</td>
                  <td className="px-4 py-3 text-muted dark:text-muted-dark">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => approveMutation.mutate(req.id)}
                        disabled={approveMutation.isPending && approveMutation.variables === req.id}
                      >
                        {approveMutation.isPending && approveMutation.variables === req.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => rejectMutation.mutate(req.id)}
                        disabled={rejectMutation.isPending && rejectMutation.variables === req.id}
                      >
                        {rejectMutation.isPending && rejectMutation.variables === req.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovals;