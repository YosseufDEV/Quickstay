import { useContext } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import SpringyButton from "@/Components/SpringyButton/SpringyButton";
import { useNavigate } from "react-router";
import { BookingContext } from "../BookingView";

const stripePromise = loadStripe("pk_test_51TtLIcREY4j73Lc7VaiHYg7EjMiEWBLKk8fBmekoGRDKCUPiOF6PkwxueoxAzV6At26m03JLXXpIUr5xGWqkU1yF0062iKjEWp");

const PaymentButton = ({ formId }) => {
    return (
        <SpringyButton type="submit" form={formId} className="rounded-xl bg-blue-600">
            <p className="text-lg font-medium text-blue-50">Book Now</p>
        </SpringyButton>
    )
}

const PaymentForm = ({ formId, booking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const confirmPayment = async (e: any) => {
        e.preventDefault();

        const r = await stripe.confirmPayment({
            elements: elements,
            redirect: "if_required",
        });

        if(r.paymentIntent?.status === "succeeded") {
            console.log("Payment succeeded!");
            navigate("/booking/confirmation", { state: { booking, fromRedirect: true } });
        }
    }

    return (
        <form id={formId} onSubmit={confirmPayment}>
            <PaymentElement options={{
                layout: {
                    defaultCollapsed: false,
                    type: "tabs",
                    spacedAccordionItems: true
                },
            }}/>
        </form>
    )
}

const appearance: Appearance = {
    theme: 'stripe',
    variables: {
        fontFamily: 'Inter',
    }
}

const PaymentContainer = ({ clientSecret }) => {
    const { formId, booking } = useContext(BookingContext);

    return (
        <Elements 
            stripe={stripePromise} 
            options={
            { 
                clientSecret,
                appearance: appearance
            }}>
                <PaymentForm booking={booking} formId={formId} />
        </Elements>
    )
}

export { PaymentContainer, PaymentButton };
