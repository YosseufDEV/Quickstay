import s from "stripe";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import SpringyButton from "@/Components/SpringyButton/SpringyButton";
import type { SubmitEventHandler } from "react";


const stripePromise = loadStripe("pk_test_51TtLIcREY4j73Lc7VaiHYg7EjMiEWBLKk8fBmekoGRDKCUPiOF6PkwxueoxAzV6At26m03JLXXpIUr5xGWqkU1yF0062iKjEWp");

const PaymentButton = ({ formId }) => {
    return (
        <SpringyButton type="submit" form={formId} className="rounded-xl bg-blue-600">
            <p className="text-lg font-medium text-blue-50">Book Now</p>
        </SpringyButton>
    )
}

const PaymentForm = ({ formId }) => {
    const stripe = useStripe();
    const elements = useElements();

    const confirmPayment = async (e: any) => {
        e.preventDefault();
        await stripe.confirmPayment({
            elements: elements,
            redirect: "if_required",
        });
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

const PaymentContainer = ({ formId }) => {
    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            fontFamily: 'Inter',
        }
    }

    return (
        <Elements 
            stripe={stripePromise} 
            options={
            { 
                // clientSecret: ps.client_secret,
                appearance: appearance
            }}>
                <PaymentForm formId={formId} />
        </Elements>
    )
}

export { PaymentContainer, PaymentButton };
