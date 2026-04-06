"use client";

import { useState } from "react";
import { MapPin, Navigation, Car, Wrench, User, Mail, Phone, MessageSquare, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Contact Details",
    fields: [
      { id: "fullName", label: "Full Name", placeholder: "John Smith", icon: User, type: "text", required: true },
      { id: "email", label: "E-Mail Address", placeholder: "john@example.com", icon: Mail, type: "email", required: true },
      { id: "phone", label: "Phone", placeholder: "+44 7700 000000", icon: Phone, type: "tel", required: true },
    ],
  },
  {
    number: "02",
    label: "Order Details",
    fields: [
      { id: "pickup", label: "Vehicle Pickup Location", placeholder: "e.g. Accra, Ghana", icon: MapPin, type: "text", required: true },
      { id: "delivery", label: "Delivery Point", placeholder: "e.g. Tema, Ghana", icon: Navigation, type: "text", required: true },
      { id: "carModel", label: "Car Make and Model", placeholder: "e.g. BMW 3 Series", icon: Car, type: "text", required: true },
      { id: "condition", label: "Vehicle Condition", placeholder: "e.g. Running, Non-runner, Damaged", icon: Wrench, type: "text", required: true },
    ],
  },
  {
    number: "03",
    label: "Additional Info",
    fields: [
      { id: "message", label: "Message", placeholder: "Any additional details, special requirements, or questions…", icon: MessageSquare, type: "textarea", required: true },
    ],
  },
];

export function QuoteForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://formspree.io/f/xanwpqko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="quote"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #c5e8f7 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0ea5c9] mb-3">
            Get a Quote
          </p>
          <h2
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em" }}
            className="text-4xl md:text-5xl font-bold text-[#0f2d44] leading-tight"
          >
            Order Vehicle Transport
          </h2>
          <p className="mt-5 text-base text-[#4a6b82] max-w-xl mx-auto leading-relaxed">
            Fill out the form below and we'll contact you with a quote and transport options for your vehicle.
          </p>
        </div>

        {/* Form Card */}
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e0f7ff] flex items-center justify-center mx-auto mb-6">
              <Send className="w-7 h-7 text-[#0ea5c9]" />
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-2xl font-bold text-[#0f2d44] mb-3">
              Message Sent!
            </h3>
            <p className="text-[#4a6b82]">
              Thank you for your enquiry. Our team will be in touch shortly with your quote.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({}); }}
              className="mt-8 px-6 py-2.5 rounded-full border border-[#0ea5c9] text-[#0ea5c9] text-sm font-medium hover:bg-[#0ea5c9] hover:text-white transition-colors duration-200"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {steps.map((step, si) => (
              <div
                key={step.number}
                className={`px-8 py-9 ${si < steps.length - 1 ? "border-b border-[#e8f2f8]" : ""}`}
              >
                {/* Step header */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-11 h-11 rounded-full border-2 border-[#0ea5c9] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#0ea5c9]">{step.number}</span>
                  </div>
                  <h3
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    className="text-xl font-bold text-[#0f2d44]"
                  >
                    {step.label}
                  </h3>
                </div>

                {/* Fields */}
                <div
                  className={`grid gap-5 ${
                    step.fields.length === 1
                      ? "grid-cols-1"
                      : step.fields.length === 4
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-3"
                  }`}
                >
                  {step.fields.map((field) => {
                    const isFocused = focused === field.id;
                    const hasValue = !!formData[field.id];
                    const Icon = field.icon;

                    return (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#7a9ab0]">
                          {field.label}
                          {field.required && <span className="text-[#0ea5c9] ml-0.5">*</span>}
                        </label>

                        <div className="relative">
                          <Icon
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                              field.type === "textarea" ? "top-4 translate-y-0" : ""
                            } ${isFocused || hasValue ? "text-[#0ea5c9]" : "text-[#b0c8d8]"}`}
                          />

                          {field.type === "textarea" ? (
                            <textarea
                              id={field.id}
                              placeholder={field.placeholder}
                              value={formData[field.id] || ""}
                              required={field.required}
                              rows={4}
                              onFocus={() => setFocused(field.id)}
                              onBlur={() => setFocused(null)}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              className="w-full pl-9 pr-4 pt-3 pb-3 rounded-lg border text-sm text-[#0f2d44] placeholder-[#b0c8d8] bg-[#f7fbfd] resize-none outline-none transition-all duration-200"
                              style={{
                                borderColor: isFocused ? "#0ea5c9" : "#d6e8f2",
                                boxShadow: isFocused ? "0 0 0 3px rgba(14,165,201,0.12)" : "none",
                              }}
                            />
                          ) : (
                            <input
                              id={field.id}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.id] || ""}
                              required={field.required}
                              onFocus={() => setFocused(field.id)}
                              onBlur={() => setFocused(null)}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                              className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm text-[#0f2d44] placeholder-[#b0c8d8] bg-[#f7fbfd] outline-none transition-all duration-200"
                              style={{
                                borderColor: isFocused ? "#0ea5c9" : "#d6e8f2",
                                boxShadow: isFocused ? "0 0 0 3px rgba(14,165,201,0.12)" : "none",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Error message */}
            {error && (
              <div className="mx-8 mb-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Consent + Submit */}
            <div className="px-8 pb-10 pt-4 bg-[#f7fbfd] flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <p className="text-[11px] text-[#7a9ab0] leading-relaxed flex-1">
                I declare that I agree to the processing of my personal data for the purpose of and to the extent necessary to carry out the transport service I have described in this form.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#0ea5c9] hover:bg-[#0991b3] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-200"
                style={{ boxShadow: "0 4px 20px rgba(14,165,201,0.35)" }}
              >
                {isLoading ? "Sending…" : "Send a Message"}
                <Send className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
      `}</style>
    </section>
  );
}