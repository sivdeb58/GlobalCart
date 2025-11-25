'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from './product-card';
import { Button } from './ui/button';

const INITIAL_LOAD_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export function MoreToLove() {
  const { products } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);

  const publishedProducts = products.filter(p => p.published);
  const visibleProducts = publishedProducts.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">More to love</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {visibleCount < publishedProducts.length && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={handleLoadMore}>Load More</Button>
          </div>
        )}
    </section>
  );
}
