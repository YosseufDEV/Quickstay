import CustomerReviewCard from "../CustomerReviewCard/CustomerReviewCard";

const CustomersReviews = () => {
    const reviews = [
        {
            id: 1,
            name: "John Doe",
            pfpSrc: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id: 2,
            name: "Jane Doe",
            pfpSrc: "https://randomuser.me/api/portraits/men/5.jpg",
            rating: 4,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id: 3,
            name: "Bob Smith",
            pfpSrc: "https://randomuser.me/api/portraits/men/2.jpg",
            rating: 3,
            review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ];

    const reviewCards = reviews.map((review) => <CustomerReviewCard key={review.id} { ...review } />);

    return (
        <div className="bg-[#f8fafc] font-[Outfit] w-full flex flex-col items-center gap-25 py-30 pt-20 px-50">
            <div className="w-full flex flex-col justify-between items-center">
                <p className="section-title">What Our Guests Say</p>
                <p className="section-description text-center">Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious<br/> accommodations around the world.</p>
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-6">
                {reviewCards}
            </div>
        </div>
    )
}

export default CustomersReviews;
