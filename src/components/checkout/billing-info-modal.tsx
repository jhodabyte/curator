import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CreditCardIcon, Truck, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBillingInfo, setCardInfo } from "../../store/slices/checkoutSlice";
import { setCardSecrets } from "../../store/slices/transactionSlice";
import { closeBillingModal } from "../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import {
  detectCardBrand,
  formatCardNumberInput,
  getMaxCardDigits,
} from "../../lib/validations";

const inputClassName =
  "h-12 rounded-2xl border-0 bg-[#f3f0ff] px-4 text-base text-[#1f1f2d] shadow-none placeholder:text-[#9b96b0] focus-visible:ring-2 focus-visible:ring-[#3525cd]/30";

const labelClassName =
  "text-[10px] font-extrabold tracking-[0.14em] text-[#6b6787]";

const isValidExpiry = (value: string) => {
  const [month, year] = value.split("/");
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  if (
    !month ||
    !year ||
    Number.isNaN(parsedMonth) ||
    Number.isNaN(parsedYear)
  ) {
    return false;
  }
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (parsedYear < currentYear) {
    return false;
  }
  if (parsedYear === currentYear && parsedMonth < currentMonth) {
    return false;
  }
  return true;
};

const billingSchema = z.object({
  fullName: z.string().min(1, "El nombre es obligatorio"),
  street: z.string().min(1, "La calle es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  postalCode: z
    .string()
    .min(4, "El código postal debe tener al menos 4 caracteres")
    .regex(/^\d+$/, "El código postal solo puede contener números"),
  cardholderName: z.string().min(1, "El nombre del titular es obligatorio"),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .refine((value) => {
      if (!/^\d+$/.test(value)) {
        return false;
      }
      const brand = detectCardBrand(value);
      if (brand === "AMEX") {
        return value.length === 15;
      }
      if (brand === "VISA" || brand === "MASTERCARD") {
        return value.length === 16;
      }
      return false;
    }, "Número de tarjeta inválido para Visa, Mastercard o Amex"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido. Usa MM/YY")
    .refine(
      (value) => isValidExpiry(value),
      "La fecha de expiración no es válida",
    ),
  cvv: z.string().regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
});

type BillingFormData = z.infer<typeof billingSchema>;

export default function BillingInfoModal() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const billingInfo = useAppSelector((state) => state.checkout.billingInfo);
  const cardInfo = useAppSelector((state) => state.checkout.cardInfo);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: billingInfo.fullName,
      street: billingInfo.street,
      city: billingInfo.city,
      postalCode: billingInfo.postalCode,
      cardholderName: cardInfo.cardholderName,
      cardNumber: "",
      expiry:
        cardInfo.expMonth && cardInfo.expYear
          ? `${cardInfo.expMonth}/${cardInfo.expYear.slice(-2)}`
          : "",
      cvv: "",
    },
  });

  const onSubmit = (data: BillingFormData) => {
    const normalizedCardNumber = data.cardNumber.replace(/\s+/g, "");
    const [expMonth, expYear] = data.expiry.split("/");
    const detectedBrand = detectCardBrand(normalizedCardNumber);

    dispatch(
      setBillingInfo({
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
      }),
    );
    dispatch(
      setCardInfo({
        cardholderName: data.cardholderName,
        brand: detectedBrand,
        last4: normalizedCardNumber.slice(-4),
        expMonth,
        expYear,
      }),
    );
    dispatch(
      setCardSecrets({
        cardNumber: normalizedCardNumber,
        cvv: data.cvv,
      }),
    );
    dispatch(closeBillingModal());
    navigate("/checkout");
  };

  const watchedCardNumber = useWatch({ control, name: "cardNumber" });
  const detectedBrand = detectCardBrand(watchedCardNumber ?? "");

  const handleCardNumberChange = (value: string) => {
    const rawDigits = value.replace(/\D/g, "");
    const maxDigits = getMaxCardDigits(rawDigits);
    const digitsOnly = rawDigits.slice(0, maxDigits);
    const formattedValue = formatCardNumberInput(digitsOnly);
    setValue("cardNumber", formattedValue, { shouldValidate: true });
  };

  const handleExpiryChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    const formattedValue =
      digitsOnly.length > 2
        ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        : digitsOnly;

    setValue("expiry", formattedValue, { shouldValidate: true });
  };

  const handleCvvChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    setValue("cvv", digitsOnly, { shouldValidate: true });
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
                <CreditCardIcon
                  className="size-5 text-primary"
                  aria-hidden
                  strokeWidth={2}
                />
              </div>
              <h2 className="text-base font-extrabold text-[#201f31]">
                Información de Tarjeta
              </h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholder-name" className={labelClassName}>
                NOMBRE DEL TITULAR
              </Label>
              <Input
                id="cardholder-name"
                autoComplete="name"
                aria-invalid={!!errors.cardholderName}
                className={cn(
                  inputClassName,
                  errors.cardholderName && "ring-2 ring-destructive/30",
                )}
                {...register("cardholderName")}
              />
              {errors.cardholderName && (
                <p className="text-xs text-destructive">
                  {errors.cardholderName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number" className={labelClassName}>
                NUMERO DE TARJETA
              </Label>
              <Input
                id="card-number"
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
                placeholder="4242 4242 4242 4242"
                aria-invalid={!!errors.cardNumber}
                className={cn(
                  inputClassName,
                  errors.cardNumber && "ring-2 ring-destructive/30",
                )}
                {...register("cardNumber", {
                  onChange: (event) =>
                    handleCardNumberChange(event.target.value),
                })}
              />
              {detectedBrand && (
                <p className="text-[11px] font-semibold text-[#4b3fb9]">
                  Marca detectada: {detectedBrand}
                </p>
              )}
              {errors.cardNumber && (
                <p className="text-xs text-destructive">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="card-expiry" className={labelClassName}>
                  EXPIRACION
                </Label>
                <Input
                  id="card-expiry"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="MM/YY"
                  aria-invalid={!!errors.expiry}
                  className={cn(
                    inputClassName,
                    errors.expiry && "ring-2 ring-destructive/30",
                  )}
                  {...register("expiry", {
                    onChange: (event) => handleExpiryChange(event.target.value),
                  })}
                />
                {errors.expiry && (
                  <p className="text-xs text-destructive">
                    {errors.expiry.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv" className={labelClassName}>
                  CVV
                </Label>
                <Input
                  id="card-cvv"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="123"
                  aria-invalid={!!errors.cvv}
                  className={cn(
                    inputClassName,
                    errors.cvv && "ring-2 ring-destructive/30",
                  )}
                  {...register("cvv", {
                    onChange: (event) => handleCvvChange(event.target.value),
                  })}
                />
                {errors.cvv && (
                  <p className="text-xs text-destructive">
                    {errors.cvv.message}
                  </p>
                )}
              </div>
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
              disabled={!isValid}
              aria-disabled={!isValid}
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
