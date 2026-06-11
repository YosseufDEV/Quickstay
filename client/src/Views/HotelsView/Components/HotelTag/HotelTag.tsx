interface HotelTagProps {
    text: string;
    Icon: any;
    iconClass?: string;
}

const HotelTag = (props: HotelTagProps) => {
    return (
        <div className="text-sm py-2 px-2 items-center justify-center bg-[#f8f8ff] text-black flex gap-2 rounded-lg">
            {/* <props.Icon className={ `[&_path]:fill-black w-[1.5em] h-[1.5em] ${props.iconClass}` }/> */}
            <p className="font-[Inter] w-full">{props.text}</p>
        </div>
    )
}

export default HotelTag;
