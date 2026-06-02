import { useId, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import ErrorIcon from "@/assets/exclamation-circle-fill.svg?react";
import CheckIcon from "@/assets/check-circle-fill.svg?react";

import { inputStatusChangeAnimation } from "@/animations/InputAnimations";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    text?: string;
    required?: boolean;
    validity?: { showValid: boolean, message: string };
    error: string;
}

const Input = ({ text, required, validity, error, ...props }: InputProps) => {
    const selfRef = useRef<HTMLDivElement>(null);
    const [tl, setTl] = useState<gsap.core.Timeline>();
    const validty = validity ?? { showValid: false, message: "" };
    const id = useId();

    useGSAP(() => {
        if(error) setTl(inputStatusChangeAnimation("#fb2c36"));
        else if(validty.showValid && !error) setTl(inputStatusChangeAnimation("#00c950"));
        else if(tl) tl.reverse();
    }, { scope: selfRef, dependencies: [error, validty?.message] })

    return (
        <div ref={selfRef} className="font-[Inter]! text-black">
            <div className="h-fit relative my-1">
                { text &&
                    <label htmlFor={id} className="mb-3 text-[14px] font-medium flex items-center gap-1 text-gray-700">{text}{required && <span className="text-red-500">*</span>}</label>
                }
                <input id={id} {...props} className="bg-white text-sm input relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!" />

                { error &&
                    <div className="font-medium z-10 status-message flex gap-1 items-center w-fit text-[13px] text-red-500">
                        <ErrorIcon className="w-4 h-4 fill-red-500!"/>
                        <p>{ error }</p>
                    </div>
                }

                { !error && validty.message &&
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
