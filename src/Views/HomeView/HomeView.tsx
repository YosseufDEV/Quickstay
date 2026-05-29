import Hero from "./Components/Hero/Hero";
import FeaturedDestination from "./Components/FeaturedDestination/FeaturedDestination";

const HomeView = () => {
    return (
        <div className="overflow-hidden">
            <Hero />
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <FeaturedDestination />
            </div>
        </div>
    );
}

export default HomeView;
