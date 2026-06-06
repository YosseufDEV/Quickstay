import { useGSAP } from "@gsap/react";
import { animateBackdrop, showFormAnimation } from "@/animations/AuthenticationFormAnimations";

import LoginView from "./LoginView";
import SignUpView from "./SignUpView";
import useAuthModalStore from "@/stores/authModalStore";
import { useRef } from "react";
import useAuthStore from "@/stores/authStore";

const AuthenticationForm = () => {
    const containerRef = useRef(null);
    const moduleRef = useRef(null);

    const visible = useAuthModalStore(state => state.isOpen);
    const signedIn = useAuthStore(state => state.isAuthenticated);
    const closeModal = useAuthModalStore(state => state.closeModal);
    const page = useAuthModalStore(state => state.modalPage);

    const hideForm = (_: any) => {
        document.body.style.overflowY = "scroll";
        closeModal();

    }

    useGSAP(() => {
        if(visible) {
            document.body.style.overflowY = "hidden";
            animateBackdrop();
            showFormAnimation(moduleRef);
        }
    }, { dependencies: [visible] })

    if(visible && !signedIn) {
        return (
            <div ref={containerRef} onClick={(e) => { if(e.target==containerRef.current) hideForm(e); }} className="backdrop opacity-100 bg-[rgba(0,0,0,0.7)] z-100 fixed inset-0 flex items-center justify-center">
                <div ref={moduleRef} className="md:w-100 xl:w-120 2xl:w-120 hlg:py-[10vh] max-p hmd:py-[5vh] px-[2vw] shadow-md bg-white rounded-lg flex flex-col items-center justify-start">
                    { page === "login" ? <LoginView /> : <SignUpView /> }
                </div>
            </div>
        )
    }
    return null;
}

export default AuthenticationForm;
