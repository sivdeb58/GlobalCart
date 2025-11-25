'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Star,
  ShieldCheck,
  Truck,
  Store,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';

const RelatedProducts = dynamic(() => import('@/components/related-products').then(m => m.RelatedProducts), {
  ssr: false,
});


function StarRating({
  rating,
  totalReviews,
  sold,
}: {
  rating: number;
  totalReviews: number;
  sold: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      <span className="text-sm text-muted-foreground">{totalReviews} Reviews</span>
      <span className="text-sm text-muted-foreground">{sold} sold</span>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { products: appProducts, addToCart } = useAppContext();
  const product = appProducts.find((p) => p.id === params.id);
  const router = useRouter();

  if (!product) {
    notFound();
  }
  

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {product.name}
              </h1>
              <div className="mt-2">
                <StarRating rating={product.rating} totalReviews={product.reviews} sold={product.sold} />
              </div>
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Buyer Protection: 75-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Free Shipping & Free Returns</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Store and Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card p-4 rounded-lg shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-muted rounded-full">
                  <Store className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="font-semibold">{product.store.name}</h3>
                  <p className="text-xs text-muted-foreground">Top Brand</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Visit Store</Button>
          </div>
        </div>

        {/* Description & Reviews */}
        <div className="lg:col-span-9">
           <RelatedProducts product={product} />
        </div>
      </div>
    </div>
  );
}
