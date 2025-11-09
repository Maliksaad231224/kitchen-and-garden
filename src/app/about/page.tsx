import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, Heart, Award, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Kitchen & Garden - Our Story of Culinary Excellence",
  description: "Discover the story behind Kitchen & Garden, your trusted source for tested and approved recipes. Learn about our commitment to quality, taste, and culinary innovation.",
  keywords: ["about kitchen garden", "food blog story", "recipe testing", "culinary expertise", "food writing", "recipe development", "home cooking", "tested recipes", "kitchen approved"],
  openGraph: {
    title: "About Kitchen & Garden - Our Story of Culinary Excellence",
    description: "Discover the story behind Kitchen & Garden, your trusted source for tested and approved recipes.",
    type: "article",
  },
};



export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 break-words">
            About <span className="text-red-400">Kitchen & Garden</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto break-words">
            Where passion meets precision in the kitchen, creating recipes that are not just delicious, but thoroughly tested and kitchen-approved.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">Our Story</h2>
            <div className="space-y-3 md:space-y-4 text-muted-foreground">
              <p className="text-sm sm:text-base">
                Kitchen & Garden was born from a simple belief: every recipe should be tested, trusted, and truly delicious. What started as a passion project in a small home kitchen has grown into a comprehensive collection of recipes that inspire home cooks around the world.
              </p>
              <p className="text-sm sm:text-base">
                Our journey began with the frustration of finding recipes that looked beautiful but failed to deliver on taste. We knew there had to be a better way – a place where every recipe was thoroughly tested, documented, and shared with the love and attention it deserves.
              </p>
              <p className="text-sm sm:text-base">
                Today, we're proud to offer hundreds of tested recipes across every category imaginable, from quick weeknight dinners to elaborate weekend projects, from refreshing beverages to indulgent desserts.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 md:mt-0">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <ChefHat className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-red-500" />
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8">Our Mission</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 break-words">
            We believe that cooking should be accessible, enjoyable, and most importantly, delicious. Every recipe on our platform undergoes rigorous testing in real home kitchens, ensuring that when you follow our instructions, you'll achieve the same great results we did.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          <div className="text-center p-4 md:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3">Tested & Approved</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Every recipe is tested multiple times in real kitchen conditions to ensure perfect results every time.
            </p>
          </div>
          
          <div className="text-center p-4 md:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3">Time-Tested Methods</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              We focus on techniques and methods that have stood the test of time, ensuring consistent success.
            </p>
          </div>
          
          <div className="text-center p-4 md:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3">Made with Love</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Every recipe is crafted with care, attention to detail, and a genuine love for good food.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 md:mb-8">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Rigorous Testing Process</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Each recipe is tested at least 3 times with different variations to ensure reliability.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Real Kitchen Conditions</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">All recipes are tested in standard home kitchens, not professional labs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Detailed Instructions</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Step-by-step guidance with tips, variations, and troubleshooting advice.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Seasonal Ingredients</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Emphasis on fresh, seasonal produce and ingredients when available.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Dietary Inclusivity</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Options for various dietary needs including vegan, gluten-free, and low-carb.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Community Driven</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">We listen to our community and continuously improve based on feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Categories */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8">Recipe Categories</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto break-words">
            Explore our diverse collection of recipes, all tested and approved in our kitchen.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              "Breakfast & Brunch",
              "Lunches & Dinners",
              "Drinks & Beverages",
              "Baking & Desserts",
              "High Protein",
              "Vegan & Plant-Based",
              "Seafood & Fish",
              "Smoothies"
            ].map((category) => (
              <div key={category} className="bg-white border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                <span className="text-xs sm:text-sm font-medium text-gray-700 break-words">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
  <div className="text-center bg-red-50 rounded-xl md:rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Ready to Start Cooking?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto break-words">
            Join thousands of home cooks who trust Kitchen & Garden for reliable, delicious recipes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="sm" className="bg-red-500 hover:bg-red-600 text-sm sm:text-base">
              <Link href="/blog">Explore Recipes</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-sm sm:text-base">
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
