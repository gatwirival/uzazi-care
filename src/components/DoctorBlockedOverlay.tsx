"use client";

import { ShieldAlert, Phone, Mail, Building2 } from "lucide-react";

interface DoctorBlockedOverlayProps {
  hospitalName: string;
  subscriptionStatus: string;
}

export default function DoctorBlockedOverlay({
  hospitalName,
  subscriptionStatus,
}: DoctorBlockedOverlayProps) {
  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case "EXPIRED":
        return "The hospital's subscription has expired";
      case "SUSPENDED":
        return "The hospital account has been suspended";
      case "PENDING_PAYMENT":
        return "Payment is pending for the hospital";
      default:
        return "Access is currently restricted";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(28,16,15,0.65)", backdropFilter: "blur(8px)" }}>
      <div className="max-w-md w-full rounded-2xl overflow-hidden" style={{ backgroundColor: "#FDFAF5", border: "1px solid rgba(107,39,55,0.15)" }}>
        {/* Header */}
        <div className="p-8" style={{ backgroundColor: "#6B2737" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: "rgba(253,250,245,0.15)" }}
            >
              <ShieldAlert className="w-6 h-6" style={{ color: "#FDFAF5" }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase" style={{ color: "rgba(253,250,245,0.5)", letterSpacing: "0.18em" }}>Access Restricted</p>
              <h2 className="font-display font-bold text-xl" style={{ color: "#FDFAF5", letterSpacing: "-0.02em" }}>
                {getStatusMessage()}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hospital Info */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 text-base"
                style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#7A5C58" }}>Your Clinic</p>
                <p className="font-semibold text-sm" style={{ color: "#1C100F" }}>{hospitalName}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-1" style={{ color: "#1C100F" }}>What should you do?</p>
              <p className="text-sm leading-relaxed" style={{ color: "#7A5C58", fontWeight: 300 }}>
                Please contact your hospital administrator to resolve this issue.
                They need to renew the subscription to restore access.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#6B2737" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#1C100F" }}>Call your administrator</p>
                  <p className="text-xs" style={{ color: "#7A5C58" }}>Speak directly with your clinic admin</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#6B2737" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#1C100F" }}>Send an email</p>
                  <p className="text-xs" style={{ color: "#7A5C58" }}>Request subscription renewal via email</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4" style={{ borderTop: "1px solid rgba(107,39,55,0.1)" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.2)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#C1614A" }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#6B2737" }}></span>
              </span>
              <span className="text-sm font-semibold" style={{ color: "#6B2737" }}>
                Subscription {subscriptionStatus.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-xl p-3" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
            <p className="text-xs text-center" style={{ color: "#7A5C58" }}>
              <strong>Note:</strong> You cannot make payments directly. Only
              hospital administrators can renew subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
