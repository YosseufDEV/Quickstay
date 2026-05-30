const GenericButton = ({ text }: { text: string }) => {
    return (
        <button className="bg-white font-medium generic-button px-3 py-2.5 text-[14px] rounded-md outline-1 outline-[#D9D9D9] items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
            {text}
        </button>
    )
}

export default GenericButton;

