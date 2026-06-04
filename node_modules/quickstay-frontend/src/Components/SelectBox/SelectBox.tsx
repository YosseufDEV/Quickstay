import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import SelectBoxItem from "./SelectBoxItem";
import Chevron from "@/assets/chevron-down.svg?react";
import CloseIcon from "@/assets/closeIcon.svg?react";
import SearchIcon from "@/assets/searchIcon.svg?react";
import Input from "../Input/Input";


interface SelectBoxProps {
    label?: string,
    placeholder?: string,
    reactFormChange?: any,
    value?: string,
    title?: string,
    items: string[],
}

// TODO: Implement keyboard navigation for this component
const SelectBox = (props: SelectBoxProps) => {

    const [visible, setVisible] = useState(false);
    const [height, setHeight] = useState(0);
    const [ result, setResult ] = useState<string[]>(props.items);

    const selectMenuRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const handleSearch = (e: any) => {
        const value = (e.target.value).toLowerCase().trim();
        const filteredResults = props.items.filter((item) => item.toLowerCase().trim().includes(value));
        setResult(value=="" ? props.items : filteredResults);
    }

    const handleSelect = (item: string) => {
        props.reactFormChange(item);
        setVisible(false);
    }

    useEffect(() => {
        setResult(props.items);
    }, [visible])

    useLayoutEffect(() => {
        if(selectMenuRef.current) {
            setHeight(selectMenuRef.current.offsetHeight);
        }
    })

    window.addEventListener("click", (e) => {
        if(e.target instanceof HTMLInputElement) return;
        setVisible(false);
    })

    return (
        <div className="cursor-pointer font-[Inter]! text-black relative">
            { visible &&
                <div ref={selectMenuRef} className="min-w-90 overflow-hidden absolute shadow-lg rounded-xl bg-white z-200" style={ { top: `-${height-20}px` } }>
                    <div className="h-full p-3 grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                        <h1 className="font-semibold text-[14px] w-full text-gray-700">{props.title}</h1>
                        <div className="p-2 hover:bg-gray-100 w-fit opacity-85 rounded-md transition-all">
                            <CloseIcon className="w-3 h-3 stroke-gray-500! stroke-2!"/>
                        </div>
                        <div className="relative flex items-center w-full col-span-2">
                            <input autoFocus onChange={handleSearch} placeholder="Search" className="pl-7 bg-white text-sm relative w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-1 mb-0!" />
                            <SearchIcon className="w-7 h-7 stroke-gray-500 absolute top-auto z-50" />
                        </div>
                    </div>
                    <hr className="border-gray-200"/>
                    <div className="max-h-[30vh] p-2 overflow-y-scroll flex flex-col ">
                        { result.map((item: string) => 
                            <SelectBoxItem selected onClick={() => handleSelect(item)} value={item} label={item} />) 
                        }
                        { result.length === 0 &&
                            <div className="py-3 flex items-center justify-center h-full">
                                <p className="text-gray-500 text-[14px]">No results found</p>
                            </div>
                        }
                    </div>
                </div>
            }
            <div className="h-fit my-1">
                <div onClick={(_) => setVisible(true)} className="flex items-center z-500">
                    <Input id={id} label={props.label} readOnly validity={ { showValidity: false } } value={props.value} className="caret-transparent user-select-none! text-sm cursor-pointer!">
                        <Chevron className="sm:w-3 sm:h-3 lg:w-4 lg:h-4 absolute right-0 mr-3 top-auto font-black z-51 fill-gray-800 stroke-gray-800 stroke-[0.5px]" />
                    </Input>
                </div>
            </div>
        </div>
    );
}


export default SelectBox;
