import Banner from "./Banner";
import Features from "../Features/Features";
import Timeline from "../Timeline/Timeline";
import MainLayout from "../../components/Layout/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      {/* Main content with responsive spacing */}
      <div className="w-full">
        {/* Banner section with responsive height and padding */}
        <section className="relative w-full">
          <Banner />
        </section>

        {/* Features section with responsive grid */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-12 md:py-20">
          <Features />
        </section>

        {/* Timeline section with responsive layout */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-12 md:py-20 bg-gray-800">
          <Timeline />
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
