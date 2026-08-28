import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Chevron from "@/assets/chevron-down.svg?react";
import CloseIcon from "@/assets/closeIcon.svg?react";
import SearchIcon from "@/assets/searchIcon.svg?react";
import Input from "../Input/Input";
import { useOutsideClick } from "@/hooks/useOutsideClick";


interface SelectBoxProps {
    label?: string,
    placeholder?: string,
    reactFormChange?: any,
    value?: string,
    title?: string,
    items: string[],
}

interface SelectBoxMenuProps {
    placeholder?: string,
    searchable?: boolean,
    masterRef: React.RefObject<HTMLDivElement>,
    value?: string,
    onSelect?: (item: string) => void,
    title?: string,
    items: ({
        value: string,
        label: string,
    } | string)[],
}

interface SelectBoxItemProps {
    value: string;
    label: string;
    selected?: boolean;
    onClick: (e: any) => void;
}

const SelectBoxItem = (props: SelectBoxItemProps) => {
    return (
        <div onClick={props.onClick} className="hover:bg-gray-100 active:bg-gray-200 min-w-80 pl-5 px-3 py-2 rounded-lg cursor-pointer select-none">
            <p className="text-gray-700 text-[15px]">{props.label}</p>
        </div>
    )
}

export const SelectBoxMenu = (props: SelectBoxMenuProps ) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [ result, setResult ] = useState<typeof props.items>(props.items);
    const [height, setHeight] = useState(0);

    const handleSearch = (e: any) => {
        const value = (e.target.value).toLowerCase().trim();

        const filteredResults: typeof props.items = props.items.filter((item) => {
            if(typeof item === "string") {
                return item.toLowerCase().trim().includes(value);
            }
            return item.label.toLowerCase().trim().includes(value) || item.value.toLowerCase().trim().includes(value);
        });

        setResult(value=="" ? props.items : filteredResults);
    }

    const handleSelect = (item: string) => {
        props.onSelect(item);
        setVisible(false);
    }

    useLayoutEffect(() => {
        if(ref.current) {
            setHeight(ref.current?.offsetHeight);
        }
    });

    useEffect(() => {
        setResult(props.items);

    }, [props.items, props.masterRef.current, visible])

    useEffect(() => {
        // FIXME: CLICKING ON THE FUCKING MASTER REF OPENS AND CLOSES THEN OPENS THE MENU.
        const handleClick = (e: MouseEvent) => { 
            setVisible(true);

            if(props.masterRef.current?.contains(e.target as Node) && visible) {
                console.log(true, visible);
                setVisible(false);
            }
        }

        props.masterRef.current?.addEventListener("click", handleClick);

        return () => {
            props.masterRef.current?.removeEventListener("click", handleClick);
        }
    }, [props.masterRef, visible]);

    useOutsideClick(ref, () => {
        setVisible(false);
    });

    if(!visible) return null;

    return (
        <div ref={ref} className="min-w-90 overflow-hidden absolute shadow-lg rounded-xl bg-white z-100" style={ { top: `-${height-20}px` } }>
            <div className="h-full px-3 py-2 grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                <h1 className="font-semibold text-[14px] w-full text-gray-700">{props.title}</h1>
                <div onClick={() => setVisible(false)} className="p-2 hover:bg-gray-100 w-fit opacity-85 rounded-md transition-all">
                    <CloseIcon className="w-3 h-3 stroke-gray-500! stroke-2!"/>
                </div>

                { props.searchable &&
                    <div className="relative flex items-center w-full col-span-2">
                        <input autoFocus onChange={handleSearch} placeholder="Search" className="pl-7 bg-white text-sm relative w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-1 mb-0!" />
                        <SearchIcon className="w-7 h-7 stroke-gray-400 absolute top-auto z-50" />
                    </div> 
                }
            </div>
            <hr className="border-gray-200"/>
            <div className="max-h-[30vh] overflow-y-scroll p-2 flex flex-col ">
                { result.map((item, index) => {
                        if(typeof item === "string") {
                            return <SelectBoxItem key={index} selected onClick={() => handleSelect(item)} value={item} label={item} />
                        }
                        return <SelectBoxItem key={index} selected onClick={() => handleSelect(item.value)} value={item.value} label={item.label} />
                    })
                }
                { result.length === 0 &&
                    <div className="py-3 flex items-center justify-center h-full">
                        <p className="text-gray-500 text-[14px]">No results found</p>
                    </div>
                }
            </div>
        </div>
        )
}

// TODO: Implement keyboard navigation for this component
const SelectBox = (props: SelectBoxProps) => {
    const masterRef = useRef<HTMLDivElement | null>(null);

    const handleItemSelect = (item: any) => {
        props.reactFormChange(item);
    }

    const id = useId();

    return (
        <div className="cursor-pointer font-[Inter]! text-black relative">
            <SelectBoxMenu 
                    onSelect={handleItemSelect}
                    title={props.title} 
                    items={props.items} 
                    value={props.value} 
                    masterRef={masterRef}
            />

            { /* FIX: Can't close it from here because it counts as a show-click and an outside click! */ }
            <div className="relative z-55 h-fit my-1">
                <div  className="flex items-center z-500">
                    <Input ref={masterRef} type="text" id={id} label={props.label} readOnly validity={ { dontValidate: true } } value={props.value} className="caret-transparent z-50 user-select-none! text-sm cursor-pointer!">
                        <Chevron className="sm:w-3 sm:h-3 lg:w-4 lg:h-4 absolute right-0 mr-3 top-auto z-51 font-black fill-gray-800 stroke-gray-800 stroke-[0.5px]" />
                    </Input>
                </div>
            </div>
        </div>
    );
}


export default SelectBox;
