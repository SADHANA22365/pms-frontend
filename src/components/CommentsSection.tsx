import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createComment, deleteComment, listComments, updateComment } from "../api/comments";
import { fieldErrorsOf } from "../api/client";
import { ErrorBox, Loading } from "./Feedback";
import { useApiMutation, useMembers } from "../lib/hooks";
import { formatDate } from "../lib/format";
import { btn, btnPrimary, card, input } from "../lib/ui";
import type { CommentResponse, TaskResponse } from "../types/api";

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
    <li className="border-b py-3 last:border-0">
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          <b className="text-slate-700">{comment.authorName}</b> · {formatDate(comment.createdAt)}
        </span>
        {!editing && (
          <span className="space-x-3">
            <button className="hover:underline" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="hover:text-red-600 hover:underline"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              Delete
            </button>
          </span>
        )}
      </div>
      {editing ? (
        <div className="mt-2">
          <textarea
            rows={3}
            maxLength={2000}
            className={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {fieldErrorsOf(save.error).content && (
            <p className="text-xs text-red-600">{fieldErrorsOf(save.error).content}</p>
          )}
          <div className="mt-2 flex gap-2">
            <button className={btnPrimary} disabled={save.isPending} onClick={() => save.mutate()}>
              Save
            </button>
            <button className={btn} onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
      )}
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
    <section className={`${card} mt-4`}>
      <h2 className="mb-2 font-semibold">Comments</h2>
      {comments.isPending && <Loading />}
      {comments.isError && <ErrorBox error={comments.error} onRetry={() => comments.refetch()} />}
      {comments.data && comments.data.length === 0 && (
        <p className="text-sm text-slate-400">No comments yet.</p>
      )}
      <ul>
        {comments.data?.map((c) => <CommentItem key={c.id} comment={c} />)}
      </ul>

      <form
        className="mt-3 border-t pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="text-slate-500">Comment as</span>
          <select className={`${input} w-52`} value={author} onChange={(e) => setAuthorId(e.target.value)}>
            {active.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={3}
          maxLength={2000}
          required
          className={input}
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {(fe.content || fe.authorId) && (
          <p className="text-xs text-red-600">{fe.content ?? fe.authorId}</p>
        )}
        <button className={`${btnPrimary} mt-2`} disabled={add.isPending || !author}>
          {add.isPending ? "Posting..." : "Post comment"}
        </button>
      </form>
    </section>
  );
}