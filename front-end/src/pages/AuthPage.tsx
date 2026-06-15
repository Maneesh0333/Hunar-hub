import { useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Verify from "../components/Auth/Verify";
import Stepper, { type Step } from "../components/Auth/Stepper";
import { useAuthStore } from "../stores/authStore";
import { Link, Navigate, useLocation } from "react-router-dom";
import SEO from "../components/Shared/SEO";

const steps: Step[] = ["Details", "Verify", "Done"];

export default function AuthPage() {
  const location = useLocation();
  const data = location.state;

  const [tab, setTab] = useState(data?.page || "login");
  const [role] = useState(data?.role || "User");
  const [currentStep, setCurrentStep] = useState<Step>("Details");
  const [email, setEmail] = useState("");

  const user = useAuthStore((state) => state.user);

  if (user) {
    switch (user?.role) {
      case "Admin":
        return <Navigate to="/admin" replace />;
      case "Entrepreneur":
        return <Navigate to="/entrepreneur" replace />;
      case "User":
        return <Navigate to="/home" replace />;
      default:
        return;
    }
  }

  return (
    <>
      <SEO
        title="Login or Register | HunarHub"
        description="Sign in to book services or manage your professional profile."
        url="https://hunar-hub-web.vercel.app/auth"
      />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans">
        {/* LEFT – Marketing / Visual */}
        <div
          className="
          hidden h-screen sticky top-0 lg:flex flex-col items-center justify-center gap-20
          px-12 py-10
          text-white
          bg-gradient-to-br from-[#3B1608] via-[#7A3212] to-[#C4632A]
          overflow-hidden
        "
        >
          <div className="space-y-6 relative z-10">
            <h1 className="font-playfair text-5xl leading-tight font-black">
              Discover <br />
              <span className="italic text-[#FFD6B8]">extraordinary</span>{" "}
              <br />
              artisans <br />
              near you.
            </h1>

            <p className="max-w-md text-sm text-white/80">
              Book verified tailors, potters, cobblers, weavers and more in your
              neighbourhood. Handcrafted quality, guaranteed.
            </p>

            <div className="mt-15 relative z-10 text-sm text-white/80">
              Joined by <span className="font-bold text-white">84,000+</span>{" "}
              happy customers across India
            </div>
          </div>
        </div>

        {/* RIGHT – Auth Form */}
        <div className="flex flex-col justify-center p-15 max-md:p-10 bg-[#FAF5ED]">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/home"
              className="font-playfair text-2xl font-black text-[var(--clay)]"
            >
              Hunar<span className="text-[var(--ink)]">Hub</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-xl p-1 border border-[rgba(196,99,42,0.15)] mb-8">
            {["login", "signup"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setTab(item);
                  setCurrentStep("Details");
                }}
                className={`flex-1 cursor-pointer py-2 text-sm font-semibold rounded-lg transition
                ${
                  tab === item
                    ? "bg-[#FAF5ED] text-[var(--clay)]"
                    : "text-[var(--earth)] hover:text-[var(--clay)]"
                }`}
              >
                {item === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <Login />
          ) : (
            <>
              <div className="mb-5">
                <Stepper steps={steps} currentStep={currentStep} />
              </div>

              {currentStep === "Details" && (
                <Register
                  setCurrentStep={setCurrentStep}
                  setEmail={setEmail}
                  role={role}
                />
              )}

              {currentStep === "Verify" && (
                <Verify setCurrentStep={setCurrentStep} email={email} />
              )}

              {currentStep === "Done" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-playfair text-3xl font-black mb-2">
                      🎉 You're all set!
                    </h3>
                    <p className="text-sm text-[var(--earth-mid)]">
                      Your account has been successfully created and verified.
                    </p>
                  </div>

                  <div className="bg-white border border-[rgba(196,99,42,0.15)] rounded-xl p-4 text-sm text-[var(--earth)]">
                    {role === "Entrepreneur" ? (
                      <>
                        You can now set up your profile, add services, and start
                        receiving bookings from customers near you.
                      </>
                    ) : (
                      <>
                        You can now explore local artisans and book services
                        tailored to your needs.
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setTab("login");
                      setCurrentStep("Details");
                    }}
                    className="w-full py-3 rounded-xl cursor-pointer bg-[var(--clay)] text-white font-semibold hover:opacity-90 transition"
                  >
                    Continue to Sign In →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
