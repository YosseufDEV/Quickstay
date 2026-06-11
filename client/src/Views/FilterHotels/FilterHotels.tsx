interface FilterSectionProps {
    title: string;
    options: string[];
    optionsType: "checkbox" | "radio";
}

const FilterSection = (props: FilterSectionProps) => {
    return (
        <div className="w-full">
                <p className="text-lg font-[Outfit]">{props.title}</p>
                <div className="flex flex-col gap-2 mt-2">
                    { props.options.map((option, index) => <label key={index} className="flex items-center gap-2">{option}</label>) }
                </div>
        </div>
    )
}

const FilterHotels = () => {
    return (
        <div className="bg-white px-5 py-3 border border-gray-300 flex flex-col items-start gap-10">
            <p className="text-2xl font-Inter">Filter Hotels</p>
            <FilterSection title="Room Type" options={[ "Single Bed", "Double Bed", "Luxury Room", "Family Suite" ]} optionsType="radio" />
            <FilterSection title="Price Range" options={["$0 to 500", "$ 500 to 1000", "$ 1000 to 2000", "$ 2000 to 3000"]} optionsType="radio" />
            <FilterSection title="Sort By" options={[ "Price Low to High", "Price High to Low", "Newest First" ]} optionsType="radio" />
        </div>
    )
}

export default FilterHotels;
