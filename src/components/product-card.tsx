'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const ProductPreview = dynamic(() => import('./product-preview').then(m => m.ProductPreview), {
  ssr: false,
});

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();
  const { addToCart } = useAppContext();


  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  }

  const handleSimilarItemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/category/${product.category}`);
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <>
      <Link href={`/product/${product.id}`} className="group block">
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl">
          <CardContent className="p-0 flex-grow flex flex-col">
            <div className="aspect-square relative w-full">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              )}
              <Button size="icon" className="absolute bottom-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-primary" onClick={handleAddToCartClick}>
                <ShoppingCart className="w-4 h-4"/>
              </Button>
            </div>
            <div className="p-2 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-gray-700 leading-tight line-clamp-2 mb-2 group-hover:hidden">
                  {product.name}
                </h3>
                <div className='group-hover:hidden'>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  {product.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>{product.sold} sold</span>
                  </div>
                </div>
              </div>
              <div className="hidden group-hover:flex flex-col justify-end h-full">
                 <h3 className="text-sm text-gray-700 leading-tight line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>{product.sold} sold</span>
                  </div>
                <div className="space-y-2">
                  <Button size="sm" className="w-full h-8" onClick={handlePreviewClick}>See preview</Button>
                  <Button size="sm" variant="outline" className="w-full h-8" onClick={handleSimilarItemsClick}>Similar items</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      {isPreviewOpen && (
        <ProductPreview
          product={product}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </>
  );
}
