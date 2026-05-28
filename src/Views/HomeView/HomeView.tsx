import Hero from "./Components/Hero/Hero";

const HomeView = () => {
    return (
        <div className="w-full h-full absolute inset-0">
            <Hero />
            <div className="w-full h-full px-32 py-6 flex flex-col items-center justify-center gap-4">
            </div>
        </div>
    );
}

export default HomeView;
