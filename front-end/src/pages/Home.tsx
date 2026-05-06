import { lazy, Suspense } from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Spinner from "../components/Shared/Spinner";

const Categories = lazy(() => import("../components/Categories"));
const HowItWorks = lazy(() => import("../components/HowItWorks"));
const FeaturedArtisans = lazy(() => import("../components/FeaturedArtisans"));
const Testimonials = lazy(() => import("../components/Testimonials"));

function Home() {
  return (
    <>
      <NavBar />
      <Hero />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-60">
            <Spinner />
          </div>
        }
      >
        <Categories />
        <HowItWorks />
        <FeaturedArtisans />
        <Testimonials />
      </Suspense>

      <Footer />
    </>
  );
}

export default Home;
