import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttachments, uploadAttachment } from "../../services/ticketService";
import { useToast } from "../../shared/context/useToast";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Paperclip, Upload, FileText, Download, Loader2 } from "lucide-react";

interface TicketAttachmentsProps {
  ticketId: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TicketAttachments({ ticketId }: TicketAttachmentsProps) {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);
  const { addToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: attachments, isLoading } = useQuery({
    queryKey: ["ticket", String(ticketId), "attachments"],
    queryFn: () => getAttachments(ticketId),
    enabled: !!ticketId,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(ticketId, file, Number(user?.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", String(ticketId), "attachments"] });
      addToast("File uploaded", "success");
    },
    onError: () => addToast("Failed to upload file", "error"),
    onSettled: () => setUploading(false),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      addToast("File must be under 10MB", "error");
      return;
    }
    setUploading(true);
    uploadMutation.mutate(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
          <Paperclip className="h-4 w-4" />
          Attachments
          {attachments && attachments.length > 0 && (
            <span className="text-xs font-normal text-muted">({attachments.length})</span>
          )}
        </h3>
        <div>
          <input
            ref={fileRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-border dark:bg-surface-dark-hover" />
          ))}
        </div>
      ) : attachments && attachments.length > 0 ? (
        <div className="divide-y divide-border rounded-lg border border-border dark:divide-border-dark dark:border-border-dark">
          {attachments.map((att) => (
            <div key={att.id} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-8 w-8 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text dark:text-text-dark">{att.fileName}</p>
                <p className="text-xs text-muted dark:text-muted-dark">
                  {formatSize(att.fileSize)} &middot; {att.uploadedByName}
                </p>
              </div>
              <a
                href={att.url}
                download={att.fileName}
                className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-muted dark:hover:bg-surface-dark-hover"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted dark:text-muted-dark">No attachments yet.</p>
      )}
    </div>
  );
}
