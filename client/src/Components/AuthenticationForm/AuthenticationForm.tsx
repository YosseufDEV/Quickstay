'use client';

import { createContext, useContext, useReducer, useRef } from "react";

import { useGSAP } from "@gsap/react";
import { animateBackdrop, showFormAnimation } from "@/animations/AuthenticationFormAnimations";


import { AuthenticationFormContext } from "@/Layout";

import LoginView from "./LoginView";
import SignUpView from "./SignUpView";

type action = "login" | "signup";

const formReducer = (state: any, action: action) => {
    switch(action) {
        case "login":
            return { page: "login" };
        case "signup":
            return { page: "signup" };
        default:
            return state;
    }
}

export const ModuleViewContext = createContext({ dispatch: (_: action) => {} });

const AuthenticationForm = ({ visible=false }) => {
    const containerRef = useRef(null);
    const moduleRef = useRef(null);
    const moduleDispatch = useContext(AuthenticationFormContext).dispatch;
    const [state, dispatch] = useReducer(formReducer, { page: "signup" });

    const hideForm = (e: any) => {
        document.body.style.overflowY = "scroll";
        moduleDispatch("hideModule");
    }

    useGSAP(() => {
        console.log(window.innerHeight);
        console.log(window.innerWidth);
        if(visible) {
            document.body.style.overflowY = "hidden";
            animateBackdrop();
            showFormAnimation(moduleRef);
        }
    }, { dependencies: [visible] })

    if(visible) {
        return (
            <div ref={containerRef} onClick={(e) => { if(e.target==containerRef.current) hideForm(e); }} className="backdrop opacity-100 bg-[rgba(0,0,0,0.7)] z-100 fixed inset-0 flex items-center justify-center">
                <div ref={moduleRef} className="md:w-[50vw] xl:w-100 2xl:w-120 hlg:py-[15vh] hlg:pt-[10vh] hmd:py-[10vh] hmd:pt-[10vh] px-[2vw] shadow-md bg-white rounded-lg flex flex-col items-center justify-start">
                    <ModuleViewContext.Provider value={{ dispatch: dispatch }}>
                        { state.page === "login" ? <LoginView /> : <SignUpView /> }
                    </ModuleViewContext.Provider>
                </div>
            </div>
        )
    }
    return null;
}

export default AuthenticationForm;
