import { useState, useEffect, useRef } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#161616",
  card: "#141414",
  cardBorder: "rgba(212,175,55,0.15)",
  gold: "#D4AF37",
  goldLight: "#F5D05B",
  goldDark: "#A88B1C",
  goldGlow: "rgba(212,175,55,0.2)",
  text: "#F5F0E8",
  textMuted: "#8A8580",
  textDim: "#4A4540",
  green: "#22C55E",
  red: "#EF4444",
  blue: "#3B82F6",
};

// ── Utility styles ─────────────────────────────────────────────────────────────
const css = {
  goldGrad: `linear-gradient(135deg, ${C.goldDark}, ${C.gold}, ${C.goldLight})`,
  cardGlass: `background: rgba(20,20,20,0.85); border: 1px solid ${C.cardBorder}; border-radius: 16px; backdrop-filter: blur(12px);`,
  glowText: `background: linear-gradient(135deg, ${C.gold}, ${C.goldLight}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`,
};

// ── Mock Data ──────────────────────────────────────────────────────────────────
const PLANS = [
  { id: 1, name: "Starter", duration: "7 Days", min: 500, max: 4999, daily: 1.5, total: 10.5, color: "#6B7280", icon: "🌱" },
  { id: 2, name: "Silver", duration: "15 Days", min: 5000, max: 19999, daily: 2.5, total: 37.5, color: "#94A3B8", icon: "🥈" },
  { id: 3, name: "Gold", duration: "30 Days", min: 20000, max: 49999, daily: 3.5, total: 105, color: C.gold, icon: "🥇" },
  { id: 4, name: "Platinum", duration: "60 Days", min: 50000, max: 199999, daily: 4.5, total: 270, color: "#7C3AED", icon: "💎" },
  { id: 5, name: "Elite", duration: "90 Days", min: 200000, max: 999999, daily: 6.0, total: 540, color: "#EF4444", icon: "👑" },
];

const VIP_LEVELS = [
  { level: 1, name: "VIP 1", refs: 20, premium: 0, perks: ["Priority support", "2% referral bonus"], color: "#6B7280" },
  { level: 2, name: "VIP 2", refs: 40, premium: 5, perks: ["3% referral bonus", "Early access"], color: "#94A3B8" },
  { level: 3, name: "VIP 3", refs: 50, premium: 10, perks: ["4% referral bonus", "Dedicated manager"], color: C.gold },
  { level: 4, name: "VIP 4", refs: 70, premium: 20, perks: ["5% referral bonus", "Exclusive events"], color: "#7C3AED" },
  { level: 5, name: "Grandmaster", refs: 100, premium: 50, perks: ["6% referral bonus", "Special badge"], color: "#EF4444" },
];

const MOCK_USER = {
  name: "Arjun Sharma",
  email: "arjun@example.com",
  uid: "IT-284792",
  vipLevel: 2,
  wallet: 47850,
  totalInvested: 120000,
  totalReturns: 18750,
  referralCount: 24,
  referralIncome: 6420,
  teamSize: 38,
  joinedBonus: 100,
  referralCode: "ARJUN2024",
  kycStatus: "verified",
};

const MOCK_TRANSACTIONS = [
  { id: 1, type: "deposit", amount: 25000, status: "success", date: "2025-05-28", desc: "Razorpay Deposit" },
  { id: 2, type: "invest", amount: 20000, status: "active", date: "2025-05-27", desc: "Gold Plan Investment" },
  { id: 3, type: "return", amount: 700, status: "credited", date: "2025-05-26", desc: "Daily Return - Gold" },
  { id: 4, type: "referral", amount: 500, status: "credited", date: "2025-05-25", desc: "Referral Bonus - Priya K." },
  { id: 5, type: "withdraw", amount: 10000, status: "pending", date: "2025-05-24", desc: "Bank Withdrawal" },
  { id: 6, type: "deposit", amount: 50000, status: "success", date: "2025-05-20", desc: "Razorpay Deposit" },
];

const TESTIMONIALS = [
  { name: "Priya K.", city: "Mumbai", text: "InfiTrade transformed my savings. The Gold plan returns are incredible!", rating: 5 },
  { name: "Rahul M.", city: "Delhi", text: "Transparent, reliable, and the support team is amazing. Highly recommend!", rating: 5 },
  { name: "Sneha P.", city: "Bangalore", text: "Earned my first ₹50,000 in just 3 months. The referral system is a bonus!", rating: 5 },
  { name: "Vikram S.", city: "Chennai", text: "Grandmaster level now thanks to the referral program. Life-changing platform!", rating: 5 },
];

const FAQS = [
  { q: "How do I start investing?", a: "Sign up, complete KYC, deposit funds via Razorpay, and choose an investment plan. It takes less than 5 minutes." },
  { q: "When do I receive daily returns?", a: "Daily returns are credited to your wallet every 24 hours automatically based on your active plan." },
  { q: "How does the referral system work?", a: "Share your unique referral link. When friends join and invest, you earn referral bonuses instantly." },
  { q: "How long does withdrawal take?", a: "Withdrawal requests are processed within 24-48 hours after admin approval directly to your bank account." },
  { q: "Is my investment safe?", a: "We use bank-grade security, JWT authentication, and follow strict AML/KYC policies to protect your funds." },
];

const ADMIN_STATS = {
  totalUsers: 48291,
  totalDeposits: 18420000,
  pendingWithdrawals: 142,
  activeInvestments: 12847,
  todayDeposits: 842000,
  todayWithdrawals: 320000,
};

// ── Reusable Components ────────────────────────────────────────────────────────

