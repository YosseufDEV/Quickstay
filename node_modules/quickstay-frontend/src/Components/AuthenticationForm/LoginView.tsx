import { useContext, useEffect, useRef, useState } from "react";

import GenericButton from "../GenericButton/GenericButton";
import Input from "../Input/Input";

import GoogleLogo from "@/assets/GoogleIcon.svg?react";
import DangerIcon from "@/assets/exclamation-triangle-fill.svg?react";
import { ModuleViewContext } from "./AuthenticationForm";

import { loginSchema } from "@quickstay/validators/src/userValidators";
import { validateSchema } from "@quickstay/validators/src/utils";
import Checkbox from "../Checkbox/Checkbox";

const LoginView = () => {
    const [errors, setErrors] = useState({ email: "", password: "", authentication: "" });
    const [schemaErrors, setSchemaErrors] = useState();

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {

        if(!schemaErrors) {
            setErrors({ email: "", password: "", authentication: "" });
            return;
        }
        console.log(email, password);

        const validationErrors: { email?: string, password?: string } = schemaErrors?.reduce((acc, error) => ({ ...acc, [error.path[0]]: error.message }), {});

        setErrors({ ...errors, email: validationErrors.email || "", password: validationErrors.password || "" });

    }, [schemaErrors]);

    const viewDispatch = useContext(ModuleViewContext).dispatch;

    const handleLogin = (e: any) => {
        console.log(emailInputRef.current);
        e.preventDefault();
        const email = emailInputRef.current?.value;
        const password = passwordInputRef.current?.value;

        const schemaParseResult = validateSchema(loginSchema, { email, password });

        if(!schemaParseResult.success) {
            setSchemaErrors(schemaParseResult.errors);
            return;
        }

        console.log(email, password);
    }

    const handleSignupRedirect = (e: any) => {
        viewDispatch("signup");
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, setState) => {
        const value = e.target.value;
        console.log(value);

        const schemaParseResult = validateSchema(loginSchema, { email, password });

        // setSchemaErrors(schemaParseResult?.errors ? null : schemaParseResult?.errors);

        setState(value);
    }

    return (
        <>
            <p className="flex flex-col text-center font-bold text-xl">Welcome Back! <span className="text-sm font-medium text-gray-600">Please log in to continue</span></p>

            { errors.authentication &&
                <div className="font-[Outfit] px-6 py-5 rounded-md w-full bg-red-50 border border-red-500 flex items-center justify-center gap-2">
                    <DangerIcon className="w-6 h-6 fill-red-400 ml-2" />
                    <p className="text-red-600 text-[17px]">{errors.authentication}</p>
                </div>
            }

            <form className="flex flex-col gap-5 w-full">

                <Input ref={emailInputRef} onInput={(e) => handleInput(e, setEmail)} error={ errors.email } type="email" placeholder="Enter your email address" text="Email address"/>

                {/* TODO: Implement password for this*/}
                <Input ref={passwordInputRef} onInput={(e) => handleInput(e, setPassword)}  error={ errors.password } type="text" placeholder="Enter your password" text="Password"/>
                {/* <Checkbox /> */}
                <GenericButton text="Login" className="shadow-sm h-[10%] bg-black! mt-3 font-semibold! text-white border-none text-[15px]!" onClick={handleLogin} />

                <div className="flex justify-center w-full items-center">
                    <div className="h-px w-full  bg-gray-300"/>
                    <p className="mx-2">or</p>
                    <div className="h-px w-full bg-gray-300"/>
                </div>

                <GenericButton className="shadow-sm h-[10%]! text-gray-600 flex items-center justify-center gap-2" onClick={(e) => e.preventDefault()}>
                    <GoogleLogo className="w-5 h-5 mr-2" />
                    <p className="text-[15px] font-semibold!">Continue with Google</p>
                </GenericButton>

            </form>
            <p className="select-none font-[Outfit] text-[15px] text-gray-700">Don't have an account? <span onClick={handleSignupRedirect} className="font-semibold cursor-pointer text-gray-900">Sign up</span></p>
        </>
    )
}

export default LoginView;
