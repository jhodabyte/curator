import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useAppSelector } from "../store/hooks";

export default function CheckoutPage() {
  const { billingInfo, cardInfo } = useAppSelector((state) => state.checkout);

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-10 text-[#1f1f2d]">
      <header className="sticky top-0 z-10 border-b border-[#ebe7f4] bg-[#f8f5ff]/95 px-4 py-3 backdrop-blur">
        <div className="relative mx-auto flex max-w-xl items-center justify-center">
          <Link
            to="/"
            className="absolute left-0 grid size-9 place-items-center rounded-full text-[#3525cd] transition-opacity hover:opacity-80"
            aria-label="Go back"
            tabIndex={0}
          >
            <ArrowLeft className="size-5" strokeWidth={2} aria-hidden />
          </Link>
          <span className="text-sm font-extrabold tracking-[0.12em] text-[#1f1f2d]">
            CURATED
          </span>
          <Link
            to="/"
            className="absolute right-0 grid size-9 place-items-center rounded-full text-[#3525cd] transition-opacity hover:opacity-80"
            aria-label="Close"
            tabIndex={0}
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#6b6787]">
            STEP 3 OF 5
          </p>
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#3525cd]">
            Summary
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e4e0f0]">
          <div
            className="h-full rounded-full bg-[#3525cd]"
            style={{ width: "60%" }}
            aria-hidden
          />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight text-[#201f31]">
          Review your order
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6787]">
          One final look before we curate your selection.
        </p>

        <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[#6b6787]">Subtotal</span>
            <span className="font-bold text-[#201f31]">$299.00</span>
          </div>
          <div
            className="my-4 border-t border-dotted border-[#d5d0e5]"
            aria-hidden
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-extrabold text-[#201f31]">
              Total
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#3525cd]">
              $314.00
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-[1.5rem] bg-[#ece9f8] p-4">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-white/60">
              <Truck
                className="size-4 text-[#3525cd]"
                strokeWidth={2}
                aria-hidden
              />
            </div>
            <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd]">
              SHIPPING
            </span>
          </div>
          <p className="mt-3 text-sm font-bold leading-snug text-[#201f31]">
            {billingInfo.street}, {billingInfo.city}
          </p>
          <button
            type="button"
            className="mt-3 text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd] underline-offset-2 hover:underline"
          >
            CHANGE
          </button>
        </div>

        <div className="mt-4 rounded-[1.5rem] bg-[#ece9f8] p-4">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-white/60">
              <CreditCard
                className="size-4 text-[#3525cd]"
                strokeWidth={2}
                aria-hidden
              />
            </div>
            <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd]">
              PAYMENT
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-[#1a1f36] px-2 py-1",
                "text-[9px] font-extrabold tracking-[0.08em] text-white",
              )}
            >
              VISA
            </span>
            <span className="text-sm font-semibold tracking-wide text-[#201f31]">
              •••• •••• •••• {cardInfo.last4}
            </span>
          </div>
          <button
            type="button"
            className="mt-3 text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd] underline-offset-2 hover:underline"
          >
            CHANGE
          </button>
        </div>

        <Button
          type="button"
          className="mt-8 h-14 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae]"
        >
          Confirmar pago
        </Button>
      </div>
    </div>
  );
}
