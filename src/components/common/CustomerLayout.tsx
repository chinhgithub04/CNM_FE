import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function CustomerLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
