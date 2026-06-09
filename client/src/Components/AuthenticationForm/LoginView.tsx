import { useForm } from "react-hook-form";

import GenericButton from "../GenericButton/GenericButton";
import Input from "../Input/Input";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@quickstay/validators/src/userValidators";

import GoogleLogo from "@/assets/GoogleIcon.svg?react";
import DangerIcon from "@/assets/exclamation-triangle-fill.svg?react";
import useAuthModalStore from "@/stores/authModalStore";
import { login } from "@/api/auth";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginView = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const switchView = useAuthModalStore(state => state.setModalPage);

    const handleLogin = (data: LoginFormData) => {
        const { email, password } = data;
        login(email, password).then(response => {
            if(response.error) {
                console.error("Login failed:", response.error);
            } else {
                console.log("Login successful:", response);
            }
        })

    }

    const handleSignupRedirect = (e: any) => {
        useAuthModalStore.getState().setModalPage("signup");
    }

    return (
        <div className="w-full hmd:py-[7vh] flex flex-col items-center justify-start">
            <p className="mb-10 flex flex-col text-center font-bold text-xl">Welcome Back! <span className="text-sm font-medium text-gray-600">Please log in to continue</span></p>

            {/* { errors.authentication && */}
            {/*     <div className="font-[Outfit] px-6 py-5 rounded-md w-full bg-red-50 border border-red-500 flex items-center justify-center gap-2"> */}
            {/*         <DangerIcon className="w-6 h-6 fill-red-400 ml-2" /> */}
            {/*         <p className="text-red-600 text-[17px]">{errors.authentication}</p> */}
            {/*     </div> */}
            {/* } */}


            <div className="w-full mb-5">
                <GenericButton className="w-full shadow-sm h-[10%]! text-gray-600 flex items-center justify-center gap-2" onClick={(e) => e.preventDefault()}>
                    <GoogleLogo className="w-5 h-5 mr-2" />
                    <p className="text-[15px] font-semibold!">Continue with Google</p>
                </GenericButton>

                <div className="flex mt-2 justify-center w-full items-center">
                    <div className="h-px w-full  bg-gray-300"/>
                    <p className="mx-2">or</p>
                    <div className="h-px w-full bg-gray-300"/>
                </div>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-3 w-full">

                <Input {...register("email")} validity={ { message: errors.email?.message, isValid: !(errors.email) } } type="email" placeholder="Enter your email address" label="Email address"/>

                {/* TODO: Implement password for this*/}
                <Input {...register("password")} validity={ { message: errors.password?.message, isValid: !(errors.password) } } type="text" placeholder="Enter your password" label="Password"/>

                {/* <Checkbox /> */}

                <GenericButton text="Login" className="shadow-sm h-[10%] bg-black! mt-5 mb-5 font-semibold! text-white border-none text-[15px]!" />

            </form>
            <p className="select-none font-[Outfit] text-[15px] text-gray-700">Don't have an account? <span onClick={handleSignupRedirect} className="font-semibold cursor-pointer text-gray-900">Sign up</span></p>
        </div>
    )
}

export default LoginView;
