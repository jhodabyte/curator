import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, X, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { submitPayment } from "../store/slices/transactionSlice";
import { openBillingModal } from "../store/slices/uiSlice";
import { formatPrice } from "../lib/format";

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
            PASO 3 DE 5
          </p>
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#3525cd]">
            RESUMEN
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
          Revisa tu pedido
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6787]">
          Un último vistazo antes de confirmar tu selección.
        </p>

        {selectedProduct && (
          <div className="mt-4 flex items-center gap-3 rounded-[1.5rem] bg-[#ece9f8] p-3">
            <img
              src={selectedProduct.images?.[0] || selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="size-14 rounded-xl object-contain bg-white p-1"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#201f31]">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-[#6b6787]">Cantidad: {quantity}</p>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-[1.75rem] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[#6b6787]">Producto</span>
            <span className="font-bold text-[#201f31]">
              {formatPrice(productAmount)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-[#6b6787]">Tarifa base</span>
            <span className="font-bold text-[#201f31]">
              {formatPrice(BASE_FEE)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
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
            <span className="text-base font-extrabold text-[#201f31]">
              Total
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#3525cd]">
              {formatPrice(total)}
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
              PAGO
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-[#1a1f36] px-2 py-1",
                "text-[9px] font-extrabold tracking-[0.08em] text-white",
              )}
            >
              {cardInfo.brand || "CARD"}
            </span>
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
          className="mt-8 h-14 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae] disabled:opacity-70"
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
  );
}