function GoldButton({ children, onClick, outline, small, fullWidth, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: outline ? "transparent" : css.goldGrad,
        border: `1.5px solid ${C.gold}`,
        color: outline ? C.gold : "#0A0A0A",
        fontWeight: 700,
        fontSize: small ? 13 : 15,
        padding: small ? "8px 18px" : "12px 28px",
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        letterSpacing: "0.03em",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.cardBorder}`,
      borderRadius: 14,
      padding: "16px 20px",
      minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: color || C.gold }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize: 24 }}>{icon}</div>}
      </div>
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      background: color ? `${color}22` : `${C.gold}22`,
      color: color || C.gold,
      border: `1px solid ${color || C.gold}44`,
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 10px",
      letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: C.bg2, border: `1px solid ${C.cardBorder}`,
        borderRadius: 20, padding: 28, maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: C.gold, fontSize: 18, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>{label}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", background: C.bg3, border: `1px solid ${C.cardBorder}`,
          borderRadius: 10, padding: "12px 16px", color: C.text, fontSize: 15,
          outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function AnimatedCounter({ target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = Date.now();
    const dur = 2000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(tick); observer.disconnect(); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [riskShown, setRiskShown] = useState(false);

  useEffect(() => {
    if (!riskShown) {
      const t = setTimeout(() => setRiskShown(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Sora', 'Inter', sans-serif" }}>
      {riskShown && (
        <Modal title="⚠️ Risk Disclaimer" onClose={() => setRiskShown(false)}>
          <p style={{ color: C.textMuted, lineHeight: 1.7, fontSize: 14 }}>
            Investment in financial products involves risk. The value of investments can go down as well as up and you may get back less than you invest. Past performance is not indicative of future results. InfiTrade does not provide financial advice. Please read our Risk Disclosure Policy before investing. Invest only what you can afford to lose.
          </p>
          <div style={{ marginTop: 20 }}>
            <GoldButton onClick={() => setRiskShown(false)} fullWidth>I Understand & Accept</GoldButton>
          </div>
        </Modal>
      )}

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.95)", borderBottom: `1px solid ${C.cardBorder}`,
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 900, ...goldTextStyle() }}>InfiTrade</span>
          <Badge>BETA</Badge>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <GoldButton outline small onClick={() => onNavigate("login")}>Login</GoldButton>
          <GoldButton small onClick={() => onNavigate("signup")}>Sign Up</GoldButton>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: `radial-gradient(ellipse at 50% 0%, ${C.goldGlow} 0%, transparent 70%), ${C.bg}`,
        padding: "80px 24px 60px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ marginBottom: 16 }}>
            <Badge>🏆 India's #1 Investment Platform</Badge>
          </div>
          <h1 style={{ fontSize: "clamp(32px,6vw,58px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 20px", ...goldTextStyle() }}>
            Invest Smart with InfiTrade
          </h1>
          <p style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
            Grow your wealth with India's most trusted investment platform. Earn daily returns up to 6% with transparent plans.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <GoldButton onClick={() => onNavigate("signup")}>Start Investing Now</GoldButton>
            <GoldButton outline onClick={() => onNavigate("plans")}>View Plans</GoldButton>
          </div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 60, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            {[
              { label: "Active Users", val: 48291, suf: "+" },
              { label: "Total Invested", val: 1842, pre: "₹", suf: "Cr" },
              { label: "Returns Paid", val: 98, suf: "%" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.gold }}>
                  <AnimatedCounter target={s.val} prefix={s.pre || ""} suffix={s.suf || ""} />
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle>Investment Plans</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} onInvest={() => onNavigate("signup")} />
          ))}
        </div>
      </section>

      {/* Referral Banner */}
      <section style={{ padding: "0 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: `linear-gradient(135deg, #1a1400, #2a2000, #1a1400)`,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 20, padding: "40px 32px",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center",
        }}>
          <div>
            <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 800, ...goldTextStyle() }}>Invite Friends & Earn Rewards</h2>
            <p style={{ color: C.textMuted, margin: "0 0 20px", maxWidth: 400, lineHeight: 1.6 }}>
              New users receive a ₹100 joining bonus. You earn referral income on every investment made by your team.
            </p>
            <GoldButton onClick={() => onNavigate("signup")}>Get Your Referral Link</GoldButton>
          </div>
          <div style={{ fontSize: 72, display: "none" }}>🎁</div>
        </div>
      </section>

      {/* VIP Levels */}
      <section style={{ padding: "0 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle>VIP Membership Levels</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {VIP_LEVELS.map(v => (
            <div key={v.level} style={{
              background: C.card, border: `1px solid ${v.color}44`,
              borderRadius: 14, padding: "20px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {v.level === 5 ? "👑" : ["🌿","🥈","🥇","💎"][v.level - 1]}
              </div>
              <div style={{ fontWeight: 700, color: v.color, marginBottom: 6 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
                {v.refs} active referrals{v.premium ? ` + ${v.premium} premium` : ""}
              </div>
              {v.perks.map(p => (
                <div key={p} style={{ fontSize: 11, color: C.textMuted, padding: "3px 0" }}>✓ {p}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "0 24px 60px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle>What Our Investors Say</SectionTitle>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 18, padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{"⭐".repeat(TESTIMONIALS[activeTestimonial].rating)}</div>
          <p style={{ fontSize: 16, color: C.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
            "{TESTIMONIALS[activeTestimonial].text}"
          </p>
          <div style={{ fontWeight: 700, color: C.gold }}>{TESTIMONIALS[activeTestimonial].name}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>{TESTIMONIALS[activeTestimonial].city}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? C.gold : C.textDim, border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 60px", maxWidth: 720, margin: "0 auto" }}>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ marginBottom: 10, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", color: C.text, fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
              {faq.q}
              <span style={{ color: C.gold }}>{activeFaq === i ? "−" : "+"}</span>
            </button>
            {activeFaq === i && (
              <div style={{ padding: "0 20px 16px", color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ background: C.bg2, borderTop: `1px solid ${C.cardBorder}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, ...goldTextStyle(), marginBottom: 12 }}>InfiTrade</div>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>India's premium investment platform. Secure, transparent, and profitable.</p>
          </div>
          <div>
            <div style={{ color: C.text, fontWeight: 700, marginBottom: 12 }}>Legal</div>
            {["Privacy Policy", "Terms & Conditions", "Risk Disclosure", "AML/KYC Policy"].map(l => (
              <div key={l} style={{ color: C.textMuted, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.text, fontWeight: 700, marginBottom: 12 }}>Support</div>
            <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 8 }}>📧 support@infitrade.in</div>
            <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 8 }}>📱 +91 98765 43210</div>
            <div style={{ color: C.textMuted, fontSize: 13 }}>⏰ 9AM - 9PM IST</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.cardBorder}`, paddingTop: 20, textAlign: "center", color: C.textDim, fontSize: 12 }}>
          © 2025 InfiTrade Pvt. Ltd. All rights reserved. | GSTIN: 27XXXXX1234X1ZY | CIN: U65100MH2025PTC123456<br />
          Investments are subject to market risks. Please read all scheme-related documents carefully.
        </div>
      </footer>
    </div>
  );
}

function AuthPage({ mode, onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", otp: "", referral: "" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const handle = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); if (isLogin) onNavigate("dashboard"); else if (step === 1) setStep(2); else onNavigate("dashboard"); }, 1500);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 24, padding: 40, width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 30, fontWeight: 900, ...goldTextStyle() }}>InfiTrade</div>
          <div style={{ color: C.textMuted, marginTop: 8, fontSize: 14 }}>
            {isLogin ? "Welcome back! Sign in to continue." : step === 1 ? "Create your account" : "Verify your mobile"}
          </div>
        </div>

        {isLogin ? (
          <>
            <Input label="Email or Mobile" value={form.email} onChange={handle("email")} placeholder="you@example.com" />
            <Input label="Password" type="password" value={form.password} onChange={handle("password")} placeholder="••••••••" />
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <span style={{ color: C.gold, fontSize: 13, cursor: "pointer" }}>Forgot Password?</span>
            </div>
          </>
        ) : step === 1 ? (
          <>
            <Input label="Full Name" value={form.name} onChange={handle("name")} placeholder="Arjun Sharma" />
            <Input label="Email Address" value={form.email} onChange={handle("email")} placeholder="you@example.com" />
            <Input label="Mobile Number" value={form.mobile} onChange={handle("mobile")} placeholder="+91 98765 43210" />
            <Input label="Password" type="password" value={form.password} onChange={handle("password")} placeholder="Create strong password" />
            <Input label="Referral Code (Optional)" value={form.referral} onChange={handle("referral")} placeholder="FRIEND123" />
          </>
        ) : (
          <>
            <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>
              OTP sent to {form.mobile}. Enter the 6-digit code below.
            </p>
            <Input label="Enter OTP" value={form.otp} onChange={handle("otp")} placeholder="123456" />
          </>
        )}

        <GoldButton onClick={submit} fullWidth disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Sign In" : step === 1 ? "Send OTP" : "Verify & Create Account"}
        </GoldButton>

        <div style={{ textAlign: "center", marginTop: 20, color: C.textMuted, fontSize: 14 }}>
          {isLogin ? (
            <>Don't have an account? <span style={{ color: C.gold, cursor: "pointer" }} onClick={() => onNavigate("signup")}>Sign Up</span></>
          ) : (
            <>Already have an account? <span style={{ color: C.gold, cursor: "pointer" }} onClick={() => onNavigate("login")}>Sign In</span></>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositStep, setDepositStep] = useState(1);
  const user = MOCK_USER;

  const vipInfo = VIP_LEVELS.find(v => v.level === user.vipLevel);
  const nextVip = VIP_LEVELS.find(v => v.level === user.vipLevel + 1);
  const vipProgress = nextVip ? ((user.referralCount - vipInfo.refs) / (nextVip.refs - vipInfo.refs) * 100) : 100;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      {/* Header */}
      <header style={{
        background: "rgba(10,10,10,0.98)", borderBottom: `1px solid ${C.cardBorder}`,
        padding: "0 20px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
      }}>
        <span style={{ fontWeight: 900, fontSize: 20, ...goldTextStyle() }}>InfiTrade</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <button style={{ background: C.bg3, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "6px 10px", color: C.text, cursor: "pointer", fontSize: 16 }}
              onClick={() => onNavigate("notifications")}>🔔</button>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}55`, borderRadius: 8, padding: "6px 12px", color: C.gold, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
              {user.name.split(" ").map(n => n[0]).join("")} ⋮
            </button>
            {showProfileMenu && (
              <div style={{
                position: "absolute", right: 0, top: "100%", marginTop: 8, background: C.bg2,
                border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "8px 0", minWidth: 240, zIndex: 200,
              }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.cardBorder}` }}>
                  <div style={{ fontWeight: 700, color: C.text }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>ID: {user.uid}</div>
                  <div style={{ marginTop: 6 }}><Badge color={vipInfo.color}>{vipInfo.name}</Badge></div>
                </div>
                {[
                  { label: "👤 Profile", action: "profile" },
                  { label: "🔗 Referral Link", action: "referral" },
                  { label: "👥 Your Team", action: "team" },
                  { label: "💎 VIP Levels", action: "vip" },
                  { label: "📋 KYC Verification", action: "kyc" },
                  { label: "🔒 Privacy Policy", action: "privacy" },
                  { label: "🚪 Logout", action: "logout" },
                  { label: "🗑 Delete Account", action: "delete", danger: true },
                ].map(item => (
                  <button key={item.action}
                    onClick={() => { setShowProfileMenu(false); item.action === "logout" ? onNavigate("home") : onNavigate(item.action); }}
                    style={{
                      width: "100%", background: "none", border: "none", padding: "10px 16px",
                      color: item.danger ? C.red : C.text, fontSize: 14, cursor: "pointer",
                      textAlign: "left", display: "flex", justifyContent: "space-between",
                    }}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ padding: "20px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.textMuted }}>Welcome back,</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{user.name} <Badge color={vipInfo.color}>{vipInfo.name}</Badge></div>
        </div>

        {/* Wallet Card */}
        <div style={{
          background: `linear-gradient(135deg, #1a1400, #2a2000)`,
          border: `1px solid ${C.gold}55`, borderRadius: 20, padding: "24px 24px",
          marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: `${C.gold}08` }} />
          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 6 }}>TOTAL WALLET BALANCE</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, marginBottom: 4 }}>₹{user.wallet.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>Available for withdrawal</div>
          <div style={{ display: "flex", gap: 12 }}>
            <GoldButton onClick={() => setShowDeposit(true)} small>+ Deposit</GoldButton>
            <GoldButton outline onClick={() => setShowWithdraw(true)} small>↑ Withdraw</GoldButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Invested" value={`₹${(user.totalInvested / 1000).toFixed(0)}K`} icon="📊" />
          <StatCard label="Total Returns" value={`₹${user.totalReturns.toLocaleString()}`} icon="📈" color={C.green} />
          <StatCard label="Referral Income" value={`₹${user.referralIncome.toLocaleString()}`} icon="🎁" />
          <StatCard label="Team Size" value={user.teamSize} icon="👥" />
        </div>

        {/* VIP Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: C.textMuted }}>VIP Progress</div>
              <div style={{ fontWeight: 700, color: vipInfo.color }}>{vipInfo.name} → {nextVip ? nextVip.name : "MAX"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: C.textMuted }}>{user.referralCount} / {nextVip ? nextVip.refs : user.referralCount} referrals</div>
            </div>
          </div>
          <div style={{ background: C.bg3, borderRadius: 999, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${Math.min(vipProgress, 100)}%`, height: "100%", background: css.goldGrad, borderRadius: 999, transition: "width 1s" }} />
          </div>
          {nextVip && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>{nextVip.refs - user.referralCount} more referrals to reach {nextVip.name}</div>}
        </div>

        {/* Active Plans + Quick Invest */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Active Investments</div>
            {[{ name: "Gold Plan", invested: 20000, returns: 700, progress: 60 },
              { name: "Silver Plan", invested: 5000, returns: 125, progress: 80 }].map(inv => (
              <div key={inv.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{inv.name}</span>
                  <span style={{ fontSize: 12, color: C.green }}>+₹{inv.returns}/day</span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Invested: ₹{inv.invested.toLocaleString()}</div>
                <div style={{ background: C.bg3, borderRadius: 999, height: 4 }}>
                  <div style={{ width: `${inv.progress}%`, height: "100%", background: css.goldGrad, borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{inv.progress}% complete</div>
              </div>
            ))}
            <GoldButton outline small onClick={() => onNavigate("plans")}>View All Plans →</GoldButton>
          </div>

          {/* Referral Card */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Referral System</div>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Your Referral Link</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: C.gold, flex: 1 }}>infitrade.in/ref/{user.referralCode}</span>
                <button style={{ background: C.gold, border: "none", borderRadius: 6, padding: "4px 10px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Copy</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Total Referrals", val: user.referralCount },
                { label: "Active Team", val: user.teamSize },
                { label: "Referral Income", val: `₹${user.referralIncome.toLocaleString()}` },
                { label: "Joining Bonus", val: `₹${user.joinedBonus}` },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg3, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
                  <div style={{ fontWeight: 700, color: C.gold, marginTop: 4 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Transactions</div>
            <span style={{ color: C.gold, fontSize: 13, cursor: "pointer" }} onClick={() => onNavigate("transactions")}>View All →</span>
          </div>
          {MOCK_TRANSACTIONS.slice(0, 4).map(tx => (
            <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: tx.type === "deposit" ? `${C.green}22` : tx.type === "withdraw" ? `${C.red}22` : `${C.gold}22`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {tx.type === "deposit" ? "↓" : tx.type === "withdraw" ? "↑" : tx.type === "return" ? "📈" : "🎁"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.desc}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{tx.date}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: tx.type === "withdraw" ? C.red : C.green, textAlign: "right" }}>
                  {tx.type === "withdraw" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                </div>
                <Badge color={tx.status === "success" || tx.status === "credited" || tx.status === "active" ? C.green : C.gold}>
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav current="dashboard" onNavigate={onNavigate} />

      {/* Deposit Modal */}
      {showDeposit && (
        <Modal title="Deposit Funds" onClose={() => { setShowDeposit(false); setDepositStep(1); }}>
          {depositStep === 1 ? (
            <>
              <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>Minimum deposit: ₹500. Funds credited instantly via Razorpay.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {[1000, 5000, 10000, 25000, 50000].map(a => (
                  <button key={a} onClick={() => setDepositAmount(a)}
                    style={{ background: depositAmount == a ? C.gold : C.bg3, color: depositAmount == a ? "#000" : C.text, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                    ₹{(a / 1000).toFixed(0)}K
                  </button>
                ))}
              </div>
              <Input label="Amount (₹)" type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Enter amount" />
              <GoldButton fullWidth onClick={() => setDepositStep(2)}>Proceed to Payment</GoldButton>
            </>
          ) : (
            <>
              <div style={{ background: C.bg3, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>Amount to Pay</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.gold }}>₹{Number(depositAmount).toLocaleString()}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                {["UPI (Instant)", "Debit Card", "Net Banking", "Wallet"].map(m => (
                  <div key={m} style={{ background: C.bg3, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                    {m === "UPI (Instant)" ? "📱" : m === "Debit Card" ? "💳" : m === "Net Banking" ? "🏦" : "👝"} {m}
                  </div>
                ))}
              </div>
              <GoldButton fullWidth onClick={() => { setShowDeposit(false); setDepositStep(1); alert("Payment initiated via Razorpay!"); }}>
                Pay via Razorpay
              </GoldButton>
              <p style={{ color: C.textMuted, fontSize: 11, textAlign: "center", marginTop: 12 }}>
                🔒 Secured by Razorpay | PCI-DSS Compliant
              </p>
            </>
          )}
        </Modal>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <Modal title="Withdraw Funds" onClose={() => setShowWithdraw(false)}>
          <div style={{ background: C.bg3, borderRadius: 10, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>Available Balance</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>₹{user.wallet.toLocaleString()}</span>
          </div>
          <Input label="Amount (₹)" type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Minimum ₹500" />
          <Input label="Bank Account (Last 4 digits)" placeholder="XXXX 1234" />
          <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: C.gold }}>
            ℹ️ Withdrawals are processed within 24-48 hours after admin approval.
          </div>
          <GoldButton fullWidth onClick={() => { setShowWithdraw(false); alert("Withdrawal request submitted for admin approval!"); }}>
            Submit Withdrawal Request
          </GoldButton>
        </Modal>
      )}
    </div>
  );
}

function PlansPage({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState("");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="Investment Plans" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: C.gold }}>
          ⚡ All plans include daily returns credited directly to your wallet
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} onInvest={() => setSelectedPlan(plan)} showFull />
          ))}
        </div>
      </div>
      <BottomNav current="plans" onNavigate={onNavigate} />

      {selectedPlan && (
        <Modal title={`Invest in ${selectedPlan.name} Plan`} onClose={() => setSelectedPlan(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Duration", val: selectedPlan.duration },
              { label: "Daily Return", val: `${selectedPlan.daily}%` },
              { label: "Min Investment", val: `₹${selectedPlan.min.toLocaleString()}` },
              { label: "Total Return", val: `${selectedPlan.total}%` },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
                <div style={{ fontWeight: 700, color: C.gold, marginTop: 4 }}>{s.val}</div>
              </div>
            ))}
          </div>
          <Input label="Investment Amount (₹)" type="number" value={investAmount} onChange={e => setInvestAmount(e.target.value)}
            placeholder={`Min ₹${selectedPlan.min.toLocaleString()}`} />
          {investAmount && (
            <div style={{ background: C.bg3, borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>Daily Income</span>
                <span style={{ color: C.green, fontWeight: 700 }}>₹{(investAmount * selectedPlan.daily / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.textMuted, fontSize: 13 }}>Total Return</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>₹{(investAmount * (1 + selectedPlan.total / 100)).toFixed(2)}</span>
              </div>
            </div>
          )}
          <GoldButton fullWidth onClick={() => { setSelectedPlan(null); onNavigate("dashboard"); }}>
            Confirm Investment
          </GoldButton>
        </Modal>
      )}
    </div>
  );
}

function PlanCard({ plan, onInvest, showFull }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${plan.color}44`,
      borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 28 }}>{plan.icon}</span>
        <Badge color={plan.color}>{plan.duration}</Badge>
      </div>
      <div style={{ fontWeight: 800, fontSize: 18, color: plan.color }}>{plan.name}</div>
      <div style={{ background: C.bg3, borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Investment Range</div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>₹{plan.min.toLocaleString()} - ₹{plan.max.toLocaleString()}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: C.bg3, borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: C.textMuted }}>Daily Return</div>
          <div style={{ fontWeight: 700, color: C.green, fontSize: 16 }}>{plan.daily}%</div>
        </div>
        <div style={{ background: C.bg3, borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: C.textMuted }}>Total Return</div>
          <div style={{ fontWeight: 700, color: C.gold, fontSize: 16 }}>{plan.total}%</div>
        </div>
      </div>
      <div style={{ background: C.bg3, borderRadius: 999, height: 6 }}>
        <div style={{ width: "75%", height: "100%", background: `linear-gradient(90deg, ${plan.color}, ${plan.color}aa)`, borderRadius: 999 }} />
      </div>
      <GoldButton small onClick={onInvest} fullWidth>Invest Now</GoldButton>
    </div>
  );
}

function TransactionsPage({ onNavigate }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "deposit", "withdraw", "invest", "return", "referral"];
  const filtered = filter === "all" ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter(t => t.type === filter);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="Transaction History" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "0 20px 20px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                background: filter === f ? C.gold : C.bg3, color: filter === f ? "#000" : C.textMuted,
                border: `1px solid ${filter === f ? C.gold : C.cardBorder}`, borderRadius: 20,
                padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
          {filtered.map((tx, i) => (
            <div key={tx.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              borderBottom: i < filtered.length - 1 ? `1px solid ${C.cardBorder}` : "none",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: tx.type === "deposit" ? `${C.green}22` : tx.type === "withdraw" ? `${C.red}22` : `${C.gold}22`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>
                {tx.type === "deposit" ? "↓" : tx.type === "withdraw" ? "↑" : tx.type === "return" ? "📈" : tx.type === "invest" ? "💰" : "🎁"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{tx.desc}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{tx.date}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: tx.type === "withdraw" || tx.type === "invest" ? C.red : C.green }}>
                  {tx.type === "withdraw" || tx.type === "invest" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                </div>
                <Badge color={tx.status === "success" || tx.status === "credited" ? C.green : tx.status === "pending" ? C.gold : C.blue}>
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav current="transactions" onNavigate={onNavigate} />
    </div>
  );
}

function ProfilePage({ onNavigate }) {
  const user = MOCK_USER;
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="My Profile" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: css.goldGrad,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#000", margin: "0 auto 12px",
          }}>
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{user.name}</div>
          <div style={{ color: C.textMuted, fontSize: 14 }}>ID: {user.uid}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
            <Badge color={C.green}>KYC Verified ✓</Badge>
            <Badge color={VIP_LEVELS[user.vipLevel - 1].color}>{VIP_LEVELS[user.vipLevel - 1].name}</Badge>
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Personal Information</div>
            <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 14 }}>
              {editing ? "Save" : "Edit"}
            </button>
          </div>
          {[
            { label: "Full Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Mobile", value: "+91 98765 43210" },
            { label: "Joined", value: "January 2025" },
          ].map(field => (
            <div key={field.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
              <span style={{ color: C.textMuted, fontSize: 14 }}>{field.label}</span>
              <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{field.value}</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Security</div>
          {["Change Password", "Two-Factor Authentication", "Login History"].map(item => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
              <span style={{ fontSize: 14 }}>{item}</span>
              <span style={{ color: C.gold }}>→</span>
            </div>
          ))}
        </div>

        <GoldButton outline fullWidth onClick={() => { onNavigate("home"); }}>Logout</GoldButton>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ color: C.red, fontSize: 13, cursor: "pointer" }}>Delete Account</span>
        </div>
      </div>
      <BottomNav current="profile" onNavigate={onNavigate} />
    </div>
  );
}

function KYCPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("aadhaar");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="KYC Verification" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          {["Personal Info", "Document Upload", "Selfie", "Review"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: i + 1 <= step ? css.goldGrad : C.bg3,
                border: `2px solid ${i + 1 <= step ? C.gold : C.textDim}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: i + 1 <= step ? "#000" : C.textMuted, flexShrink: 0,
              }}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 10, color: i + 1 === step ? C.gold : C.textMuted, textAlign: "center", marginLeft: 4, display: step === 1 ? "none" : "block" }}></div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: i + 1 < step ? C.gold : C.textDim, margin: "0 6px" }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", color: C.gold }}>Personal Information</h3>
            <Input label="Full Name (as per ID)" placeholder="Arjun Sharma" />
            <Input label="Date of Birth" type="date" />
            <Input label="PAN Number" placeholder="ABCDE1234F" />
            <Input label="Address" placeholder="123, Main Street, Mumbai" />
            <GoldButton fullWidth onClick={() => setStep(2)}>Next: Upload Documents</GoldButton>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", color: C.gold }}>Upload Documents</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 10 }}>Document Type</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["aadhaar", "passport", "license"].map(t => (
                  <button key={t} onClick={() => setDocType(t)}
                    style={{ background: docType === t ? `${C.gold}22` : C.bg3, border: `1px solid ${docType === t ? C.gold : C.cardBorder}`, borderRadius: 8, padding: "8px 14px", color: docType === t ? C.gold : C.textMuted, cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                    {t === "aadhaar" ? "Aadhaar" : t === "passport" ? "Passport" : "License"}
                  </button>
                ))}
              </div>
            </div>
            {["Front Side", "Back Side"].map(side => (
              <div key={side} style={{ background: C.bg3, border: `2px dashed ${C.cardBorder}`, borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 12, cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                <div style={{ color: C.textMuted, fontSize: 14 }}>Upload {side}</div>
                <div style={{ color: C.textDim, fontSize: 12, marginTop: 4 }}>JPG, PNG or PDF (Max 5MB)</div>
              </div>
            ))}
            <GoldButton fullWidth onClick={() => setStep(3)}>Next: Take Selfie</GoldButton>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", color: C.gold }}>Selfie Verification</h3>
            <div style={{ background: C.bg3, border: `2px dashed ${C.cardBorder}`, borderRadius: 12, padding: 48, textAlign: "center", marginBottom: 20, cursor: "pointer" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
              <div style={{ color: C.textMuted, fontSize: 14 }}>Take a clear selfie</div>
              <div style={{ color: C.textDim, fontSize: 12, marginTop: 4 }}>Hold your document next to your face</div>
            </div>
            <GoldButton fullWidth onClick={() => setStep(4)}>Next: Review</GoldButton>
          </div>
        )}

        {step === 4 && (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", color: C.gold }}>Review & Submit</h3>
            <div style={{ background: `${C.green}11`, border: `1px solid ${C.green}33`, borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ color: C.green, fontWeight: 700, marginBottom: 4 }}>All documents uploaded!</div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>KYC verification takes 24-48 hours</div>
            </div>
            <GoldButton fullWidth onClick={() => onNavigate("dashboard")}>Submit KYC Application</GoldButton>
          </div>
        )}
      </div>
      <BottomNav current="kyc" onNavigate={onNavigate} />
    </div>
  );
}

function TeamPage({ onNavigate }) {
  const mockTeam = [
    { name: "Priya K.", joined: "2025-05-10", invested: 25000, status: "active", vip: 1 },
    { name: "Rahul M.", joined: "2025-05-12", invested: 10000, status: "active", vip: 0 },
    { name: "Sneha P.", joined: "2025-05-15", invested: 50000, status: "active", vip: 2 },
    { name: "Vikram S.", joined: "2025-05-18", invested: 5000, status: "inactive", vip: 0 },
    { name: "Ananya R.", joined: "2025-05-20", invested: 20000, status: "active", vip: 1 },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="My Team" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
        {/* Team Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Team" value={MOCK_USER.teamSize} icon="👥" />
          <StatCard label="Active" value={24} icon="✅" color={C.green} />
          <StatCard label="Referral Income" value={`₹${(MOCK_USER.referralIncome / 1000).toFixed(1)}K`} icon="💰" />
        </div>

        {/* Referral Link */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>Your Referral Link</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px", flex: 1, fontSize: 13, color: C.gold, wordBreak: "break-all" }}>
              https://infitrade.in/ref/{MOCK_USER.referralCode}
            </div>
            <GoldButton small>Copy</GoldButton>
          </div>
        </div>

        {/* Team List */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.cardBorder}`, fontWeight: 700 }}>Team Members</div>
          {mockTeam.map((member, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < mockTeam.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${C.gold}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.gold, fontSize: 14 }}>
                {member.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Joined {member.joined}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>₹{member.invested.toLocaleString()}</div>
                <Badge color={member.status === "active" ? C.green : C.red}>{member.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav current="team" onNavigate={onNavigate} />
    </div>
  );
}

function NotificationsPage({ onNavigate }) {
  const notifs = [
    { icon: "💰", title: "Daily Return Credited", body: "₹700 credited to your wallet from Gold Plan", time: "2h ago", read: false },
    { icon: "🎁", title: "Referral Bonus", body: "Priya K. joined using your referral. ₹500 bonus credited!", time: "1d ago", read: false },
    { icon: "✅", title: "Deposit Successful", body: "₹25,000 deposited successfully via Razorpay", time: "2d ago", read: true },
    { icon: "📢", title: "New Plan Launched!", body: "Elite Plan now available with 6% daily returns. Limited slots!", time: "3d ago", read: true },
    { icon: "⚠️", title: "KYC Reminder", body: "Complete your KYC to unlock higher withdrawal limits", time: "5d ago", read: true },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <PageHeader title="Notifications" onBack={() => onNavigate("dashboard")} />
      <div style={{ padding: "0 20px 20px", maxWidth: 600, margin: "0 auto" }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            background: n.read ? C.card : `${C.gold}08`,
            border: `1px solid ${n.read ? C.cardBorder : C.gold + "44"}`,
            borderRadius: 14, padding: 16, marginBottom: 10,
            display: "flex", gap: 14, alignItems: "flex-start",
          }}>
            <div style={{ fontSize: 28 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{n.title}</div>
              <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{n.body}</div>
              <div style={{ fontSize: 11, color: C.textDim }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, marginTop: 6, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <BottomNav current="notifications" onNavigate={onNavigate} />
    </div>
  );
}

function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "users", "deposits", "withdrawals", "kyc", "plans", "broadcast"];

  const pendingWithdrawals = [
    { user: "Rahul M.", amount: 10000, requested: "2025-05-28", bank: "SBI ****1234", status: "pending" },
    { user: "Sneha P.", amount: 25000, requested: "2025-05-27", bank: "HDFC ****5678", status: "pending" },
    { user: "Vikram S.", amount: 5000, requested: "2025-05-26", bank: "ICICI ****9012", status: "pending" },
  ];

  const pendingKYC = [
    { user: "Aryan T.", submitted: "2025-05-28", type: "Aadhaar" },
    { user: "Meera S.", submitted: "2025-05-27", type: "Passport" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Admin Header */}
      <header style={{
        background: C.bg2, borderBottom: `1px solid ${C.cardBorder}`,
        padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 900, fontSize: 18, ...goldTextStyle() }}>InfiTrade</span>
          <Badge color={C.red}>ADMIN</Badge>
        </div>
        <GoldButton outline small onClick={() => onNavigate("home")}>← Exit Admin</GoldButton>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <aside style={{ background: C.bg2, borderRight: `1px solid ${C.cardBorder}`, padding: "20px 0" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                width: "100%", background: activeTab === tab ? `${C.gold}15` : "none",
                borderRight: activeTab === tab ? `3px solid ${C.gold}` : "3px solid transparent",
                border: "none", borderLeft: "none", padding: "12px 20px", color: activeTab === tab ? C.gold : C.textMuted,
                fontSize: 14, fontWeight: activeTab === tab ? 700 : 400, cursor: "pointer", textAlign: "left",
                textTransform: "capitalize",
              }}>
              {tab === "overview" ? "📊" : tab === "users" ? "👥" : tab === "deposits" ? "💰" : tab === "withdrawals" ? "↑" : tab === "kyc" ? "🪪" : tab === "plans" ? "📈" : "📢"} {tab}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ padding: 24, overflowY: "auto" }}>
          {activeTab === "overview" && (
            <>
              <h2 style={{ margin: "0 0 20px", color: C.gold }}>Dashboard Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Total Users", value: ADMIN_STATS.totalUsers.toLocaleString(), icon: "👥", color: C.blue },
                  { label: "Total Deposited", value: `₹${(ADMIN_STATS.totalDeposits / 10000000).toFixed(1)}Cr`, icon: "💰", color: C.green },
                  { label: "Pending Withdrawals", value: ADMIN_STATS.pendingWithdrawals, icon: "⏳", color: C.gold },
                  { label: "Active Investments", value: ADMIN_STATS.activeInvestments.toLocaleString(), icon: "📈", color: C.blue },
                  { label: "Today's Deposits", value: `₹${(ADMIN_STATS.todayDeposits / 100000).toFixed(1)}L`, icon: "📥", color: C.green },
                  { label: "Today's Withdrawals", value: `₹${(ADMIN_STATS.todayWithdrawals / 100000).toFixed(1)}L`, icon: "📤", color: C.red },
                ].map(s => (
                  <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ fontWeight: 700, marginBottom: 14, color: C.gold }}>⏳ Pending Withdrawals ({pendingWithdrawals.length})</div>
                  {pendingWithdrawals.map((w, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{w.user}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{w.bank}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: C.red }}>₹{w.amount.toLocaleString()}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <button style={{ background: `${C.green}22`, color: C.green, border: `1px solid ${C.green}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Approve</button>
                          <button style={{ background: `${C.red}22`, color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ fontWeight: 700, marginBottom: 14, color: C.gold }}>🪪 Pending KYC ({pendingKYC.length})</div>
                  {pendingKYC.map((k, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{k.user}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{k.type} | {k.submitted}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ background: `${C.green}22`, color: C.green, border: `1px solid ${C.green}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Approve</button>
                        <button style={{ background: `${C.red}22`, color: C.red, border: `1px solid ${C.red}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, color: C.gold }}>User Management</h2>
                <input placeholder="🔍 Search users..." style={{ background: C.bg3, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "8px 14px", color: C.text, fontSize: 13, width: 220 }} />
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.bg3 }}>
                      {["Name", "ID", "VIP", "Balance", "Invested", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: C.textMuted, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[MOCK_USER, { ...MOCK_USER, name: "Priya K.", uid: "IT-102938", vipLevel: 1, wallet: 12000, totalInvested: 25000 },
                      { ...MOCK_USER, name: "Rahul M.", uid: "IT-283746", vipLevel: 1, wallet: 3000, totalInvested: 10000 }].map((u, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${C.cardBorder}` }}>
                        <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13, color: C.textMuted }}>{u.uid}</td>
                        <td style={{ padding: "12px 14px" }}><Badge color={VIP_LEVELS[u.vipLevel - 1].color}>{VIP_LEVELS[u.vipLevel - 1].name}</Badge></td>
                        <td style={{ padding: "12px 14px", fontSize: 13, color: C.gold }}>₹{u.wallet.toLocaleString()}</td>
                        <td style={{ padding: "12px 14px", fontSize: 13 }}>₹{u.totalInvested.toLocaleString()}</td>
                        <td style={{ padding: "12px 14px" }}><Badge color={C.green}>Active</Badge></td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ background: `${C.blue}22`, color: C.blue, border: `1px solid ${C.blue}44`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>View</button>
                            <button style={{ background: `${C.red}22`, color: C.red, border: `1px solid ${C.red}44`, borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Block</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "broadcast" && (
            <>
              <h2 style={{ margin: "0 0 20px", color: C.gold }}>Broadcast Notification</h2>
              <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 24, maxWidth: 500 }}>
                <Input label="Notification Title" placeholder="🎉 New Offer!" />
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 6 }}>Message</div>
                  <textarea rows={4} placeholder="Enter your message here..." style={{ width: "100%", background: C.bg3, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "12px 16px", color: C.text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>Send To</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["All Users", "Active Investors", "VIP Only"].map(t => (
                      <button key={t} style={{ background: C.bg3, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "6px 14px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}>{t}</button>
                    ))}
                  </div>
                </div>
                <GoldButton fullWidth>Send Notification 📢</GoldButton>
              </div>
            </>
          )}

          {(activeTab === "deposits" || activeTab === "withdrawals" || activeTab === "kyc" || activeTab === "plans") && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {activeTab === "deposits" ? "💰" : activeTab === "withdrawals" ? "↑" : activeTab === "kyc" ? "🪪" : "📈"}
              </div>
              <h2 style={{ color: C.gold, textTransform: "capitalize" }}>{activeTab} Management</h2>
              <p style={{ color: C.textMuted }}>Full {activeTab} management panel with approve/reject controls.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LegalPage({ type, onNavigate }) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      content: "InfiTrade Pvt. Ltd. ('we', 'our', 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our investment platform. We collect personal information including name, email, mobile number, PAN, Aadhaar, and bank details strictly for KYC compliance and service delivery. Your data is encrypted using AES-256 encryption and stored on secure servers. We do not sell your personal information to third parties. Data retention follows RBI and SEBI guidelines. You have the right to access, correct, and delete your data. For any privacy concerns, contact privacy@infitrade.in."
    },
    terms: {
      title: "Terms & Conditions",
      content: "By using InfiTrade, you agree to these Terms. Users must be 18+ and Indian residents. Investment returns are indicative and subject to market conditions. Minimum investment is ₹500. Withdrawals are processed within 48 hours after admin approval. InfiTrade reserves the right to modify plans without notice. Multi-account usage is strictly prohibited and leads to permanent ban. Referral abuse will result in account termination and forfeiture of earnings. InfiTrade is not responsible for losses due to market volatility. All disputes are subject to Mumbai jurisdiction."
    },
    risk: {
      title: "Risk Disclosure",
      content: "IMPORTANT: Investments in financial products carry inherent risks. The value of investments may fluctuate and you may lose some or all of your principal investment. Past performance is not indicative of future results. The daily return percentages mentioned are estimates and not guaranteed. InfiTrade is a private investment platform and is not regulated by SEBI as a portfolio manager. This is not a bank deposit and is not insured by DICGC. Please invest only funds you can afford to lose. Seek independent financial advice before investing. By investing, you acknowledge that you have read, understood, and accepted these risks."
    },
    aml: {
      title: "AML/KYC Policy",
      content: "InfiTrade follows strict Anti-Money Laundering (AML) and Know Your Customer (KYC) policies in compliance with PMLA 2002 and RBI guidelines. All users must complete KYC verification before withdrawing funds. Accepted documents: Aadhaar Card, PAN Card, Passport. We conduct enhanced due diligence for transactions above ₹50,000. Suspicious transactions are reported to the Financial Intelligence Unit (FIU-IND). Account freezing occurs for non-compliance. Source of funds declaration is mandatory for deposits above ₹1,00,000. All KYC data is stored securely and shared only with regulatory authorities as required by law."
    },
  };

  const page = content[type] || content.privacy;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <PageHeader title={page.title} onBack={() => onNavigate("home")} />
      <div style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24 }}>
          <p style={{ color: C.textMuted, lineHeight: 1.9, fontSize: 14 }}>{page.content}</p>
          <div style={{ marginTop: 20, fontSize: 12, color: C.textDim }}>Last updated: May 2025</div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Layout Components ───────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, ...goldTextStyle() }}>{children}</h2>
      <div style={{ width: 48, height: 3, background: css.goldGrad, margin: "12px auto 0", borderRadius: 2 }} />
    </div>
  );
}

function PageHeader({ title, onBack }) {
  return (
    <header style={{
      background: "rgba(10,10,10,0.98)", borderBottom: `1px solid ${C.cardBorder}`,
      padding: "0 20px", height: 56, display: "flex", alignItems: "center",
      position: "sticky", top: 0, zIndex: 50, gap: 14,
    }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.gold, fontSize: 20, cursor: "pointer", padding: 4 }}>←</button>
      <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
    </header>
  );
}

function BottomNav({ current, onNavigate }) {
  const items = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "plans", icon: "📈", label: "Plans" },
    { id: "transactions", icon: "📋", label: "History" },
    { id: "team", icon: "👥", label: "Team" },
    { id: "notifications", icon: "🔔", label: "Alerts" },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(10,10,10,0.98)", borderTop: `1px solid ${C.cardBorder}`,
      display: "flex", height: 64, zIndex: 40, backdropFilter: "blur(12px)",
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: current === item.id ? C.gold : C.textMuted, gap: 2,
          }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: current === item.id ? 700 : 400 }}>{item.label}</span>
          {current === item.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, marginTop: 2 }} />}
        </button>
      ))}
    </nav>
  );
}

function goldTextStyle() {
  return {
    background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold}, ${C.goldLight})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
}

// ── App Router ────────────────────────────────────────────────────────────────

export default function InfiTradeApp() {
  const [page, setPage] = useState("home");

  const navigate = (dest) => setPage(dest);

  const routes = {
    home: <HomePage onNavigate={navigate} />,
    login: <AuthPage mode="login" onNavigate={navigate} />,
    signup: <AuthPage mode="signup" onNavigate={navigate} />,
    dashboard: <Dashboard onNavigate={navigate} />,
    plans: <PlansPage onNavigate={navigate} />,
    transactions: <TransactionsPage onNavigate={navigate} />,
    profile: <ProfilePage onNavigate={navigate} />,
    kyc: <KYCPage onNavigate={navigate} />,
    team: <TeamPage onNavigate={navigate} />,
    notifications: <NotificationsPage onNavigate={navigate} />,
    admin: <AdminDashboard onNavigate={navigate} />,
    privacy: <LegalPage type="privacy" onNavigate={navigate} />,
    terms: <LegalPage type="terms" onNavigate={navigate} />,
    risk: <LegalPage type="risk" onNavigate={navigate} />,
    aml: <LegalPage type="aml" onNavigate={navigate} />,
  };

  return (
    <div style={{ fontFamily: "'Sora', 'Inter', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      {/* Quick Nav for demo */}
      <div style={{
        position: "fixed", top: 0, right: 0, zIndex: 9999,
        background: "rgba(10,10,10,0.95)", border: `1px solid ${C.cardBorder}`,
        borderRadius: "0 0 0 12px", padding: "8px 12px",
        display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 280,
      }}>
        {[
          { id: "home", label: "🏠" },
          { id: "login", label: "🔑" },
          { id: "dashboard", label: "📊" },
          { id: "plans", label: "📈" },
          { id: "team", label: "👥" },
          { id: "kyc", label: "🪪" },
          { id: "admin", label: "⚙️ Admin" },
        ].map(r => (
          <button key={r.id} onClick={() => navigate(r.id)}
            style={{
              background: page === r.id ? C.gold : C.bg3,
              color: page === r.id ? "#000" : C.textMuted,
              border: `1px solid ${page === r.id ? C.gold : C.cardBorder}`,
              borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600,
            }}>
            {r.label}
          </button>
        ))}
      </div>
      {routes[page] || routes.home}
    </div>
  );
}
