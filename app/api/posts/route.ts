import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, content, coverImage } = await request.json();
    
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
      },
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, content, coverImage } = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        coverImage: coverImage || null,
      },
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { slug },
    });
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
