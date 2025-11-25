'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import {
  X,
  ShieldCheck,
  Heart,
  MessageSquareWarning,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

interface ProductPreviewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductPreview({
  product,
  open,
  onOpenChange,
}: ProductPreviewProps) {
  const { addToCart } = useAppContext();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const colorOptions = PlaceHolderImages.slice(0, 5); // Placeholder for color variants
  const [selectedImageUrl, setSelectedImageUrl] = useState(product.imageUrl);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenChange(false);
  };

  const handleViewDetails = () => {
    router.push(`/product/${product.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="p-6">
            <div className="relative aspect-square mb-4">
              {selectedImageUrl && (
                <Image
                  src={selectedImageUrl}
                  alt={product.name}
                  fill
                  className="object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex gap-2 justify-center">
              {[product.imageUrl, ...colorOptions.map(c => c.imageUrl)].filter(Boolean).slice(0, 5).map((imageUrl, index) =>
                imageUrl ? (
                  <div
                    key={index}
                    className={`relative aspect-square w-16 border rounded-md cursor-pointer ${
                      selectedImageUrl === imageUrl ? 'border-primary' : ''
                    }`}
                    onMouseEnter={() => setSelectedImageUrl(imageUrl)}
                  >
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 pt-12 relative flex flex-col bg-muted/50">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className='flex-grow'>
                <h2 className="text-lg font-semibold leading-snug">
                {product.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                {product.sold} sold
                </p>
                <p className="text-3xl font-bold text-red-600 mt-4">
                {formatPrice(product.price)}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                <p>
                    <span className="text-red-500 font-semibold">Wholesale</span> 3+
                    pieces, extra 5% off
                </p>
                <p>Tax excluded, add at checkout if applicable</p>
                </div>

                <div className="mt-4">
                <p className="text-sm font-medium mb-2">Color: Purple</p>
                <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((image) => (
                    <div
                        key={image.id}
                        className={`relative w-10 h-10 border rounded-md cursor-pointer ${
                        selectedImageUrl === image.imageUrl ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedImageUrl(image.imageUrl)}
                    >
                        <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover rounded-sm"
                        />
                    </div>
                    ))}
                </div>
                </div>

                <Separator className="my-4" />

                <div className="text-xs space-y-2">
                <p>
                    <span className="font-semibold">Sold by</span>{' '}
                    <span className="text-primary">{product.store.name}</span>
                </p>
                <div>
                    <p className="font-semibold">Service commitment</p>
                    <p className="text-muted-foreground flex items-start gap-1">
                    <MessageSquareWarning className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                    This product can't be shipped to your address. Select another
                    product or address.
                    </p>
                </div>
                <p className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Return&refund policy
                </p>
                <p className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Security & Privacy
                </p>
                </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Quantity</p>
                <div className="flex items-center border rounded-md bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 h-8 text-center border-0 bg-transparent focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">195 available</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="lg" variant="outline" onClick={handleViewDetails}>
                    View details
                  </Button>
                   <Button size="lg" variant="outline">
                    <Heart className="w-5 h-5 mr-2" /> 36
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
