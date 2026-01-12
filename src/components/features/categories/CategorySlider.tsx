import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { getCategoryThumbnail } from '@/utils/cloudinary';
import type { Category } from '@/types/category';

export function CategorySlider() {
  const { data, isLoading, error } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8'>Shop by Category</h2>
          <div className='flex gap-4 overflow-hidden'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='shrink-0 w-48 h-48 bg-muted animate-pulse rounded-lg'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <p className='text-destructive'>Failed to load categories</p>
        </div>
      </div>
    );
  }

  const categories = data?.data || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold mb-8'>Shop by Category</h2>

        <div className='relative'>
          <Button
            variant='outline'
            size='icon'
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full w-12 h-12 bg-background shadow-lg hover:shadow-xl transition-all'
            onClick={() => scroll('left')}
            aria-label='Previous categories'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category: Category) => (
              <CategoryCard key={category.Id} category={category} />
            ))}
          </div>

          <Button
            variant='outline'
            size='icon'
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full w-12 h-12 bg-background shadow-lg hover:shadow-xl transition-all'
            onClick={() => scroll('right')}
            aria-label='Next categories'
          >
            <ChevronRight className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const imageUrl = getCategoryThumbnail(category.ImageUrl);

  return (
    <div className='shrink-0 w-48 cursor-pointer group/card'>
      <div className='relative overflow-hidden rounded-lg aspect-square bg-muted'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.Name}
            className='w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5'>
            <span className='text-4xl font-bold text-primary/40'>
              {category.Name.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity' />
      </div>

      <div className='mt-3 text-center'>
        <h3 className='font-semibold text-lg group-hover/card:text-primary transition-colors'>
          {category.Name}
        </h3>
      </div>
    </div>
  );
}
