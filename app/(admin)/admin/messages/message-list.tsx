"use client";

import { useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);

  const markAsRead = async (id: string, read: boolean) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });

    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--foreground)]/60">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 bg-[var(--card-bg)] rounded-lg border ${
            msg.read ? "border-[var(--border)]" : "border-[var(--accent)]"
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold text-[var(--foreground)]">
                {msg.name}
              </span>
              <span className="text-[var(--foreground)]/60 ml-2 text-sm">
                {msg.email}
              </span>
              {!msg.read && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--accent)] text-white rounded">
                  New
                </span>
              )}
            </div>
            <span className="text-sm text-[var(--foreground)]/40">
              {new Date(msg.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-[var(--foreground)]/80 whitespace-pre-wrap mb-4">
            {msg.message}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => markAsRead(msg.id, !msg.read)}
              className="text-sm px-3 py-1 border border-[var(--border)] rounded hover:bg-[var(--border)]"
            >
              Mark as {msg.read ? "unread" : "read"}
            </button>
            <button
              onClick={() => deleteMessage(msg.id)}
              className="text-sm px-3 py-1 border border-red-500/30 text-red-500 rounded hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
