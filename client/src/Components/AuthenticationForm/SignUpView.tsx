import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema } from "@quickstay/validators/src/userValidators";

import { registerUser } from "@/api/auth.ts";

import GenericButton from "../GenericButton/GenericButton";
import Input from "../Input/Input";

import GoogleLogo from "@/assets/GoogleIcon.svg?react";
import DangerIcon from "@/assets/exclamation-triangle-fill.svg?react";
import SelectBox from "../SelectBox/SelectBox";
import useAuthModalStore from "@/stores/authModalStore";
import { useState } from "react";


const country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

interface SignUpFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
}

const SignUpView = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            country: "Egypt",
        }
    });

    const [authenticationError, setAuthenticationError] = useState<string | null>(null);

    const handleLoginRedirect = (e: any) => {
        useAuthModalStore.getState().setModalPage("login");
    }

    const handleSignUp = async (data: SignUpFormData) => {
        const result = await registerUser({ ...data, role: "user" })
        if(result.success) {
            useAuthModalStore.getState().setModalPage("login");
        } else {
            setAuthenticationError(result.message || "Registration failed");
        }
    }

    return (
        <>
            <p className="mb-5 flex flex-col text-center font-bold text-xl">Create Account<span className="text-sm font-medium text-gray-600">Please sign up to continue</span></p>

            { /* TODO:: Replace this with a Component */ }
            { authenticationError &&
                <div className="px-6 py-2 rounded-md w-full bg-red-50 border border-red-500 flex items-center justify-center gap-2">
                    <DangerIcon className="w-5 h-5 fill-red-400 ml-2" />
                    <p className="text-red-700 text-[14px] font-medium">{authenticationError}</p>
                </div>
            }

            <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-3 md:gap-1 w-full">
                <GenericButton className="shadow-sm h-[10%]! text-gray-600 flex items-center justify-center gap-2" onClick={(e) => e.preventDefault()}>
                    <GoogleLogo className="w-5 h-5 mr-2" />
                    <p className="text-[15px] font-semibold!">Continue with Google</p>
                </GenericButton>

                <div className="flex justify-center w-full items-center mb-5 mt-2">
                    <div className="h-px w-full  bg-gray-300"/>
                    <p className="mx-2">or</p>
                    <div className="h-px w-full bg-gray-300"/>
                </div>


                <Input {...register("email")} validity={ { isValid: !(errors.email?.message), message: errors.email?.message } } required type="text" placeholder="Email address" label="Email address"/>

                <div className="flex gap-5">
                    <Input {...register("firstName")} required validity={ { isValid: !(errors.firstName?.message), message: errors.firstName?.message } } type="text" placeholder={"First Name"} label="First Name"/>
                    <Input {...register("lastName")} required validity={ { isValid: !(errors.lastName?.message), message: errors.lastName?.message } }  type="text" placeholder="Last Name" label="Last Name"/>
                </div>

                <Controller 
                    name="country"
                    control={control}
                    render={ ({ field: { onChange, value }, fieldState: { error } }) => <SelectBox value={value} reactFormChange={onChange} items={country_list} title="Select Country" label="Country"/>}
                />

                {/* Todo: Implement password for this*/}
                <Input {...register("password")} required validity={ { isValid: !(errors.password?.message), message: errors.password?.message } } type="text" placeholder="Password" label="Password"/>

                <div className="flex flex-col gap-3">
                    <GenericButton text="Sign up" className="shadow-sm h-[10%] bg-black! mt-5 font-semibold! text-white border-none text-[15px]!"  />
                    <p className="text-gray-600 text-[13px] text-center">By creating an account, you agree to Quickstay <a>Terms of Services</a>, for more information please visit our <a>Privacy Policy</a> </p>
                </div>


            </form>
            <p className="mt-5 select-none font-[Outfit] text-[15px] text-gray-700">Already have an account? <span onClick={handleLoginRedirect} className="font-semibold cursor-pointer text-gray-900">Login</span></p>
        </>
    )
}

export default SignUpView;
