import Hero from "../components/component/Hero/Hero";
import Shop from "../components/component/Shop/ShopNewLight";
import Ad from "../components/component/Ad/Ad";
import ImageSlider from "../components/component/ImageSlider/ImageSlider";
import VideoCard from "../components/component/VideoCard/VideoCard";
import GalleryCard from "../components/component/GalleryCard/GalleryCard";
import QnA from "../components/component/QnA/QnA";
import SEO from "../components/SEO/SEO";

const Home = () => {
  return (
    <div>
      <SEO 
        title="Flytium Drones - Future of Flight" 
        description="Welcome to Flytium Drones. We build the future of flight with premium DIY kits, custom drone solutions, and professional training." 
      />
      <Hero />
      <GalleryCard />

      {/* <Shop /> */}

      <Ad />

      <ImageSlider />


      <VideoCard />


      <QnA />
    </div>
  );
};

export default Home;
