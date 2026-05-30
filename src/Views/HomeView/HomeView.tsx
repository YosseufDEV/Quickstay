import Hero from "./Components/Hero/Hero";
import FeaturedDestination from "./Components/FeaturedDestination/FeaturedDestination";
import ExclusiveOffers from "./Components/ExclusiveOffers/ExclusiveOffers";
import CustomersReviews from "./Components/CustomersReviews/CustomersReviews";
import Newsletter from "./Components/Newsletter/Newsletter";

const HomeView = () => {
    return (
        <>
            <Hero />
            <FeaturedDestination />
            <ExclusiveOffers />
            <CustomersReviews />
            <Newsletter />
        </>
    );
}

export default HomeView;
