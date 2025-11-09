import CookieConsent from "@/components/CookieConsent";
import SkipToContent from "@/components/SkipToContent";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import StatsSection from "@/components/StatsSection";
import { Button } from "@/components/ui/button";

export default function Home() {
  const categories = [
    {
      title: "BREAKFAST & BRUNCH",
      subtitle: "Morning Delights",
      description: "Start your day with delicious breakfast recipes and brunch favorites.",
      image: "/breakfast-brunch.jpg",
    },
    {
      title: "DRINKS & BEVERAGES",
      subtitle: "Refreshing Sips",
      description: "From cocktails to smoothies, discover refreshing drink recipes.",
      image: "/drinks-beverages.jpg",
    },
    {
      title: "LUNCHES & DINNERS",
      subtitle: "Hearty Meals",
      description: "Satisfying lunch and dinner recipes for the whole family.",
      image: "/lunches-dinners.jpg",
    },
  ];

  const featuredCategories = [
    {
      title: "High Protein Diet",
      subtitle: "Build Strength",
      description: "Fuel your body with delicious, protein-packed recipes. Build strength, and stay energized.",
      image: "/high-protein.jpg",
    },
    {
      title: "Vegan & Plant-Based",
      subtitle: "Plant-Based Diet",
      description: "Discover vibrant, flavor-filled plant-based dishes for a healthier, more sustainable lifestyle.",
      image: "/vegan-plant-based.jpg",
    },
    {
      title: "Alcoholic Drinks",
      subtitle: "Craft Cocktails",
      description: "Cocktail recipes and classic mixed drinks. Refresh your evenings with creative blends & bartender tips.",
      image: "/alcoholic-drinks.jpg",
    },
    {
      title: "Baking & Desserts",
      subtitle: "Sweet Treats",
      description: "Satisfy your sweet tooth with our dessert recipes. Decadent cakes, fruity treats, and pleasing sips, etc.",
      image: "/baking-desserts.jpg",
    },
    {
      title: "Smoothies",
      subtitle: "Energy Boost",
      description: "Start your day energized with a smoothie! Find recipes with fresh fruits, creamy yogurt, and nutritious add-ins.",
      image: "/smoothies.jpg",
    },
    {
      title: "Seafood & Fish",
      subtitle: "Coastal Flavors",
      description: "Explore savory seafood dishes and easy fish recipes packed with coastal flavor, high protein, and essential aminos.",
      image: "/seafood-fish.jpg",
    },
   
    {
      title: "Non-Alcoholic",
      subtitle: "Refreshing Beverages",
      description: "Discover and sip on delightful no alcohol beverages, from zesty spritzers to comforting teas and coffees.",
      image: "/non-alcoholic.jpg",
    },
    {
      title: "Mocktails",
      subtitle: "Zero Proof Fun",
      description: "Enjoy refreshing, creative non-alcoholic drinks that bring all the flavor and fun of cocktails without the alcohol.",
      image: "/mocktails.jpg",
    },
  ];

  return (
    <div>
      <SkipToContent />
      <Hero />
      
      <div id="main-content">
        {/* Popular Categories Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Explore Our Most Popular Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                subtitle={category.subtitle}
                description={category.description}
                image={category.image}
              />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="text-sm md:text-base">
              See All Recipes
            </Button>
          </div>
        </section>

        <StatsSection />

        {/* Featured Categories Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Explore Our Featured Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredCategories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                subtitle={category.subtitle}
                description={category.description}
                image={category.image}
              />
            ))}
          </div>
        </section>
      </div>
      
      <CookieConsent />
    </div>
  );
}
