import React, { useState } from "react";
import emailjs from "emailjs-com";

// Shared class strings (replace the old .cf-* CSS classes)
const labelCls =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[2.5px] text-[#a0a0a0]";

const fieldCls =
  "w-full box-border rounded-xl border-[1.5px] border-[#e8e6e0] bg-[#fafaf8] " +
  "font-['DM_Sans',sans-serif] text-sm text-[#1a1a1a] outline-none " +
  "transition-all duration-200 placeholder:text-[#b0aca4] " +
  "hover:border-[#c9943a] " +
  "focus:border-[#d4a843] focus:bg-white focus:ring-[3px] focus:ring-[#d4a843]/[0.12]";

const inputCls = `${fieldCls} h-[52px] px-[18px]`;
const textareaCls = `${fieldCls} min-h-[140px] resize-y px-[18px] py-4 leading-[1.7]`;

const ContactForm = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function sendEmail(e) {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        "service_addy4sj",
        "template_ff0z4pb",
        e.target,
        "gY_asaAKpxmYdIg29",
      )
      .then(() => {
        setSent(true);
        setSending(false);
        e.target.reset();
        setTimeout(() => setSent(false), 4000);
      })
      .catch((error) => {
        console.error("Error:", error.text);
        setSending(false);
        alert("Failed to send message. Please try again later.");
      });
  }

  return (
    <>
      {/* Only things Tailwind can't express inline: font import + fadeIn keyframes.
          (Better: move these into your global CSS / tailwind.config.) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="font-['DM_Sans',sans-serif]">
        {/* ── Header ── */}
        <div className="mb-10">
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="h-0.5 w-8 shrink-0 rounded-sm bg-gradient-to-r from-[#d4a843] to-[#f0c96a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[3px] text-[#d4a843]">
              Contact Us
            </span>
          </div>

          <h2 className="m-0 font-['Cormorant_Garamond',serif] text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.5px] text-[#0d1b2a]">
            Questions?
            <br />
            <em className="font-semibold italic text-[#1e3a5f]">
              Feel free to contact us.
            </em>
          </h2>
        </div>

        {/* ── Form card ── */}
        <div className="rounded-3xl border border-[#e8e6e0] bg-white p-6 shadow-[0_8px_40px_rgba(13,27,42,0.08)] sm:p-10">
          <form id="contact-form" onSubmit={sendEmail}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  className={inputCls}
                  type="text"
                  name="user_name"
                  required
                  placeholder="Nguyễn Văn A"
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  className={inputCls}
                  type="email"
                  name="user_email"
                  required
                  placeholder="example@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className={labelCls}>Subject</label>
                <input
                  className={inputCls}
                  type="text"
                  name="user_subject"
                  required
                  placeholder="How can we help?"
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  className={inputCls}
                  type="text"
                  name="user_phone"
                  required
                  placeholder="0901 234 567"
                />
              </div>

              {/* Message — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Message</label>
                <textarea
                  className={textareaCls}
                  name="user_message"
                  required
                  placeholder="Write your message here..."
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#d4a843] via-[#e8e6e0] via-60% to-transparent sm:col-span-2" />

              {/* Submit — full width */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 bg-gradient-to-br from-[#f0c96a] to-[#d4a843] px-6 py-[17px] font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-[1.8px] text-[#0d1b2a] shadow-[0_8px_28px_rgba(212,168,67,0.38)] transition-all duration-300 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_14px_40px_rgba(212,168,67,0.52)] active:enabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Success message */}
                {sent && (
                  <div className="mt-4 flex animate-[fadeIn_0.4s_ease] items-center gap-2.5 rounded-xl border border-[#34c759]/30 bg-[#34c759]/10 px-5 py-3.5 text-sm font-medium text-[#1a7a3a]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                <p className="mb-0 mt-3.5 text-center font-['DM_Sans',sans-serif] text-xs text-[#a0a0a0]">
                  🔒 Your information is kept strictly confidential
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
