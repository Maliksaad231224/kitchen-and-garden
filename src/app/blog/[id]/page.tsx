import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts } from "@/lib/db";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Comments from "@/components/Comments";
import SkipToContent from "@/components/SkipToContent";
import CookieConsent from "@/components/CookieConsent";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post: any) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p: any) => p.id === parseInt(id));

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p: any) => p.id === parseInt(id));

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen">
      <SkipToContent />

  <main className="bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/blog" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors">
              <ArrowLeft size={18} />
              Back to All Recipes
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Hero Image */}
            {post.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Title and Meta Information */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-gray-700 mb-6 italic leading-relaxed max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-red-500" />
                    <span className="font-medium">By {post.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-red-500" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-red-500" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed">
                    <MarkdownRenderer content={post.content || ""} />
                  </div>
                </div>
              </div>
            </article>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/blog" className="inline-flex items-center gap-2">
                  <ArrowLeft size={18} />
                  Back to All Recipes
                </Link>
              </Button>
              <Button asChild>
                <Link href="#comments">Join Discussion</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section id="comments" className="pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <Comments postId={post.id} />
          </div>
        </section>

        {/* Related Posts */}
        <section className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">More Delicious Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      {relatedPost.image && (
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {relatedPost.excerpt || relatedPost.content?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {new Date(relatedPost.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">View All Recipes</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      
      <CookieConsent />
    </div>
  );
}
