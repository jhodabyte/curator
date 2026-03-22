import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTransaction, resetTransaction } from "../store/slices/transactionSlice";
import { cn } from "../lib/utils";
import { formatPrice } from "../lib/format";

export default function PaymentStatusPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { transaction, status, error } = useAppSelector(
    (state) => state.transaction,
  );

  useEffect(() => {
    if (transactionId && !transaction) {
      dispatch(fetchTransaction(transactionId));
    }
  }, [transactionId, transaction, dispatch]);

  const isCompleted = transaction?.status === "completed";
  const isPending = !transaction || transaction.status === "pending";

  const handleBackToProducts = () => {
    dispatch(resetTransaction());
    navigate("/");
  };

  if (isPending && status !== "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-[#3525cd]" />
          <p className="text-sm font-semibold text-[#6b6787]">
            Verificando estado del pago...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] text-[#1f1f2d]">
      <div className="mx-auto max-w-xl px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#6b6787]">
            PASO 4 DE 5
          </p>
          <p className="text-[10px] font-extrabold tracking-[0.12em] text-[#3525cd]">
            RESULTADO
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e4e0f0]">
          <div
            className="h-full rounded-full bg-[#3525cd]"
            style={{ width: "80%" }}
            aria-hidden
          />
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <div
            className={cn(
              "grid size-20 place-items-center rounded-full",
              isCompleted ? "bg-[#e8f5e9]" : "bg-[#ffeaea]",
            )}
          >
            {isCompleted ? (
              <CheckCircle className="size-10 text-[#2e7d32]" />
            ) : (
              <XCircle className="size-10 text-[#c62828]" />
            )}
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#201f31]">
            {isCompleted ? "Pago aprobado" : "Pago rechazado"}
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6b6787]">
            {isCompleted
              ? "Tu pedido ha sido procesado con éxito. Pronto recibirás los detalles de envío."
              : "No pudimos procesar tu pago. Puedes intentarlo de nuevo o usar otro método de pago."}
          </p>

          {transaction && (
            <div className="mt-8 w-full rounded-[1.75rem] bg-white p-5 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6b6787]">N° Transacción</span>
                  <span className="max-w-[180px] truncate font-mono text-xs font-bold text-[#201f31]">
                    {transaction.id}
                  </span>
                </div>
                <div
                  className="border-t border-dotted border-[#d5d0e5]"
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6b6787]">Estado</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold tracking-wider",
                      isCompleted
                        ? "bg-[#e8f5e9] text-[#2e7d32]"
                        : "bg-[#ffeaea] text-[#c62828]",
                    )}
                  >
                    {isCompleted ? "APROBADO" : "RECHAZADO"}
                  </span>
                </div>
                <div
                  className="border-t border-dotted border-[#d5d0e5]"
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6b6787]">Producto</span>
                  <span className="font-bold text-[#201f31]">
                    {formatPrice(transaction.productAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6b6787]">Tarifa base</span>
                  <span className="font-bold text-[#201f31]">
                    {formatPrice(transaction.baseFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#6b6787]">Envío</span>
                  <span className="font-bold text-[#201f31]">
                    {formatPrice(transaction.deliveryFee)}
                  </span>
                </div>
                <div
                  className="border-t border-dotted border-[#d5d0e5]"
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-extrabold text-[#201f31]">
                    Total
                  </span>
                  <span className="text-xl font-extrabold tracking-tight text-[#3525cd]">
                    {formatPrice(transaction.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 w-full rounded-2xl bg-[#ffeaea] p-4 text-sm text-[#c62828]">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleBackToProducts}
            className="mt-8 h-14 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae]"
          >
            Volver a la tienda
          </Button>
        </div>
      </div>
    </div>
  );
}
