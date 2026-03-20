import { useMemo, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

type GalleryItem = {
  id: string;
  label: string;
  src: string;
};

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "zap";
};

type ColorOption = {
  id: string;
  label: string;
  value: string;
};

const galleryItems: GalleryItem[] = [
  { id: "image-1", label: "Vista 1", src: "/images/imagen-1.png" },
  { id: "image-2", label: "Vista 2", src: "/images/imagen-2.png" },
  { id: "image-3", label: "Vista 3", src: "/images/imagen-3.png" },
];

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

const colorOptions: ColorOption[] = [
  { id: "midnight", label: "Midnight Blue", value: "#141c4a" },
  { id: "violet", label: "Electric Violet", value: "#3828cf" },
  { id: "silver", label: "Glacier Silver", value: "#a0a5b8" },
];

export default function ProductPage() {
  const [selectedGalleryId, setSelectedGalleryId] = useState(
    galleryItems[0]?.id ?? "",
  );
  const [selectedColorId, setSelectedColorId] = useState(
    colorOptions[0]?.id ?? "",
  );

  const selectedGallery = useMemo(
    () =>
      galleryItems.find((item) => item.id === selectedGalleryId) ??
      galleryItems[0],
    [selectedGalleryId],
  );

  const handleSelectGallery = (galleryId: string) => {
    setSelectedGalleryId(galleryId);
  };

  const handleSelectColor = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  const handleCheckout = () => {};

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

        <div className="mt-5 rounded-4xl p-4 md:mt-8 md:p-6">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <div className="grid place-items-center rounded-3xl p-8 md:p-10 bg-[#efebfa]">
                <img
                  src={selectedGallery.src}
                  alt={selectedGallery.label}
                  className="h-[300px] w-[300px] rounded-3xl object-contain p-2 transition-all duration-300"
                />
              </div>

              <div className="mt-3 flex items-center gap-2 md:mt-4">
                {galleryItems.map((item) => {
                  const isSelected = selectedGalleryId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      tabIndex={0}
                      aria-label={`Seleccionar vista ${item.label}`}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectGallery(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleSelectGallery(item.id);
                        }
                      }}
                      className={cn(
                        "grid size-12 place-items-center rounded-full border bg-white transition-all md:size-14",
                        isSelected
                          ? "border-[#4f46e5] ring-2 ring-[#4f46e5]/25"
                          : "border-[#d8d4eb] hover:border-[#b6afe5]",
                      )}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="size-8 rounded-full object-cover md:size-9"
                      />
                    </button>
                  );
                })}
              </div>
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
                Indigo Horizon Smartwatch
              </h1>

              <p className="max-w-md text-sm leading-relaxed text-[#66627e]">
                El equilibrio perfecto entre elegancia y tecnología de
                vanguardia. Diseñado para quienes buscan la sofisticación en
                cada segundo.
              </p>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-black tracking-tight text-[#242236]">
                  $299.00
                </p>
                <span className="rounded-full bg-[#ffe7e7] px-3 py-1 text-[10px] font-bold leading-tight text-[#c82d2d]">
                  ¡SOLO QUEDAN 3 UNIDADES EN STOCK!
                </span>
              </div>

              <div>
                <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#6b6787]">
                  SELECCIONAR ACABADO
                </p>
                <div className="mt-2 flex gap-2">
                  {colorOptions.map((option) => {
                    const isSelected = selectedColorId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        tabIndex={0}
                        aria-label={`Seleccionar color ${option.label}`}
                        aria-pressed={isSelected}
                        onClick={() => handleSelectColor(option.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelectColor(option.id);
                          }
                        }}
                        className={cn(
                          "grid size-10 place-items-center rounded-full border transition-all",
                          isSelected
                            ? "border-[#4f46e5] ring-2 ring-[#4f46e5]/30"
                            : "border-[#d8d4eb] hover:border-[#b6afe5]",
                        )}
                      >
                        <span
                          className="size-7 rounded-full"
                          style={{ backgroundColor: option.value }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  type="button"
                  onClick={handleCheckout}
                  className="h-12 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae]"
                >
                  Pagar con tarjeta
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
            onClick={handleCheckout}
            className="h-12 w-full rounded-full bg-[#3525cd] text-base font-semibold text-white hover:bg-[#2d20ae]"
          >
            Pagar con tarjeta
          </Button>
        </div>
      </div>
    </section>
  );
}
