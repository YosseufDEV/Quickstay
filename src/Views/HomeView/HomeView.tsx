import Hero from "./Components/Hero/Hero";
import FeaturedDestination from "./Components/FeaturedDestination/FeaturedDestination";
import ExclusiveOffers from "./Components/ExclusiveOffers/ExclusiveOffers";
import CustomersReviews from "./Components/CustomersReviews/CustomersReviews";

const HomeView = () => {
    return (
        <>
            <Hero />
            <FeaturedDestination />
            <ExclusiveOffers />
            <CustomersReviews />
        </>
    );
}

export default HomeView;
