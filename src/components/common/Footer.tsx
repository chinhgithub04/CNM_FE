import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className='w-full border-t bg-background'>
      <div className='container mx-auto py-12 px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <span className='text-xl font-bold text-primary'>Merxly</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              Your trusted marketplace for crowdfunding campaigns and exclusive
              products.
            </p>
            <div className='flex space-x-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Instagram className='h-5 w-5' />
              </a>
              <a
                href='mailto:contact@merxly.com'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Mail className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Shop</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/campaigns'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Active Campaigns
                </Link>
              </li>
              <li>
                <Link
                  to='/products'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to='/featured'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  to='/deals'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Best Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Support</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/help'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to='/shipping'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to='/returns'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/about'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/careers'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to='/privacy'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className='my-8' />

        <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
          <p className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Merxly. All rights reserved.
          </p>
          <div className='flex space-x-4 text-sm text-muted-foreground'>
            <Link
              to='/privacy'
              className='hover:text-foreground transition-colors'
            >
              Privacy
            </Link>
            <Link
              to='/terms'
              className='hover:text-foreground transition-colors'
            >
              Terms
            </Link>
            <Link
              to='/cookies'
              className='hover:text-foreground transition-colors'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
