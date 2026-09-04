import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PrintInvoiceButton from "@/components/student/PrintInvoiceButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { 
      id: id,
      studentId: session.user.id // Ensure they can only see their own orders
    },
    include: {
      package: true,
      student: true,
      payment: true,
      coupon: true
    }
  });

  if (!order) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-black text-primary font-playfair mb-4">Invoice Not Found</h1>
        <p className="text-primary/70 font-sans mb-8">We couldn't find the requested invoice or you don't have access to it.</p>
        <Link href="/student/subscriptions" className="text-accent font-bold hover:underline">Return to Subscriptions</Link>
      </div>
    );
  }

  let basePrice = order.package?.price || 0;
  let discountAmount = 0;
  
  if (order.coupon) {
    if (order.coupon.discountType === "PERCENTAGE") {
      discountAmount = (basePrice * order.coupon.discountValue) / 100;
    } else if (order.coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = order.coupon.discountValue;
    }
  }
  
  const expectedPreTaxAmount = Math.max(0, basePrice - discountAmount);
  const isIndianStudent = order.amount > expectedPreTaxAmount + 0.1;
  
  const preTaxAmount = isIndianStudent ? order.amount / 1.18 : order.amount;
  const gstAmount = isIndianStudent ? order.amount - preTaxAmount : 0;

  if (!order) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-black text-primary font-playfair mb-4">Invoice Not Found</h1>
        <p className="text-primary/70 font-sans mb-8">We couldn't find the requested invoice or you don't have access to it.</p>
        <Link href="/student/subscriptions" className="text-accent font-bold hover:underline">Return to Subscriptions</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Controls - Hidden when printing */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/student/subscriptions" className="flex items-center gap-2 text-primary/70 hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Subscriptions
          </Link>
          <PrintInvoiceButton />
        </div>

        {/* Invoice Paper */}
        <div className="bg-white p-10 sm:p-16 rounded-3xl shadow-xl border border-gray-100 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-secondary/20 pb-8 mb-10 gap-6">
            <div className="flex flex-col">
              <Image src={logoImg} alt="HD Clarity Logo" className="object-contain h-12 w-auto mb-4" priority />
              <h2 className="text-xl font-black text-primary font-playfair">HD Clarity Speech</h2>
              <p className="text-primary/70 text-sm mt-1">support@hdclarityspeech.com</p>
              <p className="text-primary/70 text-sm">www.hdclarityspeech.com</p>
            </div>
            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <h1 className="text-5xl font-black text-primary tracking-tight font-playfair mb-2">INVOICE</h1>
              <p className="text-primary/70 text-xs font-bold uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full inline-block">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">Billed To</p>
              <p className="font-bold text-primary">{order.student.name}</p>
              <p className="text-primary/70 text-sm">{order.student.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">Payment Details</p>
              <p className="text-primary/70 text-sm"><span className="font-bold text-primary">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-primary/70 text-sm"><span className="font-bold text-primary">Status:</span> <span className="text-green-600 font-bold">{order.status}</span></p>
              {order.payment && (
                <p className="text-primary/70 text-sm mt-1 text-[10px]"><span className="font-bold text-primary">Txn ID:</span> {order.payment.razorpayPaymentId || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left mb-12">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-3 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Description</th>
                <th className="py-3 text-[10px] font-bold text-primary/50 uppercase tracking-widest text-center">Sessions</th>
                <th className="py-3 text-[10px] font-bold text-primary/50 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-6">
                  <p className="font-bold text-primary">{order.package?.name || 'Custom'} Plan</p>
                  <p className="text-xs text-primary/60 mt-1">Valid for {order.package?.validityDays || 0} days</p>
                </td>
                <td className="py-6 text-center font-bold text-primary/80">{order.package?.totalSessions || 1}</td>
                <td className="py-6 text-right font-bold text-primary">${basePrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-3 border-b border-gray-100 text-sm text-primary/70">
                <span>Subtotal</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm text-primary/70">
                  <span>Discount</span>
                  <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {isIndianStudent ? (
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm text-primary/70">
                  <span>Tax (18% GST)</span>
                  <span>${gstAmount.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm text-primary/70">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
              )}
              <div className="flex justify-between py-4 text-xl font-black text-primary font-playfair">
                <span>Total Paid</span>
                <span className="text-accent">${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-secondary/20 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <p className="text-sm font-bold text-primary uppercase tracking-widest font-playfair mb-2">Thank you for investing in your speech journey!</p>
            <p className="text-xs text-primary/50 font-sans">If you have any questions about this invoice, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
