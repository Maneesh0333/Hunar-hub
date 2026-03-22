import Categories from "../components/Categories";
import FeaturedArtisans from "../components/FeaturedArtisans";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import NavBar from "../components/NavBar";
import Testimonials from "../components/Testimonials";

function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedArtisans />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;
