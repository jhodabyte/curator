import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Truck, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setBillingInfo } from "../store/slices/checkoutSlice";
import { closeBillingModal } from "../store/slices/uiSlice";

const inputClassName =
  "h-12 rounded-2xl border-0 bg-[#f3f0ff] px-4 text-base text-[#1f1f2d] shadow-none placeholder:text-[#9b96b0] focus-visible:ring-2 focus-visible:ring-[#3525cd]/30";

const labelClassName =
  "text-[10px] font-extrabold tracking-[0.14em] text-[#6b6787]";

const billingSchema = z.object({
  fullName: z.string().min(1, "El nombre es obligatorio"),
  street: z.string().min(1, "La calle es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  postalCode: z
    .string()
    .min(4, "El código postal debe tener al menos 4 caracteres")
    .regex(/^\d+$/, "El código postal solo puede contener números"),
});

type BillingFormData = z.infer<typeof billingSchema>;

export default function BillingInfoModal() {
  const dispatch = useAppDispatch();
  const billingInfo = useAppSelector((state) => state.checkout.billingInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: billingInfo,
  });

  const onSubmit = (data: BillingFormData) => {
    dispatch(setBillingInfo(data));
    dispatch(closeBillingModal());
  };

  return (
    <DialogContent
      showCloseButton
      className={cn(
        "max-h-[min(90dvh,calc(100dvh-2rem))] gap-0 overflow-y-auto rounded-[1.75rem] border-0 p-0 shadow-lg sm:max-w-md",
        "[&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:text-[#9b96b0] hover:[&_[data-slot=dialog-close]]:text-[#6b6787]",
      )}
    >
      <div className="px-5 pb-6 pt-5">
        <DialogHeader className="gap-1 space-y-0 pr-10 text-left">
          <DialogDescription className="text-[10px] font-bold tracking-[0.2em] text-primary">
            PASO 2 DE 5
          </DialogDescription>
          <DialogTitle className="font-heading text-2xl font-extrabold tracking-tight text-[#201f31]">
            Pago y Entrega
          </DialogTitle>
        </DialogHeader>

        <form
          className="mt-6 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ece9f8]">
                <User
                  className="size-5 text-primary"
                  aria-hidden
                  strokeWidth={2}
                />
              </div>
              <h2 className="text-base font-extrabold text-[#201f31]">
                Información Personal
              </h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-full-name" className={labelClassName}>
                NOMBRE COMPLETO
              </Label>
              <Input
                id="billing-full-name"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                className={cn(
                  inputClassName,
                  errors.fullName && "ring-2 ring-destructive/30",
                )}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ece9f8]">
                <Truck
                  className="size-5 text-primary"
                  aria-hidden
                  strokeWidth={2}
                />
              </div>
              <h2 className="text-base font-extrabold text-[#201f31]">
                Destino de Entrega
              </h2>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="billing-street" className={labelClassName}>
                  CALLE Y NÚMERO
                </Label>
                <Input
                  id="billing-street"
                  placeholder="Calle Falsa 123"
                  autoComplete="street-address"
                  aria-invalid={!!errors.street}
                  className={cn(
                    inputClassName,
                    errors.street && "ring-2 ring-destructive/30",
                  )}
                  {...register("street")}
                />
                {errors.street && (
                  <p className="text-xs text-destructive">
                    {errors.street.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-city" className={labelClassName}>
                  CIUDAD
                </Label>
                <Input
                  id="billing-city"
                  placeholder="Madrid"
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  className={cn(
                    inputClassName,
                    errors.city && "ring-2 ring-destructive/30",
                  )}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-xs text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-postal" className={labelClassName}>
                  CÓDIGO POSTAL
                </Label>
                <Input
                  id="billing-postal"
                  placeholder="28001"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  aria-invalid={!!errors.postalCode}
                  className={cn(
                    inputClassName,
                    errors.postalCode && "ring-2 ring-destructive/30",
                  )}
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-xs text-destructive">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-full border-0 bg-[#ece9f8] text-base font-semibold text-primary hover:bg-[#e0dcf5] hover:text-primary"
              >
                Atrás
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-12 flex-[1.15] rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Continuar
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
