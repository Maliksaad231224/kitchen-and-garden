import CookieConsent from "@/components/CookieConsent";
import SkipToContent from "@/components/SkipToContent";
import BlogSearch from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/db";

export default async function BlogPage() {
  // Fetch posts from database
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen">
      <SkipToContent />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight">
              Recipes That
              <span className="block font-normal text-red-500">
                Actually Work
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Welcome to our kitchen laboratory where every recipe gets the rigorous testing treatment. 
              No more failed attempts, no more disappointing results—just reliable, delicious recipes 
              that will make you the star of your own kitchen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">500+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500 font-medium">Tested Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">10K+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500 font-medium">Happy Home Cooks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">100%</div>
                <div className="text-sm uppercase tracking-wider text-gray-500 font-medium">Kitchen Approved</div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Search and Content */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4">
            <BlogSearch posts={posts} />
          </div>
        </section>
      </main>

      
      <CookieConsent />
    </div>
  );
}
