import { useLayoutEffect, useRef, useState } from "react";
import SelectBoxItem from "./SelectBoxItem";
import Chevron from "@/assets/chevron-down.svg?react";
import CloseIcon from "@/assets/closeIcon.svg?react";
import SearchIcon from "@/assets/searchIcon.svg?react";

interface SelectBoxProps {
    text?: string,
    placeholder?: string,
    title?: string,
    items: string[],
}

const SelectBox = (props: SelectBoxProps) => {

    const [visible, setVisible] = useState(true);
    const [value, setValue] = useState(props.items[0]);
    const [height, setHeight] = useState(0);
    const [ result, setResult ] = useState(props.items);

    const selectMenuRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: any) => {
        const value = e.target.value;
        const filteredResults = props.items.filter((item) => item.toLowerCase().startsWith(value.toLowerCase()));
        setResult(filteredResults);
    }


    useLayoutEffect(() => {
        if(selectMenuRef.current) {
            const selectMenuHeight = selectMenuRef.current.offsetHeight;
            setHeight(selectMenuHeight);
        }
    })

    window.addEventListener("click", (e) => {
        if(e.target instanceof HTMLInputElement) return;
        setVisible(false);
    })

    return (
        <div className="cursor-pointer font-[Inter]! text-black relative">
            { visible &&
                <div ref={selectMenuRef} className="min-w-90 overflow-hidden absolute shadow-lg rounded-xl bg-white z-50" style={ { top: `-${height-30}px` } }>
                    <div className="h-full p-3 grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                        <h1 className="font-semibold text-[14px] w-full text-gray-700">{props.title}</h1>
                        <div className="p-2 hover:bg-gray-100 w-fit opacity-85 rounded-md transition-all">
                            <CloseIcon className="w-3 h-3 stroke-gray-500! stroke-2!"/>
                        </div>
                        <div className="relative flex items-center w-full col-span-2">
                            <input onInput={handleSearch} placeholder="Search" className="pl-7 bg-white text-sm relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-1 mb-0!" />
                            <SearchIcon  className="w-7 h-7 stroke-gray-500 absolute top-auto z-50" />
                        </div>
                    </div>
                    <hr className="border-gray-200"/>
                    <div className="max-h-[30vh] p-2 overflow-y-scroll font-medium flex flex-col ">
                        { result.map((item) => <SelectBoxItem onClick={ (_) => setValue(item) }value={item} label={item} />) }
                        { result.length === 0 &&
                            <div className="py-3 flex items-center justify-center h-full">
                                <p className="text-gray-500 text-[14px]">No results found</p>
                            </div>
                        }
                    </div>
                </div>
            }
            <div className="h-fit my-1">
                { props.text &&
                    <p className="mb-3 text-[14px] font-medium text-gray-700">{props.text}</p>
                }
                <div onClick={(_) => setVisible(true)} className="relative flex items-center">
                    <input readOnly value={value} className="bg-white user-select-none! text-sm cursor-pointer caret-transparent relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!" placeholder={props.text} />
                    <Chevron className="w-4 h-4 absolute font-black mr-5 top-auto right-0 z-51 fill-gray-800 stroke-gray-800 stroke-[0.5px]" />
                </div>
            </div>
        </div>
    );
}


export default SelectBox;
