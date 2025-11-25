import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function SellerDashboard() {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your Seller Dashboard</CardTitle>
            <CardDescription>
              Here you can manage your products, view orders, and track your sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use the navigation on the left to get started.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  