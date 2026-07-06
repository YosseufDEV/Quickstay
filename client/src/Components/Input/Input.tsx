import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { useGSAP, type ReactRef } from "@gsap/react";

import ErrorIcon from "@/assets/exclamation-circle-fill.svg?react";
import CheckIcon from "@/assets/check-circle-fill.svg?react";
import EyeIcon from "@/assets/eye-outline.svg?react";
import EyeSlashedIcon from "@/assets/eye-slashed-outline.svg?react";

import { inputStatusInAnimation, inputStatusOutAnimation, inputValidityChangeAnimation } from "@/animations/InputAnimations";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
    required?: boolean;
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    validity: validity;
}

type validity = {
    dontValidate?: never;
    isValid: boolean;
    message?: string;
} | {
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
        color:"#34c759",
    }
}

const StatusMessage = ({ message, valid }: { message?: string, valid: boolean  }) => {
    const statusObj = Status.invalid;
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

const ShowPasswordButton = ({ inputRef }: { inputRef: ReactRef }) => {
    const [showPassword, setShowPassword] = useState(false);
    const iconClass = "absolute z-20 right-0 mr-5 w-[1.5em] h-[1.5em] fill-gray-700!"

    console.log("inputRef.current", inputRef.current);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        (inputRef.current as HTMLInputElement).type = showPassword ? "password" : "text";
    }
    
    return showPassword ? 
        <EyeSlashedIcon onClick={togglePasswordVisibility} className={iconClass}/> : 
        <EyeIcon onClick={togglePasswordVisibility} className={iconClass}/>;
}

const Input = ({ label, required, validity, children, type, ...props }: InputProps) => {
    const selfContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    }, { scope: selfContainerRef, dependencies: [validity.isValid], revertOnUpdate: true })

    return (
        <div ref={selfContainerRef} className="w-full h-fit font-[Inter]! text-black hlg:text-sm hmd:text-[12px]">
            <div className="h-fit relative my-1 mt-7 hlg:mt-9 flex flex-col justify-center">
                { label &&
                    <label htmlFor={id} className="absolute hmd:-top-6 hlg:-top-8 mb-3 hlg:text-[14px] hmd:text-[12px] font-medium flex items-center gap-1 text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
                }
                {children}
                <input id={id} type={type} {...props} className={ `${props.className} bg-white input relative z-20 w-full text-gray-500 border-[1.5px] border-gray-300 rounded-md px-5 py-2 mb-0!`  }/>

                { !validity.dontValidate &&
                    <StatusMessage message={validity.message} valid={ validity.isValid } />
                }

            </div>
        </div>
    );
}


export default Input;
