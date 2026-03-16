"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UpgradeOverlayProps {
  hospitalName: string;
  subscriptionStatus: string;
  nextBillingDate?: string | null;
}

export default function UpgradeOverlay({
  hospitalName,
  subscriptionStatus,
  nextBillingDate
}: UpgradeOverlayProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          amount: 1, // KES 1 for sandbox testing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      // Extract checkoutRequestId from the payment object
      const requestId = data.payment?.checkoutRequestId;
      
      if (!requestId) {
        throw new Error("No checkout request ID received from payment server");
      }

      setCheckoutRequestId(requestId);
      setSuccess(true);

      // Poll for payment status
      pollPaymentStatus(requestId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (requestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 1 minute (every 2 seconds)

    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`/api/payments/status?checkoutRequestId=${requestId}`);
        const data = await response.json();

        if (data.status === "SUCCESS") {
          clearInterval(interval);
          // Reload the page to reflect new subscription status
          window.location.reload();
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setError("Payment failed. Please try again.");
          setSuccess(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setError("Payment verification timeout. Please contact support.");
          setSuccess(false);
        }
      } catch (err) {
        console.error("Payment status check error:", err);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(28,16,15,0.65)", backdropFilter: "blur(8px)" }}>
      <div className="relative mx-4 max-w-lg w-full rounded-2xl overflow-hidden" style={{ backgroundColor: "#FDFAF5", border: "1px solid rgba(107,39,55,0.15)" }}>
        <div className="p-8 md:p-10">

          <div className="mb-8">
            <p className="text-xs font-bold uppercase mb-2" style={{ color: "#C1614A", letterSpacing: "0.2em" }}>Subscription Required</p>
            <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", color: "#6B2737", letterSpacing: "-0.025em" }}>
              Activate your
              <br />
              <em>care plan.</em>
            </h2>
          </div>

          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#7A5C58" }}>Clinic:</span>
              <span className="text-sm font-semibold" style={{ color: "#1C100F" }}>{hospitalName}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#7A5C58" }}>Status:</span>
              <span className={`text-sm font-bold ${
                subscriptionStatus === 'ACTIVE' ? 'text-green-600' :
                subscriptionStatus === 'EXPIRED' ? 'text-red-600' :
                'text-orange-600'
              }`}>
                {subscriptionStatus}
              </span>
            </div>
            {nextBillingDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#7A5C58" }}>Next Billing:</span>
                <span className="text-sm" style={{ color: "#1C100F" }}>{new Date(nextBillingDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#7A5C58", fontWeight: 300 }}>
            Your subscription has {subscriptionStatus === 'EXPIRED' ? 'expired' : 'not been activated'}. 
            Please complete the payment to access all features and continue managing patient data.
          </p>

          {success ? (
            <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.15)" }}>
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-base font-semibold" style={{ color: "#6B2737" }}>Payment Request Sent!</h3>
              </div>
              <p className="text-sm mb-2" style={{ color: "#7A5C58" }}>
                Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
              </p>
              <p className="text-xs" style={{ color: "#7A5C58" }}>
                Waiting for payment confirmation...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#6B2737" }}></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              {error && (
                <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Payment Form */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1C100F" }}>
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0712345678 or +254712345678"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.2)", color: "#1C100F" }}
                  required
                  disabled={loading}
                />
                  <p className="mt-2 text-xs" style={{ color: "#7A5C58" }}>
                  You will receive an STK push prompt on this number
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#7A5C58" }}>Amount:</span>
                  <span className="text-2xl font-bold font-display" style={{ color: "#6B2737" }}>KES 1.00</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#7A5C58" }}>Sandbox test amount</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !phoneNumber}
                className="w-full py-4 px-6 rounded-full font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Pay Now via M-Pesa"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(107,39,55,0.1)" }}>
            <p className="text-xs" style={{ color: "#7A5C58" }}>Need help? Contact support at support@uzazicare.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
