import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createComment, deleteComment, listComments, updateComment } from "../api/comments";
import { fieldErrorsOf } from "../api/client";
import { ErrorBox, Loading } from "./Feedback";
import { useApiMutation, useMembers } from "../lib/hooks";
import { formatDate } from "../lib/format";
import { btn, btnPrimary, card, input } from "../lib/ui";
import type { CommentResponse, TaskResponse } from "../types/api";
import { MessageSquare, Send, Trash2, Edit } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CommentItem({ comment }: { comment: CommentResponse }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const save = useApiMutation(
    () => updateComment(comment.id, text.trim()),
    "Comment updated",
    () => setEditing(false),
  );
  const remove = useApiMutation(() => deleteComment(comment.id), "Comment deleted");

  return (
    <li className="flex items-start gap-3.5 py-4 border-b border-border/60 last:border-0">
      {/* Avatar Circle with Navy Tint */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-soft text-navy font-bold text-xs border border-navy-border/60">
        {getInitials(comment.authorName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-navy">{comment.authorName}</span>
            <span className="text-border">•</span>
            <span className="text-text-muted">{formatDate(comment.createdAt)}</span>
          </div>

          {!editing && (
            <div className="flex items-center gap-2 text-xs">
              <button
                className="inline-flex items-center gap-1 text-text-muted hover:text-navy cursor-pointer transition-colors"
                onClick={() => setEditing(true)}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                className="inline-flex items-center gap-1 text-text-muted hover:text-danger cursor-pointer transition-colors"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="mt-2.5 space-y-2">
            <textarea
              rows={3}
              maxLength={2000}
              className={input}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {fieldErrorsOf(save.error).content && (
              <p className="text-xs text-danger font-medium">{fieldErrorsOf(save.error).content}</p>
            )}
            <div className="flex gap-2">
              <button
                className={`${btnPrimary} h-8 px-3 text-xs`}
                disabled={save.isPending}
                onClick={() => save.mutate()}
              >
                Save Changes
              </button>
              <button
                className={`${btn} h-8 px-3 text-xs`}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-text-main leading-relaxed">
            {comment.content}
          </p>
        )}
      </div>
    </li>
  );
}

export default function CommentsSection({ task }: { task: TaskResponse }) {
  const comments = useQuery({
    queryKey: ["comments", task.id],
    queryFn: () => listComments(task.id),
  });
  const members = useMembers(task.projectId);
  const active = (members.data ?? []).filter((m) => m.active);

  const [authorId, setAuthorId] = useState("");
  const [content, setContent] = useState("");
  // Falls back to the first active member until the user picks one.
  const author = authorId || String(active[0]?.userId ?? "");

  const add = useApiMutation(
    () => createComment(task.id, { authorId: Number(author), content: content.trim() }),
    "Comment added",
    () => setContent(""),
  );
  const fe = fieldErrorsOf(add.error);

  return (
    <section className={card}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
          Discussion ({comments.data?.length ?? 0})
        </h2>
      </div>

      {comments.isPending && <Loading label="Loading comments..." />}
      {comments.isError && <ErrorBox error={comments.error} onRetry={() => comments.refetch()} />}
      {comments.data && comments.data.length === 0 && (
        <p className="py-4 text-center text-xs text-text-muted italic">
          No comments yet. Start the conversation below.
        </p>
      )}

      {comments.data && comments.data.length > 0 && (
        <ul className="divide-y divide-border/60">
          {comments.data.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}

      {/* New Comment Box */}
      <form
        className="mt-4 pt-4 border-t border-border/80"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <div className="mb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-navy flex items-center gap-2">
            <span>Comment as:</span>
            <select
              className="h-8 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-navy focus:border-primary focus:outline-none"
              value={author}
              onChange={(e) => setAuthorId(e.target.value)}
            >
              {active.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </label>
          <span className="text-[11px] text-text-muted">Markdown formatting supported</span>
        </div>

        <textarea
          rows={3}
          maxLength={2000}
          required
          className={input}
          placeholder="Share an update or ask a question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {(fe.content || fe.authorId) && (
          <p className="mt-1 text-xs text-danger font-medium">{fe.content ?? fe.authorId}</p>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className={`${btnPrimary} h-9 px-4 text-xs`}
            disabled={add.isPending || !author || !content.trim()}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {add.isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </section>
  );
}
