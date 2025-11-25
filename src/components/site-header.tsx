'use client';

import Link from 'next/link';
import {
  Mountain,
  Search,
  ShoppingCart,
  User,
  Menu,
  Package,
  CircleDollarSign,
  MessageSquare,
  CreditCard,
  Heart,
  Ticket,
  Settings,
  Briefcase,
  LogIn,
  HelpCircle,
  ShieldAlert,
  FileText,
  Gavel,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { categories } from '@/lib/data';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn, slugify } from '@/lib/utils';
import React from 'react';
import { countries, Country } from '@/lib/countries';
import { languages, Language } from '@/lib/languages';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAppContext } from '@/context/AppContext';

const subCategories: { [key: string]: { title: string; items: string[] }[] } = {
  "Women's Fashion": [
    { title: 'Dresses', items: ['Casual', 'Formal', 'Party'] },
    { title: 'Tops', items: ['Blouses', 'T-shirts', 'Tank Tops'] },
    { title: 'Bottoms', items: ['Pants', 'Skirts', 'Shorts'] },
  ],
  "Men's Fashion": [
    { title: 'Tops', items: ['Shirts', 'T-shirts', 'Polos'] },
    { title: 'Bottoms', items: ['Pants', 'Jeans', 'Shorts'] },
    { title: 'Outerwear', items: ['Jackets', 'Coats', 'Vests'] },
  ],
  'Electronics': [
    {
      title: 'Kitchen Fixtures',
      items: [
        'Water Filtration',
        'Kitchen Cabinet Storage',
        'Kitchen Faucets',
        'Kitchen Hardware',
      ],
    },
    {
      title: 'Electrical Equipment & Supplies',
      items: ['Solar Panels', 'Solar Inverters', 'Smart Switches'],
    },
  ],
  'Home & Garden': [
    { title: 'Home Decor', items: ['Vases', 'Candles', 'Rugs'] },
    { title: 'Gardening', items: ['Seeds', 'Tools', 'Pots'] },
  ],
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

function ShipToDropdown() {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(countries[1]); // Default to India
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(languages[0]);

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto px-2">
            <span className="text-2xl">{selectedCountry.flag}</span>
            <div className='text-left'>
                <span className='text-xs text-muted-foreground'>{selectedLanguage.code.toUpperCase()} / {selectedCountry.currency}</span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ship-to" className='font-semibold text-base'>Ship to</Label>
             <Select defaultValue={selectedCountry.code} onValueChange={(code) => setSelectedCountry(countries.find(c => c.code === code)!)}>
                <SelectTrigger id="ship-to" className="mt-2">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className='text-xl'>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-64">
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                         <div className="flex items-center gap-2">
                            <span className='text-xl'>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="language" className='font-semibold text-base'>Language</Label>
             <Select defaultValue={selectedLanguage.code} onValueChange={(code) => setSelectedLanguage(languages.find(l => l.code === code)!)}>
                <SelectTrigger id="language" className="mt-2">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                   {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                         {lang.name}
                      </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="currency" className='font-semibold text-base'>Currency</Label>
             <Select defaultValue={selectedCountry.currency}>
                <SelectTrigger id="currency" className="mt-2">
                    <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={selectedCountry.currency}>
                      {selectedCountry.currency}
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Save</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { user, isUserLoading, signOut: handleSignOut } = useAppContext();
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G';
    return email.charAt(0).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-primary">
                GlobalCart
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center px-8">
            <div className="relative w-full max-w-2xl">
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-full border-2 border-primary/50 focus:border-primary focus:ring-primary pl-4 pr-12 h-10"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 rounded-r-full rounded-l-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 md:space-x-4">
             <ShipToDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-col h-auto">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {isUserLoading ? (
                  <DropdownMenuLabel>Loading...</DropdownMenuLabel>
                ) : user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3 p-2">
                         <Avatar>
                          <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                           <p className="text-sm font-medium leading-none">Welcome back</p>
                           <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                       <DropdownMenuItem asChild>
                        <Link href="#" className='bg-accent/50 text-primary font-semibold'>
                          <Package />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#">
                          <CircleDollarSign />
                          <span>My Coins</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <MessageSquare />
                          <span>Message Center</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <CreditCard />
                          <span>Payment</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Heart />
                          <span>Wish List</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Ticket />
                          <span>My Coupons</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem asChild><Link href="#"><Settings /><span>Settings</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><Briefcase /><span>GlobalCart Business</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/seller/signin"><LogIn /><span>Seller Log In</span></Link></DropdownMenuItem>
                     </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem asChild><Link href="#"><FileText /><span>Return & refund policy</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><HelpCircle /><span>Help Center</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><ShieldAlert /><span>Disputes & Reports</span></Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="#"><Gavel /><span>Report IPR infringement</span></Link></DropdownMenuItem>
                     </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                     <DropdownMenuLabel className='p-4 text-center'>
                       <p>Welcome to GlobalCart</p>
                       <div className='flex gap-2 mt-2'>
                          <Button asChild className='flex-1'><Link href="/signup">Register</Link></Button>
                          <Button asChild variant="outline" className='flex-1'><Link href="/signin">Sign In</Link></Button>
                       </div>
                     </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Package />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#">
                          <MessageSquare />
                          <span>Message Center</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Heart />
                          <span>Wish List</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="#">
                          <Ticket />
                          <span>My Coupons</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" asChild className="flex-col h-auto">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">Cart</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <nav className="hidden md:block border-t bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 text-sm h-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="p-0 pr-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <div className="flex items-center gap-1 hover:text-primary">
                      <Menu className="w-4 h-4" /> All Categories
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-[200px_1fr] w-[800px] p-4">
                      <ul className="flex flex-col gap-1 pr-4 border-r">
                        {categories.map((category) => (
                          <li key={category.name} className="p-2 hover:bg-accent rounded-md cursor-pointer text-sm">
                            <Link href={`/category/${slugify(category.name)}`} className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="pl-4">
                        <h3 className="font-bold mb-2">Recommended</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="w-16 h-16 bg-muted mx-auto rounded-md mb-1"></div>
                            <span className="text-xs">Wind Generators</span>
                          </div>
                          <div>
                            <div className="w-16 h-16 bg-muted mx-auto rounded-md mb-1"></div>
                            <span className="text-xs">Kitchen Cabinet</span>
                          </div>
                          <div>
                            <div className="w-16 h-16 bg-muted mx-auto rounded-md mb-1"></div>
                            <span className="text-xs">Light Bulbs</span>
                          </div>
                          <div>
                            <div className="w-16 h-16 bg-muted mx-auto rounded-md mb-1"></div>
                            <span className="text-xs">Wall Panels</span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {subCategories['Electronics']?.map((sub) => (
                              <div key={sub.title}>
                                <h4 className="font-semibold mb-2 text-sm">{sub.title}</h4>
                                <ul className="space-y-1">
                                  {sub.items.map((item) => (
                                    <li key={item}><Link href="#" className="text-xs text-muted-foreground hover:text-primary">{item}</Link></li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/category/superdeals" className="hover:text-primary">
              SuperDeals
            </Link>
            <Link href="/ownshopplus" className="hover:text-primary">
              OwnShop Plus
            </Link>
            <Link href="/category/home-improvement-lighting" className="hover:text-primary">
              Home Improvement & Lighting
            </Link>
            <Link href="/category/tools-industrial" className="hover:text-primary">
              Tools & Industrial
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
