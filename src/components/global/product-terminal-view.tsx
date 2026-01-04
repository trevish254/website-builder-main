'use client'
import React, { useState } from 'react'
import { Product, ProductVariant } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
    ChevronLeft,
    CreditCard,
    Smartphone,
    Lock,
    X,
    Plus,
    Minus,
    Tag,
    Info,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Loader2,
    Share2,
    Download,
    ShoppingBag,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { processCheckout, submitPaymentOtp } from '@/lib/paystack/checkout-action'
import { toast } from '@/components/ui/use-toast'

interface ProductWithVariants extends Product {
    ProductVariant: ProductVariant[]
}

interface ProductTerminalViewProps {
    product: ProductWithVariants
}

const ProductTerminalView: React.FC<ProductTerminalViewProps> = ({ product }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial state from search params
    const initialQuantity = parseInt(searchParams.get('qty') || '1')
    const initialColor = searchParams.get('color') || ''
    const initialSize = searchParams.get('size') || ''

    const [quantity, setQuantity] = useState(initialQuantity)
    const [selectedColor, setSelectedColor] = useState(initialColor)
    const [selectedSize, setSelectedSize] = useState(initialSize)

    const price = Number(product.price)
    const tax = price * 0.16
    const shipping = 0 // Free shipping in this simulation
    const subtotal = price * quantity
    const total = subtotal + tax + shipping

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card')
    const [loading, setLoading] = useState(false)
    const [otpRequired, setOtpRequired] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [otpValue, setOtpValue] = useState('')
    const [reference, setReference] = useState('')
    const [paymentDetails, setPaymentDetails] = useState<any>(null)
    const [showShareOptions, setShowShareOptions] = useState(false)

    // Form data state
    const [email, setEmail] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [phone, setPhone] = useState('')

    // Formatting Helpers
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16)
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value
        setCardNumber(formatted)
    }

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4)
        let formatted = value
        if (value.length > 2) {
            formatted = value.substring(0, 2) + ' / ' + value.substring(2, 4)
        }
        setExpiry(formatted)
    }

    const handleDownloadPdf = () => {
        // High-quality fallback for PDF: triggering Print window
        // Users can then "Save as PDF" which preserves all styling and fonts
        window.print()
        toast({ title: "Receipt Ready", description: "Use 'Save as PDF' in the print menu for your records." })
    }

    const handleSocialShare = (platform: 'facebook' | 'instagram' | 'twitter') => {
        const url = window.location.href
        const text = `I just ordered ${product.name} on Capabiz! Check it out.`
        let shareUrl = ''

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                break
            case 'instagram':
                // Instagram doesn't support direct URL sharing via href easily for feed, 
                // but we can point them to the app or copy to clipboard
                navigator.clipboard.writeText(url)
                toast({ title: "Link Copied", description: "Instagram doesn't support direct web sharing. Link copied to clipboard!" })
                return
        }

        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400')
    }

    const handlePayment = async () => {
        if (!email) {
            toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            let cardData = undefined
            if (paymentMethod === 'card') {
                const [month, year] = expiry.split('/').map(v => v.trim())
                cardData = {
                    number: cardNumber.replace(/\s/g, ''),
                    cvv: cvc,
                    expiry_month: month,
                    expiry_year: year
                }
            }

            const result = await processCheckout({
                email,
                amount: total,
                productId: product.id,
                productName: product.name,
                quantity,
                cardData,
                paymentMethod,
                phone: phone.replace(/\s/g, '')
            })

            if (result.status) {
                if (result.data?.status === 'send_otp') {
                    setOtpRequired(true)
                    setReference(result.data.reference)
                    toast({ title: "OTP Required", description: "Please enter the OTP sent to your device." })
                } else if (result.data?.status === 'success' || result.data?.status === 'send_pin') {
                    setPaymentDetails(result.data)
                    setPaymentSuccess(true)
                    toast({ title: "Payment Successful", description: "Your order has been placed successfully." })
                } else {
                    toast({ title: "Payment Result", description: result.message || "Something went wrong" })
                }
            } else {
                toast({ title: "Payment Failed", description: result.message || "Unable to process payment", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async () => {
        setLoading(true)
        try {
            const result = await submitPaymentOtp(otpValue, reference)
            if (result.status && (result.data?.status === 'success' || result.status === true)) {
                setPaymentDetails(result.data)
                setOtpRequired(false)
                setPaymentSuccess(true)
                toast({ title: "Payment Successful", description: "OTP verified. Thank you!" })
            } else {
                toast({ title: "Verification Failed", description: result.message || "Invalid OTP", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "An error occurred during verification", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-0 md:p-4 lg:p-8">
            <div className="w-full max-w-[1400px] bg-white rounded-none md:rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row lg:h-[90vh] xl:h-[85vh] relative">

                {paymentSuccess ? (
                    <div className="w-full h-full flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">
                        {/* Success Left Sidebar: Order Details */}
                        <div className="lg:w-[40%] bg-emerald-500/5 border-r border-slate-100 p-8 lg:p-16 flex flex-col gap-10">
                            <div className="space-y-6 text-center lg:text-left">
                                <div className="h-20 w-20 bg-emerald-500 rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-500/20 mx-auto lg:mx-0">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Payment Successful!</h2>
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Order Reference: {reference || paymentDetails?.reference}</p>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Summary Card */}
                            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6">
                                <div className="flex gap-6">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-50 relative overflow-hidden flex-shrink-0 border border-slate-100">
                                        {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" />}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-black text-slate-900">{product.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase">{quantity} Items Ordered</p>
                                    </div>
                                </div>
                                <Separator className="bg-slate-50" />
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-bold opacity-60"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-sm font-bold opacity-60"><span>Shipping</span><span className="text-emerald-500">Free</span></div>
                                    <div className="flex justify-between text-lg font-black pt-2"><span>Total Paid</span><span className="text-primary tracking-tight">KES {total.toLocaleString()}</span></div>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-4">
                                <Button onClick={() => router.push(`/inventory-preview/${product.id}`)} variant="outline" className="h-14 rounded-2xl font-black uppercase tracking-widest gap-2 bg-white">
                                    <ShoppingBag className="h-4 w-4" />
                                    Keep Shopping
                                </Button>
                            </div>
                        </div>

                        {/* Success Right: Receipt & Actions */}
                        <div className="lg:w-[60%] p-8 lg:p-16 flex flex-col justify-center items-center gap-12 text-center">
                            <div className="max-w-[480px] space-y-8">
                                <div className="space-y-4">
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">Receipt Generated</Badge>
                                    <h4 className="text-2xl font-black text-slate-900">Thank you for your trust.</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">Your transaction has been verified and your order is now being processed. A detailed receipt has been sent to <span className="text-slate-900 font-bold">{email}</span>.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative">
                                    <Button onClick={handleDownloadPdf} className="h-16 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest flex items-center gap-2 group">
                                        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                                        Download PDF
                                    </Button>
                                    <div className="relative">
                                        <Button
                                            onClick={() => setShowShareOptions(!showShareOptions)}
                                            variant="outline"
                                            className={cn("w-full h-16 rounded-3xl border-slate-200 font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all", showShareOptions ? "bg-slate-100 border-slate-300" : "hover:bg-slate-50")}
                                        >
                                            <Share2 className="h-4 w-4" />
                                            Share Order
                                        </Button>

                                        {showShareOptions && (
                                            <div className="absolute top-20 right-0 left-0 bg-white rounded-3xl border border-slate-100 shadow-2xl p-4 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                                                <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                                                    <div className="h-12 w-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform"><Facebook className="h-6 w-6" /></div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">FB</span>
                                                </button>
                                                <button onClick={() => handleSocialShare('instagram')} className="flex flex-col items-center gap-2 group">
                                                    <div className="h-12 w-12 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center text-[#E4405F] group-hover:scale-110 transition-transform"><Instagram className="h-6 w-6" /></div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Insta</span>
                                                </button>
                                                <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-900/10 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform"><Twitter className="h-5 w-5" /></div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">X (Twitter)</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary transition-all"><Globe className="h-5 w-5" /></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Website</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500 transition-all"><Smartphone className="h-5 w-5" /></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Track App</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Loading/OTP Overlay */}
                        {(loading || otpRequired) && (
                            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                                <div className="max-w-md w-full p-10 bg-white rounded-[40px] shadow-2xl border border-slate-100 text-center flex flex-col gap-6">
                                    {otpRequired ? (
                                        <>
                                            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                                <Lock className="h-10 w-10" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">Enter OTP</h3>
                                            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">A verification code has been sent to your phone/email. Please enter it below.</p>
                                            <Input
                                                value={otpValue}
                                                onChange={(e) => setOtpValue(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                className="h-16 rounded-2xl text-center text-2xl font-black tracking-[0.5em] border-slate-200"
                                            />
                                            <Button onClick={handleOtpSubmit} disabled={loading} className="h-16 rounded-2xl font-black uppercase tracking-widest text-base">
                                                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Verify & Pay"}
                                            </Button>
                                            <button onClick={() => setOtpRequired(false)} className="text-xs font-bold text-slate-400 uppercase hover:text-slate-900 transition-colors">Cancel Payment</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <Loader2 className="h-20 w-20 animate-spin text-primary mx-auto opacity-20" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ShieldCheck className="h-10 w-10 text-primary" />
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">Securing Payment</h3>
                                            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight italic">Processing your transaction through encrypting channels...</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Normal Checkout Content */}
                        <div className="w-full h-full flex flex-col lg:flex-row">
                            {/* Left Side: Order Summary */}
                            <div className="lg:w-[38%] bg-slate-50/30 border-r border-slate-100 flex flex-col h-full overflow-hidden">
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                                    <div className="max-w-[380px] w-full mx-auto flex flex-col gap-10">
                                        <div className="flex items-center justify-between text-slate-400">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                                <button onClick={() => window.close()} className="hover:text-slate-900 transition-colors flex items-center gap-1">
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <span>Shopping Cart</span>
                                                <span className="text-slate-200">/</span>
                                                <span className="text-slate-900">Checkout</span>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-baseline gap-3">
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order Summary</h2>
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{quantity} items</span>
                                            </div>

                                            {/* Product Card */}
                                            <div className="relative group">
                                                <div className="flex gap-8 p-2">
                                                    <div className="h-40 w-40 rounded-[32px] bg-white shadow-sm border border-slate-100 relative overflow-hidden flex-shrink-0">
                                                        {product.images?.[0] ? (
                                                            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-3" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-slate-50"><Globe className="h-6 w-6 text-slate-200" /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-1">
                                                        <div className="space-y-1">
                                                            <h3 className="font-black text-lg text-slate-900 leading-tight truncate max-w-[200px]">{product.name}</h3>
                                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{product.category || 'Standard Edition'}</p>
                                                            <div className="flex flex-wrap gap-2 pt-2">
                                                                {selectedColor && <Badge variant="outline" className="rounded-lg bg-white border-slate-100 text-[9px] font-black uppercase px-2 py-0.5">{selectedColor}</Badge>}
                                                                {selectedSize && <Badge variant="outline" className="rounded-lg bg-white border-slate-100 text-[9px] font-black uppercase px-2 py-0.5">{selectedSize}</Badge>}
                                                                <div className="flex items-center gap-2 bg-slate-100/50 rounded-lg px-2 py-0.5">
                                                                    <span className="text-[9px] font-black text-slate-400">QTY</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-slate-900"><Minus className="h-2.5 w-2.5" /></button>
                                                                        <span className="text-[10px] font-black w-3 text-center">{quantity}</span>
                                                                        <button onClick={() => setQuantity(quantity + 1)} className="hover:text-slate-900"><Plus className="h-2.5 w-2.5" /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">KES {price.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Calculation Summary */}
                                            <div className="space-y-4 pt-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Subtotal</span>
                                                    <span className="text-sm font-black text-slate-900">KES {subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Shipping</span>
                                                    <span className="text-sm font-black text-emerald-500 uppercase tracking-tighter italic font-black">Free</span>
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <div className="flex items-center gap-1.5"><span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Tax</span><Info className="h-3 w-3 text-slate-300" /></div>
                                                    <span className="text-sm font-black text-slate-900">KES {tax.toLocaleString()}</span>
                                                </div>
                                                <Separator className="bg-slate-100" />
                                                <div className="flex justify-between items-center px-1 pt-2">
                                                    <span className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Total</span>
                                                    <span className="text-2xl font-black text-primary leading-none tracking-tight">KES {total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Payment Details */}
                            <div className="lg:w-[62%] bg-white flex flex-col h-full overflow-hidden">
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-14">
                                    <div className="max-w-[540px] w-full mx-auto flex flex-col gap-10">
                                        <div className="space-y-10">
                                            {/* Payment Method Icons */}
                                            <div className="grid grid-cols-4 gap-4">
                                                <div onClick={() => setPaymentMethod('card')} className={cn("flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer h-20", paymentMethod === 'card' ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 grayscale opacity-50")}>
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 line-clamp-1">Card</span>
                                                </div>
                                                <div className={cn("flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all h-20 grayscale opacity-50 border-slate-100 cursor-not-allowed bg-slate-50/10")}>
                                                    <div className="relative h-6 w-12"><Image src="/icons/apple-pay.png" alt="Apple Pay" fill className="object-contain" /></div>
                                                    <span className="text-[8px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">Apple Pay</span>
                                                </div>
                                                <div className={cn("flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all h-20 grayscale opacity-50 border-slate-100 cursor-not-allowed bg-slate-50/10")}>
                                                    <div className="relative h-6 w-12"><Image src="/icons/google-pay.png" alt="Google Pay" fill className="object-contain" /></div>
                                                    <span className="text-[8px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">Google Pay</span>
                                                </div>
                                                <div onClick={() => setPaymentMethod('mpesa')} className={cn("flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer h-20 overflow-hidden", paymentMethod === 'mpesa' ? "border-[#49aa47] bg-[#49aa47]/5 shadow-sm" : "border-slate-100 grayscale opacity-50")}>
                                                    <div className="relative h-12 w-24"><Image src="/icons/mpesa-long.png" alt="M-Pesa" fill className="object-contain" /></div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
                                                <div className="flex items-center gap-2"><Lock className="h-3 w-3" /> Secure payment link</div>
                                                <button className="hover:text-slate-900">Learn more</button>
                                            </div>

                                            {/* Payment Form */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email address</Label>
                                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jenny@example.com" className="h-14 rounded-2xl border-slate-100 focus:ring-primary/20 bg-slate-50/50 font-bold" />
                                                </div>

                                                {paymentMethod === 'card' ? (
                                                    <>
                                                        <div className="md:col-span-2 space-y-2">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Card number</Label>
                                                            <div className="relative">
                                                                <Input value={cardNumber} onChange={handleCardNumberChange} placeholder="1234 1234 1234 1234" maxLength={19} className="h-14 rounded-2xl border-slate-100 focus:ring-primary/20 bg-slate-50/50 font-bold font-mono tracking-widest pr-14" />
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40"><span className="text-[8px] font-black border border-slate-900 px-1 py-0.5 rounded leading-none">VISA</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Expiration date</Label>
                                                            <Input value={expiry} onChange={handleExpiryChange} placeholder="MM / YY" maxLength={7} className="h-14 rounded-2xl border-slate-100 focus:ring-primary/20 bg-slate-50/50 font-bold" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Security code</Label>
                                                            <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" className="h-14 rounded-2xl border-slate-100 focus:ring-primary/20 bg-slate-50/50 font-bold" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#49aa47] px-1">M-Pesa Phone Number</Label>
                                                        <div className="relative">
                                                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254 7XX XXX XXX" className="h-14 rounded-2xl border-[#49aa47]/20 focus:ring-[#49aa47]/10 bg-green-50/10 font-black text-lg tracking-widest pl-12" />
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</div>
                                                        </div>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase italic px-1 pt-1">A prompt will be sent to this number</p>
                                                    </div>
                                                )}

                                                <div className="md:col-span-2 space-y-2 pt-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Billing Address (Optional)</Label>
                                                    <div className="space-y-3">
                                                        <Input placeholder="Address line" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter"><span className="text-slate-400">Subtotal</span><span className="text-slate-900 font-black">KES {subtotal.toLocaleString()}</span></div>
                                                    <div className="flex justify-between text-sm pt-1"><span className="text-slate-900 font-black uppercase tracking-widest">Total</span><span className="text-xl font-black text-primary">KES {total.toLocaleString()}</span></div>
                                                </div>

                                                <Button onClick={handlePayment} disabled={loading} className="w-full h-16 rounded-[22px] bg-primary text-white font-black text-base uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group">
                                                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Pay KES {total.toLocaleString()} <div className="h-6 w-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Lock className="h-3.5 w-3.5 fill-current" /></div></>}
                                                </Button>

                                                <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest py-2">
                                                    <div className="flex items-center gap-1.5 grayscale opacity-50"><CheckCircle2 className="h-3 w-3" /> Powered by Capabiz</div>
                                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                    <button className="hover:text-slate-500 transition-colors">Terms</button>
                                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                    <button className="hover:text-slate-500 transition-colors">Privacy</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Guaranteed Badges */}
            <div className="flex items-center justify-center gap-8 mt-10">
                <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    <div className="flex flex-col"><span className="text-[10px] font-black text-slate-900 leading-none">SECURE PAY</span><span className="text-[10px] font-black text-slate-400 leading-none">ENCRYPTED</span></div>
                </div>
                <div className="flex items-center gap-3 grayscale opacity-30">
                    <CheckCircle2 className="h-6 w-6 text-blue-500" />
                    <div className="flex flex-col"><span className="text-[10px] font-black text-slate-900 leading-none">VERIFIED</span><span className="text-[10px] font-black text-slate-400 leading-none">CHAPABIZ PROTECT</span></div>
                </div>
            </div>
        </div>
    )
}

export default ProductTerminalView
