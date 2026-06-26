import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useTicketComments, useAddComment } from "../../hooks/useTicketComments";
import type { Comment } from "../../types/ticket";

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="rounded-lg border border-border bg-canvas p-3 dark:border-border-dark dark:bg-surface-dark/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text dark:text-text-dark">{comment.authorName}</span>
        <span className="text-xs text-muted dark:text-muted-dark">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted dark:text-muted-dark">{comment.body}</p>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-border dark:bg-surface-dark-hover" />
      ))}
    </div>
  );
}

interface TicketCommentsProps {
  ticketId: number;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
  const { data: comments, isLoading } = useTicketComments(ticketId);
  const addComment = useAddComment(ticketId);
  const user = useSelector((state: RootState) => state.auth.user);
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !user) return;
    addComment.mutate(
      { body: body.trim(), userId: Number(user.id) },
      { onSuccess: () => setBody("") },
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text dark:text-text-dark">Comments</h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          className="block flex-1 rounded-lg border border-border px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark-hover dark:text-text-dark dark:placeholder:text-muted-dark"
        />
        <button
          type="submit"
          disabled={!body.trim() || addComment.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addComment.isPending ? "..." : "Send"}
        </button>
      </form>

      {isLoading ? (
        <CommentSkeleton />
      ) : comments && comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted dark:text-muted-dark">No comments yet.</p>
      )}
    </div>
  );
}
