import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  product: string;
  plan: string;
  cost: string;
  renewalCost: string;
  quantity: number;
};

type OrderPayload = {
  email: string;
  paymentMethod: string;
  paymentDetails: Record<string, FormDataEntryValue | null>;
  items: CartItem[];
};

const queryClient = new QueryClient();

const readCart = (): CartItem[] => {
  try {
    return JSON.parse(
      localStorage.getItem("northstar-cart") ?? "[]",
    ) as CartItem[];
  } catch {
    return [];
  }
};

const submitOrder = async (payload: OrderPayload) => {
  const endpoint = import.meta.env.PUBLIC_API_BASE_URL ?? "/api/orders";
  const response = await axios.post(endpoint, payload);
  return response.data;
};

const CheckoutForm = () => {
  const [payment, setPayment] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const mutation = useMutation({ mutationFn: submitOrder });

  useEffect(() => {
    const syncCart = () => setCart(readCart());
    syncCart();
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const confirmationEmail = String(formData.get("email-confirm") ?? "");

    if (email !== confirmationEmail) {
      setEmailError("Email addresses do not match.");
      return;
    }

    setEmailError("");
    const paymentDetails =
      payment === "upi"
        ? { upiId: formData.get("upi-id") }
        : payment === "card"
          ? {
              cardNumber: formData.get("card-number"),
              expiry: formData.get("card-expiry"),
              cvv: formData.get("card-cvv"),
            }
          : { bank: formData.get("bank") };

    mutation.mutate(
      { email, paymentMethod: payment, paymentDetails, items: cart },
      {
        onSuccess: () => {
          localStorage.removeItem("northstar-cart");
          window.dispatchEvent(new Event("cart-updated"));
          setCart([]);
          setSubmittedEmail(email);
        },
      },
    );
  };

  if (submittedEmail) {
    return (
      <div
        className="rounded-2xl bg-emerald-50 p-5 text-emerald-900"
        role="status"
      >
        <p className="font-bold">Order request received.</p>
        <p className="mt-2 text-sm leading-6">
          We will send the next payment and order details to{" "}
          <span className="font-semibold">{submittedEmail}</span>.
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <p className="mt-6 rounded-2xl bg-[#fff7ed] p-5 text-sm leading-6 text-ink/65">
        Your order is empty. Choose a product plan to continue.
      </p>
    );
  }

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold" htmlFor="order-email">
          Register email address
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-teal"
          id="order-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <label
          className="mt-4 block text-sm font-semibold"
          htmlFor="order-email-confirm"
        >
          Confirm email address
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-teal"
          id="order-email-confirm"
          name="email-confirm"
          type="email"
          placeholder="Re-enter your email"
          required
        />
        {emailError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Payment method</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["upi", "card", "netbanking"].map((method) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink/15 p-3 text-sm"
              key={method}
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={payment === method}
                onChange={() => setPayment(method)}
                required={method === "upi"}
              />
              {method === "upi"
                ? "UPI"
                : method === "card"
                  ? "Credit card"
                  : "Net banking"}
            </label>
          ))}
        </div>
      </fieldset>

      {payment === "upi" && (
        <div className="rounded-2xl bg-[#fff7ed] p-4">
          <label className="text-sm font-semibold" htmlFor="upi-id">
            UPI ID
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-teal"
            id="upi-id"
            name="upi-id"
            placeholder="name@bank"
            required
          />
        </div>
      )}
      {payment === "card" && (
        <div className="space-y-3 rounded-2xl bg-[#fff7ed] p-4">
          <label className="text-sm font-semibold" htmlFor="card-number">
            Card number
          </label>
          <input
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-teal"
            id="card-number"
            name="card-number"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-teal"
              name="card-expiry"
              placeholder="MM / YY"
              aria-label="Card expiry"
              required
            />
            <input
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-teal"
              name="card-cvv"
              inputMode="numeric"
              placeholder="CVV"
              aria-label="Card CVV"
              required
            />
          </div>
        </div>
      )}
      {payment === "netbanking" && (
        <div className="rounded-2xl bg-[#fff7ed] p-4">
          <label className="text-sm font-semibold" htmlFor="bank">
            Choose your bank
          </label>
          <select
            className="mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-teal"
            id="bank"
            name="bank"
            required
          >
            <option value="">Select a bank</option>
            <option>State Bank of India</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
          </select>
        </div>
      )}

      {mutation.isError && (
        <p
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          We could not submit the order. Please try again.
        </p>
      )}
      <button
        className="w-full rounded-xl bg-teal px-5 py-3.5 font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Submitting order..." : "Review and place order"}
      </button>
    </form>
  );
};

export default function OrderCheckout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CheckoutForm />
    </QueryClientProvider>
  );
}
