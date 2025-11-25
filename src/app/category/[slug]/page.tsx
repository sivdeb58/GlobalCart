'use client'

import { categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { slugify } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppContext } from '@/context/AppContext';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { products } = useAppContext();

  const specialCategories: { [key: string]: string } = {
    superdeals: 'SuperDeals',
    'home-improvement-lighting': 'Home Improvement & Lighting',
    'tools-industrial': 'Tools & Industrial',
  };

  let categoryName = specialCategories[params.slug];
  let category = categoryName ? { name: categoryName } : categories.find((c) => slugify(c.name) === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => {
    if (!p.published) return false;
    if (category?.name === 'SuperDeals') {
      return p.originalPrice;
    }
    return p.category === category?.name;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
