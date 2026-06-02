import { useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import ErrorIcon from "@/assets/exclamation-circle-fill.svg?react";
import CheckIcon from "@/assets/check-circle-fill.svg?react";

import { inputStatusChangeAnimation } from "@/animations/InputAnimations";

interface InputProps {
    type: string;
    placeholder: string;
    text?: string;
    ref?: any;
    validity?: { showValid: boolean, message: string };
    onInput?: (value: any) => void;
    error: string;
}

const Input = (props: InputProps) => {
    const selfRef = useRef<HTMLDivElement>(null);
    const [tl, setTl] = useState<gsap.core.Timeline>();
    const validty = props.validity ?? { showValid: false, message: "" };

    useGSAP(() => {
        if(props.error) setTl(inputStatusChangeAnimation("#fb2c36"));
        else if(validty.showValid && !props.error) setTl(inputStatusChangeAnimation("#00c950"));
        else if(tl) tl.reverse();
    }, { scope: selfRef, dependencies: [props.error, validty?.message] })

    return (
        <div onChange={props.onInput} ref={selfRef} className="font-[Inter]! text-black">
            <div className="h-fit relative my-1">
                { props.text &&
                    <p className="mb-3 text-[14px] font-medium text-gray-700">{props.text}</p>
                }
                <input ref={props.ref} className="bg-white text-sm input relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!" type={props.type} placeholder={props.placeholder} />

                { props.error &&
                    <div className="font-medium z-10 status-message flex gap-1 items-center w-fit text-[13px] text-red-500">
                        <ErrorIcon className="w-4 h-4 fill-red-500!"/>
                        <p>{ props.error }</p>
                    </div>
                }

                { !props.error && validty.message &&
                    <div className="font-medium z-10 status-message flex gap-1 items-center w-fit text-[13px] text-green-500">
                        <CheckIcon className="w-4 h-4 fill-green-500!"/>
                        <p>{ validty.message }</p>
                    </div>
                }
            </div>
        </div>
    );
}


export default Input;
