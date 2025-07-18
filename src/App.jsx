import { Outlet } from 'react-router';
import './App.css';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import JobListings from './components/JobListing';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { user } = useUser();

  return (
    <div className="app">
      <Outlet />
      <Header />
      {
        !user ? (
          <h1 className="auth-warning">Please Signup or Signin First to View The Pages!</h1>
        ) : (
          <>
            <main>
              <Hero />
              <JobListings />
              <Features />
            </main>
            <Footer />
          </>
        )
      }
    </div>
  );
}

export default App;
