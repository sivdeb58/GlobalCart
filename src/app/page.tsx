'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { slugify } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useAppContext } from '@/context/AppContext';

const MoreToLove = dynamic(() => import('@/components/more-to-love').then(m => m.MoreToLove), {
  ssr: false,
  loading: () => <div className='text-center mt-8'><Button variant="outline">Loading More...</Button></div>,
});


function CategoryCard({ category }: { category: (typeof categories)[0] }) {
  const image = PlaceHolderImages.find(
    (img) => img.id === slugify(category.name)
  );
  return (
    <Link href={`/category/${slugify(category.name)}`} className="group block">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className="p-4">
              <h3 className="font-semibold leading-tight group-hover:text-primary">{category.name}</h3>
            </div>
            <div className="ml-auto w-24 h-24 relative flex-shrink-0">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function Home() {
  const { banner, products } = useAppContext();
  const worryFreeImage = PlaceHolderImages.find((img) => img.id === 'knife-set');
  const todaysDeals = products.filter(p => p.published).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

            <div className="bg-pink-600 text-white p-6 rounded-xl overflow-hidden relative">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-xs">Sale Ends: Dec 4, 13:29 (GMT+5.5)</p>
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                      {banner.title}
                      <ChevronRight className="w-8 h-8"/>
                      </h2>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white/90 text-pink-600 p-3 rounded-lg text-center flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-lg">Rs.184.37 OFF</p>
                        <p className="text-xs text-gray-500">orders Rs.921.84+</p>
                      </div>
                      <p className="font-semibold text-sm mt-2">Code:BF1002</p>
                  </div>
                  <div className="bg-white/90 text-pink-600 p-3 rounded-lg text-center flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-lg">Rs.6,452.9 OFF</p>
                        <p className="text-xs text-gray-500">orders Rs.45,999.97+</p>
                      </div>
                      <p className="font-semibold text-sm mt-2">Code:BF4997</p>
                  </div>
                  <div className="bg-white/90 text-pink-600 p-3 rounded-lg text-center flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-lg">Rs.4,609.22 OFF</p>
                        <p className="text-xs text-gray-500">orders Rs.30,328.63+</p>
                      </div>
                      <p className="font-semibold text-sm mt-2">Code:BF3295</p>
                  </div>
                </div>
                <div className="bg-blue-200 text-black p-3 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">Shop brands worry-free</p>
                    <p className="text-xl font-bold mt-2">Rs.977.15</p>
                  </div>
                  {worryFreeImage && (
                    <div className="relative w-24 h-16">
                      <Image src={worryFreeImage.imageUrl} alt="Worry-free shopping" layout="fill" objectFit="contain" />
                    </div>
                  )}
                </div>
              </div>
              {banner.imageUrl && 
                  <div className='absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block'>
                      <Image src={banner.imageUrl} alt="Homepage banner" layout="fill" objectFit="contain" className='rounded-md' priority />
                  </div>
              }
            </div>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Today's deals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {todaysDeals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Shop by category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.slice(0, 6).map((category) => (
                  <CategoryCard key={category.name} category={category} />
                ))}
              </div>
            </section>


            <MoreToLove />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
