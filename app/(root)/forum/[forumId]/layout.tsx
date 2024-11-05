import React from "react";

export default function ForumDetailsLayout({
  children,
  pinnedPosts,
  posts,
}: Readonly<{
  children: React.ReactNode;
  pinnedPosts: React.ReactNode;
  posts: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      {pinnedPosts}
      {posts}
    </div>
  );
}
