import { lazy, Suspense } from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Spinner from "../components/Shared/Spinner";
import AboutUs from "../components/User/AboutUs";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import SEO from "../components/Shared/SEO";

const Categories = lazy(() => import("../components/Categories"));
const FeaturedArtisans = lazy(() => import("../components/FeaturedArtisans"));

function Home() {
  return (
    <>
      <SEO
        title="HunarHub | Find Trusted Local Professionals."
        description="Find and book trusted electricians, plumbers, carpenters, painters, and other skilled professionals near you through HunarHub."
        url="https://hunar-hub-web.vercel.app/home"
      />
      <NavBar />
      <Hero />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-96">
            <Spinner />
          </div>
        }
      >
        <Categories />
      </Suspense>

      <HowItWorks />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-96">
            <Spinner />
          </div>
        }
      >
        <FeaturedArtisans />
      </Suspense>

      <Testimonials />
      <AboutUs />

      <Footer />
    </>
  );
}

export default Home;
