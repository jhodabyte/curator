import { useEffect } from "react";
import { Sparkles, Zap, Loader2, AlertCircle, Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Dialog } from "../components/ui/dialog";
import BillingInfoModal from "../components/checkout/billing-info-modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSelectedGalleryId,
  setSelectedProduct,
  setQuantity,
  fetchProducts,
} from "../store/slices/productSlice";
import { openBillingModal, setBillingOpen } from "../store/slices/uiSlice";
import { formatPrice } from "../lib/format";

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "zap";
};

const featureItems: FeatureItem[] = [
  {
    id: "materials",
    title: "Materiales Premium",
    description: "Cuerpo de titanio y cristal de zafiro ultra resistente.",
    icon: "sparkles",
  },
  {
    id: "battery",
    title: "Carga Ultra",
    description: "Hasta 14 días de autonomía sin interrupciones.",
    icon: "zap",
  },
];

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const selectedGalleryId = useAppSelector(
    (state) => state.product.selectedGalleryId
  );
  const isBillingOpen = useAppSelector((state) => state.ui.isBillingOpen);
  const { products, selectedProduct, quantity, loading, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const galleryImages = selectedProduct?.images ?? [];

  const selectedImageIndex = Number(selectedGalleryId) || 0;
  const selectedImageSrc =
    galleryImages[selectedImageIndex] ?? galleryImages[0];

  const handleSelectGallery = (index: number) => {
    dispatch(setSelectedGalleryId(String(index)));
  };

  const handleOpenBilling = () => dispatch(openBillingModal());

  const handleSelectProduct = (product: typeof selectedProduct) => {
    if (product) {
      dispatch(setSelectedProduct(product));
      dispatch(setSelectedGalleryId("0"));
    }
  };

  const isOutOfStock = selectedProduct ? selectedProduct.stock <= 0 : false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-[#3525cd]" />
          <p className="text-sm font-semibold text-[#6b6787]">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ff] px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="size-12 text-[#c62828]" />
          <p className="text-sm font-semibold text-[#c62828]">{error}</p>
          <Button
            onClick={() => dispatch(fetchProducts())}
            className="rounded-full bg-[#3525cd] text-white hover:bg-[#2d20ae]"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedProduct) return null;

  return (
    <section className="mx-auto min-h-screen w-full max-w-5xl bg-[#f8f5ff] pb-28 text-[#1f1f2d] md:px-6 md:pb-8">
      <div className="mx-auto max-w-xl px-4 pt-3 md:max-w-4xl md:px-0 md:pt-8">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#6b6787]">
            01/05
          </p>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#6b6787] md:text-xs">
            DETALLES DEL PRODUCTO
          </p>
        </div>
        <div className="mt-2 h-1.5 w-16 rounded-full bg-[#3525cd]" />

        {products.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className={cn(
                  "shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all",
                  selectedProduct.id === product.id
                    ? "bg-[#3525cd] text-white"
                    : "bg-[#ece9f8] text-[#6b6787] hover:bg-[#e0dcf5]"
                )}
              >
                {product.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-4xl p-4 md:mt-8 md:p-6">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <div className="grid place-items-center rounded-3xl p-8 md:p-10 bg-[#efebfa]">
                <img
                  src={selectedImageSrc}
                  alt={selectedProduct.name}
                  loading="lazy"
                  className="h-[300px] w-[300px] rounded-3xl object-contain p-2 transition-all duration-300"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="mt-3 flex items-center gap-2 md:mt-4">
                  {galleryImages.map((src, index) => {
                    const isSelected = selectedImageIndex === index;

                    return (
                      <button
                        key={src}
                        type="button"
                        tabIndex={0}
                        aria-label={`Seleccionar vista ${index + 1}`}
                        aria-pressed={isSelected}
                        onClick={() => handleSelectGallery(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelectGallery(index);
                          }
                        }}
                        className={cn(
                          "grid size-12 place-items-center rounded-full border bg-white transition-all md:size-14",
                          isSelected
                            ? "border-[#4f46e5] ring-2 ring-[#4f46e5]/25"
                            : "border-[#d8d4eb] hover:border-[#b6afe5]"
                        )}
                      >
                        <img
                          src={src}
                          alt={`Vista ${index + 1}`}
                          loading="lazy"
                          className="size-8 rounded-full object-cover md:size-9"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {featureItems.map((item) => {
                  const Icon = item.icon === "sparkles" ? Sparkles : Zap;

                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl bg-[#ece9f8] p-3.5 md:p-4"
                    >
                      <Icon className="mb-2 size-4 text-[#3525cd]" />
                      <h3 className="text-sm font-extrabold leading-tight text-[#25223d]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-snug text-[#6a6784]">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <span className="inline-flex rounded-full bg-[#ddd7ff] px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-[#4b3fb9]">
                RECIÉN LLEGADO
              </span>

              <h1 className="max-w-md text-3xl font-extrabold leading-[1.05] tracking-tight text-[#201f31]">
                {selectedProduct.name}
              </h1>

              <p className="max-w-md text-sm leading-relaxed text-[#66627e]">
                {selectedProduct.description}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#6b6787]">Cantidad</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity(Math.max(1, quantity - 1)))}
                    disabled={quantity <= 1}
                    className="grid size-8 place-items-center rounded-full bg-[#ece9f8] text-[#3525cd] transition-colors hover:bg-[#e0dcf5] disabled:opacity-40"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-[#201f31]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity(Math.min(selectedProduct.stock, quantity + 1)))}
                    disabled={quantity >= selectedProduct.stock}
                    className="grid size-8 place-items-center rounded-full bg-[#ece9f8] text-[#3525cd] transition-colors hover:bg-[#e0dcf5] disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-black tracking-tight text-[#242236]">
                  {formatPrice(selectedProduct.price)}
                </p>
                {selectedProduct.stock > 0 && selectedProduct.stock <= 5 ? (
                  <span className="rounded-full bg-[#ffe7e7] px-3 py-1 text-[10px] font-bold leading-tight text-[#c82d2d]">
                    SOLO QUEDAN {selectedProduct.stock} UNIDADES EN STOCK
                  </span>
                ) : isOutOfStock ? (
                  <span className="rounded-full bg-[#ffe7e7] px-3 py-1 text-[10px] font-bold leading-tight text-[#c82d2d]">
                    AGOTADO
                  </span>
                ) : (
                  <span className="rounded-full bg-[#e8f5e9] px-3 py-1 text-[10px] font-bold leading-tight text-[#2e7d32]">
                    {selectedProduct.stock} EN STOCK
                  </span>
                )}
              </div>
              <div className="hidden md:block">
                <Button
                  type="button"
                  onClick={handleOpenBilling}
                  disabled={isOutOfStock}
                  className="h-12 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae] disabled:opacity-50"
                >
                  {isOutOfStock ? "Sin stock disponible" : "Pagar con tarjeta"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e6e2f4] bg-[#f8f5ff]/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto max-w-xl">
          <Button
            type="button"
            onClick={handleOpenBilling}
            disabled={isOutOfStock}
            className="h-12 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae] disabled:opacity-50"
          >
            {isOutOfStock ? "Sin stock disponible" : "Pagar con tarjeta"}
          </Button>
        </div>
      </div>

      <Dialog
        open={isBillingOpen}
        onOpenChange={(isOpen) => dispatch(setBillingOpen(isOpen))}
      >
        <BillingInfoModal />
      </Dialog>
    </section>
  );
}
