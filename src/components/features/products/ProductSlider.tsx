import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

interface ProductSliderProps {
  images: ProductImage[];
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  getImageUrl: (url: string | null) => string | null;
}

export function ProductSlider({
  images,
  selectedImageIndex,
  onImageSelect,
  getImageUrl,
}: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 120;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='icon'
        className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full w-10 h-10 bg-background shadow-lg hover:shadow-xl transition-all'
        onClick={() => scroll('left')}
        aria-label='Ảnh trước'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {/* Images Container */}
      <div
        ref={scrollContainerRef}
        className='flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image.Url);
          return (
            <button
              key={image.Id}
              onClick={() => onImageSelect(index)}
              className={cn(
                'shrink-0 w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-all',
                selectedImageIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={image.Description || `Ảnh ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-muted flex items-center justify-center'>
                  <span className='text-muted-foreground text-xs'>
                    {index + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full w-10 h-10 bg-background shadow-lg hover:shadow-xl transition-all'
        onClick={() => scroll('right')}
        aria-label='Ảnh tiếp theo'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
