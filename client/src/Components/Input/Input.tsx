import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import ErrorIcon from "@/assets/exclamation-circle-fill.svg?react";
import CheckIcon from "@/assets/check-circle-fill.svg?react";

import { inputStatusInAnimation, inputStatusOutAnimation, inputValidityChangeAnimation } from "@/animations/InputAnimations";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
    required?: boolean;
    validity: validity | dontValidate;
}

type validity = {
    dontValidate?: never;
    isValid: boolean;
    message?: string;
}

type dontValidate = {
    dontValidate: true;
    isValid?: never;
    message?: never;
}

const Status = {
    invalid: {
        Icon: ErrorIcon,
        color: "#fb2c36",
    },
    valid: {
        Icon: CheckIcon,
        color:"#fb2c36",
    }
}

const StatusMessage = ({ message, valid }: { message?: string, valid: boolean  }) => {
    const statusObj = valid ? Status.valid : Status.invalid;
    const iconClass = "md:w-3 md:h-3 w-4 h-4"
    const [displayMessage,setDisplayMessage] = useState("");
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if(message) {
            if(tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }
            tlRef.current = inputStatusInAnimation();
            setDisplayMessage(message);
        }

        if(!message && tlRef.current) {
            tlRef.current.kill();
            inputStatusOutAnimation();
        }
    },  { scope: ref, dependencies: [message] })


    return (
        <div ref={ref}>
            <div className="opacity-0 h-0 font-medium md:text-[12px] z-10 status-message flex gap-1 items-center w-fit text-[13px]" style={{ color: statusObj.color }}>
                <statusObj.Icon className={iconClass} style={ { fill: statusObj.color }} />
                <p>{displayMessage}</p>
            </div>
        </div>
    )

}

const Input = ({ label, required, validity, children, ...props }: InputProps) => {
    const selfRef = useRef<HTMLDivElement>(null);
    const [tl, setTl] = useState<gsap.core.Timeline | null>(null);

    const id = useId();

    useGSAP(() => {
        if(validity.dontValidate) return;

        if(validity.message) {
            const color = validity.isValid ? Status.valid.color : Status.invalid.color;
            setTl(inputValidityChangeAnimation(color));
        }

        if(!validity.message && tl) {
            tl.reverse();
        }

    }, { scope: selfRef, dependencies: [validity.isValid], revertOnUpdate: true })

    return (
        <div ref={selfRef} className="w-full h-fit font-[Inter]! text-black">
            <div className="h-fit relative my-1 mt-7 hlg:mt-9 flex flex-col justify-center">
                { label &&
                    <label htmlFor={id} className="absolute hmd:-top-6 hlg:-top-8 mb-3 hlg:text-[14px] hmd:text-[12px] font-medium flex items-center gap-1 text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
                }
                {children}
                <input id={id} {...props} className={ `${props.className} bg-white hlg:text-sm hmd:text-[12px] input relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!`  }/>

                { !validity.dontValidate &&
                    <StatusMessage message={validity.message} valid={ validity.isValid } />
                }

            </div>
        </div>
    );
}


export default Input;
