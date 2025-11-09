import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createComment, getCommentsByPostId } from "@/lib/db";
import { getCommentById, updateComment, deleteCommentById } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }
    const comments = await getCommentsByPostId(parseInt(postId, 10));
    return NextResponse.json({ comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only regular users (not admins) may post comments. Admin accounts live in a separate table
    // and would violate the comments.user_id foreign key which references the `users` table.
    if ((session.user as any).role !== "user") {
      return NextResponse.json({ error: "Only regular users may post comments" }, { status: 403 });
    }
    const body = await req.json();
    const { postId, content } = body;
    if (!postId || !content) {
      return NextResponse.json({ error: "postId and content required" }, { status: 400 });
    }

  const userId = parseInt(session.user.id as string, 10);
    if (!userId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    const comment = await createComment(parseInt(postId, 10), userId, content);
    if (!comment) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { commentId, content } = body;
    if (!commentId || !content) {
      return NextResponse.json({ error: "commentId and content required" }, { status: 400 });
    }

    const comment = await getCommentById(parseInt(commentId, 10));
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const role = (session.user as any).role;

    if (role !== "admin" && String(comment.user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await updateComment(parseInt(commentId, 10), content);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, comment: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "commentId required" }, { status: 400 });
    }

    const comment = await getCommentById(parseInt(commentId, 10));
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const role = (session.user as any).role;

    if (role !== "admin" && String(comment.user_id) !== String(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ok = await deleteCommentById(parseInt(commentId, 10));
    if (!ok) {
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
