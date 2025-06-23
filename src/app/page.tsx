"use client";

import { NextPage } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LandingPageContent from '@/components/landing/LandingPageContent';

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
        <LandingPageContent />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
