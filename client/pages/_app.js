import { usePathname } from 'next/navigation';
import '../styles/globals.css';
import buildClient from './api/build-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const disabledNavbarAndFooter = ['/auth/signin', '/auth/signup'];

export default function App({ Component, pageProps, currentUser, cartItemCount }) {
  const pathname = usePathname();

  const shouldShowNavbarAndFooter = !disabledNavbarAndFooter.includes(pathname) && !pathname.startsWith('/dashboard');
  
  return (
    <>
      {disabledNavbarAndFooter.includes(pathname) ? null : <Navbar currentUser={currentUser} cartItemCount={cartItemCount} />}
      <Component currentUser={currentUser} {...pageProps} />
      {disabledNavbarAndFooter.includes(pathname) ? null : <Footer />}
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const { data: currentUser } = await buildClient(appContext.ctx.req).get('/api/v1/auth/currentuser');

  if (currentUser.data !== null) {
    const { data: cartItemCount } = await buildClient(appContext.ctx.req).get('/api/v1/carts/count');
    return {
      currentUser: currentUser.data,
      cartItemCount: cartItemCount.data,
    };
  }

  return {
    currentUser: currentUser.data,
    cartItemCount: null
  }
}
