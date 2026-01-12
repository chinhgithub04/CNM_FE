import { CategorySlider } from '@/components/features/categories/CategorySlider';
import { ProductGrid } from '@/components/features/products/ProductGrid';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl'>
              Welcome to Merxly
            </h1>
            <p className='max-w-175 text-lg text-muted-foreground sm:text-xl'>
              Discover amazing crowdfunding campaigns and exclusive products.
              Join our community and be part of something special.
            </p>
          </div>
        </div>
      </div>

      {/* Category Slider */}
      <CategorySlider />

      {/* Product Grid */}
      <ProductGrid />
    </div>
  );
}
