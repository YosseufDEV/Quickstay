interface SelectBoxItemProps {
    value: string;
    label: string;
    onClick: (e: any) => void;
}

const SelectBoxItem = (props: SelectBoxItemProps) => {
    return (
        <div onClick={props.onClick} className="hover:bg-gray-100 active:bg-gray-200 min-w-80 pl-5 px-3 py-2 rounded-lg cursor-pointer select-none">
            <p className="text-gray-700 text-[15px]">{props.label}</p>
        </div>
    )
}

export default SelectBoxItem;
