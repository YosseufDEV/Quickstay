import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import ErrorIcon from "@/assets/exclamation-circle-fill.svg?react";
import CheckIcon from "@/assets/check-circle-fill.svg?react";

import { inputStatusInAnimation } from "@/animations/InputAnimations";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    validity?: { showValid: boolean, message: string };
    error?: string;
}

const StatusMessage = ({ message, Icon, color="red-500"}: { message: string, Icon: any, color?: string }) => {
    return (
        <div className="h-0 font-medium z-10 status-message flex gap-1 items-center w-fit text-[13px] text-red-500">
            <Icon className="w-4 h-4 fill-red-500!"/>
            <p>{ message }</p>
        </div>
    )
}

const Input = ({ label, required, validity, error, ...props }: InputProps) => {
    const selfRef = useRef<HTMLDivElement>(null);

    const [tl, setTl] = useState<gsap.core.Timeline>();
    const [status, setStatus] = useState({ message: "", shouldRender: false });

    const validty = validity ?? { showValid: false, message: "" };

    const id = useId();

    useEffect(() => {
    }, [error, validty?.showValid])

    useGSAP(() => {
        if(error || validty.showValid) {
            setStatus({ message: error ?? validty.message, shouldRender: true });
        }
        if(error) setTl(inputStatusInAnimation("#fb2c36"));
        // else if(validty.showValid && !error) setTl(inputStatusChangeAnimation("#00c950"));
        else if(tl) {
            tl.reverse().vars.onReverseComplete = () => setStatus({ message: "", shouldRender: false });
        };
    }, { scope: selfRef, dependencies: [error, validty?.message] })

    return (
        <div ref={selfRef} className="font-[Inter]! text-black">
            <div className="h-fit relative my-1">
                { label &&
                    <label htmlFor={id} className="mb-3 text-[14px] font-medium flex items-center gap-1 text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
                }
                <input id={id} {...props} className="bg-white text-sm input relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!" />

                { (error || status.shouldRender) &&
                    <StatusMessage message={status.message} Icon={ErrorIcon} />
                }

                {/* { !error && validty.message && */}
                {/*     <StatusMessage message={validty.message} Icon={CheckIcon} color="green-500" /> */}
                {/* } */}
            </div>
        </div>
    );
}


export default Input;
