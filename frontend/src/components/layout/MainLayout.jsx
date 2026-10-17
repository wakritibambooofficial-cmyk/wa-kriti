import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import SupportWidget from './SupportWidget'; 
import CompareBar from '../product/CompareBar';
import AnnouncementPopup from '../AnnouncementPopup';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
       <AnnouncementPopup />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <CompareBar />
      <SupportWidget />
    </div>
  );
};

export default MainLayout;
