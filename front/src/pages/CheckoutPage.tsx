import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, X, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { submitPayment } from "../store/slices/transactionSlice";
import { openBillingModal } from "../store/slices/uiSlice";
import { formatPrice } from "../lib/format";
import { CardBrandMark } from "../components/checkout/card-brand-mark";

const BASE_FEE = 5000;
const DELIVERY_FEE = 10000;

const statusLabels: Record<string, string> = {
  creating: "Creando transacción...",
  tokenizing: "Validando tarjeta...",
  processing: "Procesando pago...",
  polling: "Esperando confirmación...",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { billingInfo, cardInfo } = useAppSelector((state) => state.checkout);
  const selectedProduct = useAppSelector(
    (state) => state.product.selectedProduct,
  );
  const quantity = useAppSelector((state) => state.product.quantity);
  const { status, error } = useAppSelector((state) => state.transaction);

  const isProcessing =
    status === "creating" ||
    status === "tokenizing" ||
    status === "processing" ||
    status === "polling";

  const productAmount = (selectedProduct?.price ?? 0) * quantity;
  const total = productAmount + BASE_FEE + DELIVERY_FEE;

  const handleConfirmPayment = async () => {
    const result = await dispatch(submitPayment());
    if (submitPayment.fulfilled.match(result)) {
      navigate(`/status/${result.payload.id}`);
    }
  };

  const handleChangeBilling = () => {
    navigate("/");
    setTimeout(() => dispatch(openBillingModal()), 100);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f5ff]">
      <div
        className="fixed inset-0 z-0 bg-[#f8f5ff] supports-backdrop-filter:backdrop-blur-[3px]"
        aria-hidden
      />
      <div
        className="fixed inset-0 z-0 bg-linear-to-b from-[#ebe7f4]/80 via-[#e8e2f7]/50 to-[#f8f5ff]"
        aria-hidden
      />

      <div
        className="fixed inset-x-0 bottom-0 top-[max(0.5rem,env(safe-area-inset-top))] z-10 flex flex-col overflow-hidden rounded-t-[1.85rem] border border-[#ebe7f4] border-b-0 bg-[#fffdff] text-[#1f1f2d] shadow-[0_-8px_40px_rgba(53,37,205,0.08),0_-1px_0_rgba(255,255,255,0.8)_inset] md:top-[4vh] md:bottom-[4vh] md:left-1/2 md:right-auto md:w-[min(100%-1.5rem,36rem)] md:max-w-none md:-translate-x-1/2 md:rounded-2xl md:border md:border-[#ebe7f4] md:border-b md:shadow-[0_24px_80px_rgba(53,37,205,0.14)] lg:w-[min(100%-2rem,42rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-summary-title"
      >
        <div
          className="mx-auto mt-1.5 h-1 w-12 shrink-0 rounded-full bg-[#d5d0e5] md:hidden"
          aria-hidden
        />
        <header className="shrink-0 border-b border-[#f0eef8] bg-[#fffdff]/95 px-5 py-4 backdrop-blur-md md:py-4">
          <div className="relative mx-auto flex w-full max-w-none items-center justify-center">
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

        <div className="mx-auto min-h-0 w-full flex-1 overflow-y-auto bg-[#faf9ff] px-5 pb-12 pt-5 sm:px-6 md:pb-10 md:pt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#6b6787] sm:text-[11px]">
              PASO 3 DE 5
            </p>
            <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#3525cd] sm:text-[11px]">
              RESUMEN
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e4e0f0]">
            <div
              className="h-full rounded-full bg-[#3525cd]"
              style={{ width: "60%" }}
              aria-hidden
            />
          </div>

          <h1
            id="checkout-summary-title"
            className="mt-8 text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-[#201f31] sm:text-3xl"
          >
            Revisa tu pedido
          </h1>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-[#6b6787]">
            Un último vistazo antes de confirmar tu selección.
          </p>

          {selectedProduct && (
            <div className="mt-6 flex items-center gap-4 rounded-[1.5rem] bg-[#ece9f8] p-4">
              <img
                src={selectedProduct.images?.[0] || selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="size-16 shrink-0 rounded-xl object-contain bg-white p-1 sm:size-[4.5rem]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#201f31]">
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-[#6b6787]">Cantidad: {quantity}</p>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-[1.75rem] border border-[#f0eef8] bg-white p-5 shadow-[0_2px_16px_rgba(53,37,205,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3 text-base">
              <span className="text-[#6b6787]">Producto</span>
              <span className="font-bold text-[#201f31]">
                {formatPrice(productAmount)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-base">
              <span className="text-[#6b6787]">Tarifa base</span>
              <span className="font-bold text-[#201f31]">
                {formatPrice(BASE_FEE)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-base">
              <span className="text-[#6b6787]">Envío</span>
              <span className="font-bold text-[#201f31]">
                {formatPrice(DELIVERY_FEE)}
              </span>
            </div>
            <div
              className="my-4 border-t border-dotted border-[#d5d0e5]"
              aria-hidden
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-extrabold text-[#201f31]">
                Total
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-[#3525cd] sm:text-[1.65rem]">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-[#ece9f8] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-white/60">
                <Truck
                  className="size-4 text-[#3525cd]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd]">
                ENVÍO
              </span>
            </div>
            <p className="mt-3 text-sm font-bold leading-snug text-[#201f31]">
              {billingInfo.street}, {billingInfo.city}
            </p>
            <button
              type="button"
              onClick={handleChangeBilling}
              className="mt-3 text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd] underline-offset-2 hover:underline"
            >
              CAMBIAR
            </button>
          </div>

          <div className="mt-4 rounded-[1.5rem] bg-[#ece9f8] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-white/60">
                <CreditCard
                  className="size-4 text-[#3525cd]"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd]">
                PAGO
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CardBrandMark
                brand={cardInfo.brand}
                className="scale-110 sm:scale-125"
              />
              <span className="text-sm font-semibold tracking-wide text-[#201f31]">
                •••• •••• •••• {cardInfo.last4}
              </span>
            </div>
            <button
              type="button"
              onClick={handleChangeBilling}
              className="mt-3 text-[10px] font-extrabold tracking-[0.14em] text-[#3525cd] underline-offset-2 hover:underline"
            >
              CAMBIAR
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-[#ffeaea] p-4 text-sm text-[#c62828]">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="mt-10 h-[3.25rem] w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae] disabled:opacity-70 sm:h-14 sm:text-lg"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                {statusLabels[status] ?? "Procesando..."}
              </span>
            ) : (
              "Confirmar pago"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
