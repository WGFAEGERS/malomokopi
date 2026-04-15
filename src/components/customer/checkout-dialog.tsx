"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import {
  User,
  Phone,
  Hash,
  QrCode,
  Upload,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ImageIcon,
  X,
} from "lucide-react";
import type { CartItem, CustomerInfo } from "@/actions/orders";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  total: number;
  onConfirm: (customerInfo: CustomerInfo) => void;
  isSubmitting: boolean;
};

const STEPS = [
  { id: 1, title: "Data Pemesan", icon: User },
  { id: 2, title: "Scan & Bayar", icon: QrCode },
  { id: 3, title: "Upload Bukti", icon: Upload },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CheckoutDialog({
  open,
  onOpenChange,
  items,
  total,
  onConfirm,
  isSubmitting,
}: Props) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setStep(1);
    setCustomerName("");
    setCustomerPhone("");
    setTableNumber("");
    setPaymentProof(null);
    setProofFileName("");
  }, []);

  function handleOpenChange(open: boolean) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan.");
      return;
    }

    setProofFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement("img");
      img.onload = () => {
        // Resize if needed (max 1200px width)
        const maxWidth = 1200;
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPaymentProof(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!paymentProof) return;
    onConfirm({
      customerName,
      customerPhone,
      tableNumber,
      paymentProofUrl: paymentProof,
    });
  }

  const canGoStep2 =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    tableNumber.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      step >= s.id
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-semibold tracking-wide ${
                      step >= s.id
                        ? "text-primary"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-full -mt-4 mx-1 rounded-full transition-colors duration-300 ${
                      step > s.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* ── STEP 1: Data Pemesan ── */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Pesanan ({items.length} item)
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatPrice(total)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="checkout-name"
                    className="text-sm font-semibold flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="checkout-name"
                    placeholder="Masukkan nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-11 rounded-xl"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="checkout-phone"
                    className="text-sm font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    No. Telepon / WhatsApp
                  </Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="checkout-table"
                    className="text-sm font-semibold flex items-center gap-1.5"
                  >
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    Nomor Meja
                  </Label>
                  <Input
                    id="checkout-table"
                    placeholder="Contoh: 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Scan & Bayar ── */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Total yang harus dibayar
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-primary">
                  {formatPrice(total)}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/50 mb-4">
                  <Image
                    src="/barcode.jpeg"
                    alt="Barcode Pembayaran"
                    width={240}
                    height={240}
                    className="rounded-lg"
                  />
                </div>
                <p className="text-sm font-semibold text-center text-foreground">
                  Scan QR Code di atas
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1 max-w-[300px]">
                  Gunakan aplikasi e-wallet atau m-banking Anda (QRIS, GoPay,
                  OVO, Dana, BCA Mobile, dll) untuk membayar.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                <p className="text-xs text-amber-800 dark:text-amber-200 font-medium text-center">
                  ⚠️ Pastikan nominal yang ditransfer sesuai dengan total
                  tagihan. Setelah pembayaran berhasil, lanjut ke langkah
                  berikutnya untuk upload bukti.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Upload Bukti ── */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Upload Screenshot Bukti Pembayaran
                </p>
                <p className="text-xs text-muted-foreground">
                  Foto/screenshot halaman pembayaran sukses dari aplikasi Anda
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {paymentProof ? (
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                    <img
                      src={paymentProof}
                      alt="Bukti Pembayaran"
                      className="w-full max-h-[300px] object-contain bg-muted/30"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">
                        {proofFileName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setPaymentProof(null);
                        setProofFileName("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      Ganti
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Tap untuk pilih foto
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      JPG, PNG — Maks 5MB
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="p-6 pt-0 flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl font-medium"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
          )}

          {step === 1 && (
            <Button
              className="flex-1 h-12 rounded-xl font-bold gradient-primary text-white shadow-sm hover:opacity-90 transition-opacity"
              onClick={() => setStep(2)}
              disabled={!canGoStep2}
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 2 && (
            <Button
              className="flex-1 h-12 rounded-xl font-bold gradient-primary text-white shadow-sm hover:opacity-90 transition-opacity"
              onClick={() => setStep(3)}
            >
              Sudah Bayar, Upload Bukti
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 3 && (
            <Button
              className="flex-1 h-12 rounded-xl font-bold gradient-primary text-white shadow-sm hover:opacity-90 transition-opacity"
              onClick={handleSubmit}
              disabled={!paymentProof || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Konfirmasi Pembayaran
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
