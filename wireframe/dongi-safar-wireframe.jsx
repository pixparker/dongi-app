import { useState } from "react";

const screens = [
  "login",
  "trips",
  "newTrip",
  "dashboard",
  "addExpense",
  "addPayment",
  "history",
  "members",
  "settlement",
];

const COLORS = {
  bg: "#0F1923",
  card: "#1A2736",
  cardHover: "#223344",
  accent: "#00D68F",
  accentSoft: "rgba(0,214,143,0.12)",
  danger: "#FF6B6B",
  dangerSoft: "rgba(255,107,107,0.12)",
  warning: "#FFB547",
  warningSoft: "rgba(255,181,71,0.12)",
  text: "#E8EDF2",
  textMuted: "#7A8FA6",
  border: "rgba(255,255,255,0.06)",
  inputBg: "#131E2A",
};

const StatusPill = ({ label, color, bgColor }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color: color,
      background: bgColor,
      letterSpacing: "0.02em",
    }}
  >
    {label}
  </span>
);

const Avatar = ({ name, size = 36, color }) => {
  const colors = ["#00D68F", "#FF6B6B", "#FFB547", "#6B8AFF", "#FF8FCB"];
  const c = color || colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${c}, ${c}88)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        color: "#0F1923",
        flexShrink: 0,
      }}
    >
      {name.charAt(0)}
    </div>
  );
};

const PhoneFrame = ({ children, title, onBack, rightAction }) => (
  <div
    style={{
      width: 375,
      height: 750,
      background: COLORS.bg,
      borderRadius: 40,
      border: `2px solid ${COLORS.border}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
    }}
  >
    {/* Status Bar */}
    <div
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        fontSize: 12,
        color: COLORS.textMuted,
        flexShrink: 0,
      }}
    >
      <span style={{ fontWeight: 600 }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <div style={{ width: 16, height: 10, border: `1.5px solid ${COLORS.textMuted}`, borderRadius: 2, position: "relative" }}>
          <div style={{ width: "70%", height: "100%", background: COLORS.accent, borderRadius: 1 }} />
        </div>
      </div>
    </div>

    {/* Header */}
    {title && (
      <div
        style={{
          padding: "4px 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: COLORS.accent,
                fontSize: 20,
                cursor: "pointer",
                padding: "4px 0",
                lineHeight: 1,
              }}
            >
              →
            </button>
          )}
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: COLORS.text,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
        </div>
        {rightAction}
      </div>
    )}

    {/* Content */}
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      {children}
    </div>
  </div>
);

const InputField = ({ label, placeholder, type = "text", icon }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.textMuted,
          marginBottom: 6,
          textAlign: "right",
        }}
      >
        {label}
      </label>
    )}
    <div
      style={{
        background: COLORS.inputBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        direction: "rtl",
      }}
    >
      {icon && <span style={{ color: COLORS.textMuted, fontSize: 16 }}>{icon}</span>}
      <span style={{ color: COLORS.textMuted, fontSize: 14, flex: 1, textAlign: "right" }}>
        {placeholder}
      </span>
    </div>
  </div>
);

const Btn = ({ children, variant = "primary", onClick, full = false, size = "md" }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#0F1923", fontWeight: 700 },
    secondary: { background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` },
    ghost: { background: "transparent", color: COLORS.accent },
    danger: { background: COLORS.dangerSoft, color: COLORS.danger },
  };
  const sizeStyles = {
    sm: { padding: "8px 14px", fontSize: 12, borderRadius: 10 },
    md: { padding: "13px 24px", fontSize: 14, borderRadius: 14 },
    lg: { padding: "16px 28px", fontSize: 16, borderRadius: 16 },
  };
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        cursor: "pointer",
        width: full ? "100%" : "auto",
        letterSpacing: "0.01em",
        transition: "all 0.15s",
        ...styles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </button>
  );
};

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: "dashboard", icon: "📊", label: "داشبورد" },
    { id: "addExpense", icon: "➕", label: "هزینه" },
    { id: "settlement", icon: "💰", label: "تسویه" },
    { id: "history", icon: "📋", label: "تاریخچه" },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 12px 24px",
        background: COLORS.card,
        borderTop: `1px solid ${COLORS.border}`,
        flexShrink: 0,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "6px 12px",
            borderRadius: 12,
            transition: "all 0.15s",
            ...(active === item.id
              ? { background: COLORS.accentSoft }
              : {}),
          }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: active === item.id ? 700 : 500,
              color: active === item.id ? COLORS.accent : COLORS.textMuted,
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// ─── SCREEN: Login ──────────────────────────
const LoginScreen = ({ onNavigate }) => (
  <PhoneFrame>
    <div style={{ padding: "40px 24px", textAlign: "center", direction: "rtl" }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>🎒</div>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: COLORS.accent,
          margin: "0 0 6px",
          letterSpacing: "-0.03em",
        }}
      >
        دنگی‌سفر
      </h1>
      <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 36px" }}>
        مدیریت هزینه سفرهای گروهی
      </p>

      <InputField label="نام کاربری" placeholder="مثلاً: ali_traveler" icon="👤" />
      <InputField label="رمز عبور" placeholder="••••••••" icon="🔒" />

      <Btn full variant="primary" size="lg" onClick={() => onNavigate("trips")}>
        ورود
      </Btn>

      <div style={{ margin: "20px 0", color: COLORS.textMuted, fontSize: 13 }}>
        ─── یا ───
      </div>

      <Btn full variant="secondary" size="md" onClick={() => onNavigate("trips")}>
        ساخت حساب جدید
      </Btn>

      <p style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 32 }}>
        نسخه PWA · نصب روی هر دستگاهی
      </p>
    </div>
  </PhoneFrame>
);

// ─── SCREEN: Trip List ──────────────────────
const TripsScreen = ({ onNavigate }) => {
  const trips = [
    { name: "سفر شمال", members: 5, total: "۱۲,۵۰۰,۰۰۰", currency: "﷼", color: "#00D68F", emoji: "🏖️" },
    { name: "سفر استانبول", members: 4, total: "۸,۴۰۰", currency: "₺", color: "#6B8AFF", emoji: "🕌" },
    { name: "کمپ جنگل", members: 6, total: "۴,۲۰۰,۰۰۰", currency: "﷼", color: "#FFB547", emoji: "⛺" },
  ];
  return (
    <PhoneFrame title="سفرهای من">
      <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
        {trips.map((trip, i) => (
          <div
            key={i}
            onClick={() => onNavigate("dashboard")}
            style={{
              background: COLORS.card,
              borderRadius: 16,
              padding: 18,
              marginBottom: 12,
              cursor: "pointer",
              border: `1px solid ${COLORS.border}`,
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${trip.color}22, ${trip.color}11)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  border: `1px solid ${trip.color}33`,
                }}
              >
                {trip.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.text }}>
                  {trip.name}
                </h3>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>👥 {trip.members} نفر</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                    💰 {trip.total} {trip.currency}
                  </span>
                </div>
              </div>
              <span style={{ color: COLORS.textMuted, fontSize: 18 }}>←</span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <Btn full variant="primary" size="lg" onClick={() => onNavigate("newTrip")}>
            + سفر جدید
          </Btn>
        </div>

        <div
          style={{
            marginTop: 16,
            background: COLORS.card,
            borderRadius: 14,
            padding: 16,
            border: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>
            🔗 لینک دعوت دارید؟
          </p>
          <Btn variant="ghost" size="sm" style={{ marginTop: 8 }}>
            پیوستن به سفر
          </Btn>
        </div>
      </div>
    </PhoneFrame>
  );
};

// ─── SCREEN: New Trip ──────────────────────
const NewTripScreen = ({ onNavigate }) => (
  <PhoneFrame title="سفر جدید" onBack={() => onNavigate("trips")}>
    <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
      <div
        style={{
          width: "100%",
          height: 120,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.accent}05)`,
          border: `2px dashed ${COLORS.accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 32 }}>📷</span>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>تصویر سفر (اختیاری)</span>
      </div>

      <InputField label="نام سفر" placeholder="مثلاً: سفر شمال ۱۴۰۵" icon="✏️" />
      <InputField label="واحد پول" placeholder="تومان" icon="💱" />
      <InputField label="تاریخ شروع" placeholder="۱۴۰۵/۰۱/۱۵" icon="📅" />

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textAlign: "right" }}>
          تایید هزینه توسط ادمین
        </label>
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              background: COLORS.accentSoft,
              border: `1.5px solid ${COLORS.accent}`,
              borderRadius: 10,
              padding: "10px 14px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.accent,
            }}
          >
            ✓ فعال
          </div>
          <div
            style={{
              flex: 1,
              background: COLORS.inputBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "10px 14px",
              textAlign: "center",
              fontSize: 13,
              color: COLORS.textMuted,
            }}
          >
            غیرفعال
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textAlign: "right" }}>
          اعضای سفر
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["علی (من)", "حسین", "مریم"].map((n, i) => (
            <div
              key={i}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                color: COLORS.text,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {n}
              {i > 0 && <span style={{ color: COLORS.danger, fontSize: 14, cursor: "pointer" }}>×</span>}
            </div>
          ))}
          <div
            style={{
              border: `1.5px dashed ${COLORS.accent}55`,
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 13,
              color: COLORS.accent,
              cursor: "pointer",
            }}
          >
            + عضو جدید
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Btn full variant="primary" size="lg" onClick={() => onNavigate("dashboard")}>
          ساخت سفر 🚀
        </Btn>
      </div>
    </div>
  </PhoneFrame>
);

// ─── SCREEN: Dashboard ──────────────────────
const DashboardScreen = ({ onNavigate }) => {
  const members = [
    { name: "علی", paid: "۵,۲۰۰", share: "۳,۱۵۰", balance: "+۲,۰۵۰", status: "طلبکار" },
    { name: "حسین", paid: "۲,۰۰۰", share: "۳,۱۵۰", balance: "-۱,۱۵۰", status: "بدهکار" },
    { name: "مریم", paid: "۱,۴۰۰", share: "۳,۱۵۰", balance: "-۱,۷۵۰", status: "بدهکار" },
    { name: "سارا", paid: "۳,۸۰۰", share: "۳,۱۵۰", balance: "+۶۵۰", status: "طلبکار" },
  ];
  const expenses = [
    { title: "ناهار رستوران", amount: "۳,۲۰۰", payer: "علی", cat: "🍕", status: "approved" },
    { title: "بنزین", amount: "۱,۸۰۰", payer: "سارا", cat: "⛽", status: "approved" },
    { title: "هتل", amount: "۵,۴۰۰", payer: "حسین", cat: "🏨", status: "pending" },
  ];
  return (
    <PhoneFrame
      title="سفر استانبول"
      onBack={() => onNavigate("trips")}
      rightAction={
        <button
          onClick={() => onNavigate("members")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: COLORS.accent, fontWeight: 600 }}
        >
          👥 اعضا
        </button>
      }
    >
      <div style={{ padding: "0 20px", direction: "rtl" }}>
        {/* Total Card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}18, ${COLORS.accent}06)`,
            border: `1px solid ${COLORS.accent}33`,
            borderRadius: 18,
            padding: 20,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
            مجموع هزینه سفر
          </p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color: COLORS.accent, letterSpacing: "-0.03em" }}>
            ۱۲,۶۰۰
          </p>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>₺ لیر ترکیه</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${COLORS.accent}22`,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>سهم هر نفر</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.text }}>۳,۱۵۰ ₺</p>
            </div>
            <div style={{ width: 1, background: `${COLORS.accent}22` }} />
            <div>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>تعداد اعضا</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.text }}>۴ نفر</p>
            </div>
          </div>
        </div>

        {/* Members Balance */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "0 0 10px" }}>وضعیت اعضا</h3>
        {members.map((m, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 8,
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Avatar name={m.name} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{m.name}</span>
                <StatusPill
                  label={m.status}
                  color={m.status === "طلبکار" ? COLORS.accent : COLORS.danger}
                  bgColor={m.status === "طلبکار" ? COLORS.accentSoft : COLORS.dangerSoft}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>پرداخت: {m.paid} ₺</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: m.status === "طلبکار" ? COLORS.accent : COLORS.danger,
                  }}
                >
                  {m.balance} ₺
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Recent Expenses */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "18px 0 10px" }}>هزینه‌های اخیر</h3>
        {expenses.map((e, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 8,
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: COLORS.inputBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {e.cat}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{e.title}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{e.amount} ₺</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>پرداخت: {e.payer}</span>
                {e.status === "pending" && (
                  <StatusPill label="در انتظار تایید" color={COLORS.warning} bgColor={COLORS.warningSoft} />
                )}
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>
      <BottomNav active="dashboard" onNavigate={onNavigate} />
    </PhoneFrame>
  );
};

// ─── SCREEN: Add Expense ──────────────────────
const AddExpenseScreen = ({ onNavigate }) => {
  const [splitMode, setSplitMode] = useState("equal");
  return (
    <PhoneFrame title="ثبت هزینه" onBack={() => onNavigate("dashboard")}>
      <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
        <InputField label="عنوان" placeholder="مثلاً: ناهار، بنزین، هتل" icon="✏️" />

        {/* Amount - Large */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>
            مبلغ
          </label>
          <div
            style={{
              background: COLORS.inputBg,
              borderRadius: 18,
              padding: "20px 16px",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.03em" }}>
              ۰
            </span>
            <span style={{ fontSize: 18, color: COLORS.textMuted, marginRight: 8 }}>₺</span>
          </div>
        </div>

        {/* Payer */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textAlign: "right" }}>
            پرداخت‌کننده
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                background: COLORS.accentSoft,
                border: `1.5px solid ${COLORS.accent}`,
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.accent,
                cursor: "pointer",
              }}
            >
              🙋 خودم
            </div>
            {["حسین", "مریم", "سارا"].map((n, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.inputBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: COLORS.textMuted,
                  cursor: "pointer",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Split Mode */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textAlign: "right" }}>
            نحوه تقسیم
          </label>
          <div
            style={{
              display: "flex",
              gap: 6,
              background: COLORS.inputBg,
              borderRadius: 12,
              padding: 4,
            }}
          >
            {[
              { id: "equal", label: "مساوی" },
              { id: "percent", label: "درصدی" },
              { id: "fixed", label: "مبلغ ثابت" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSplitMode(mode.id)}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 9,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: splitMode === mode.id ? COLORS.accent : "transparent",
                  color: splitMode === mode.id ? "#0F1923" : COLORS.textMuted,
                  transition: "all 0.15s",
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textAlign: "right" }}>
            افراد شریک
          </label>
          {["علی", "حسین", "مریم", "سارا"].map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={n} size={30} />
                <span style={{ fontSize: 14, color: COLORS.text }}>{n}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {splitMode === "equal" && (
                  <span style={{ fontSize: 13, color: COLORS.textMuted }}>۲۵٪</span>
                )}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: COLORS.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#0F1923",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>

        <InputField label="دسته‌بندی" placeholder="غذا، حمل‌ونقل، اقامت..." icon="🏷️" />
        <InputField label="توضیحات (اختیاری)" placeholder="مثلاً: شام در بازار بزرگ" icon="📝" />

        <Btn full variant="primary" size="lg" onClick={() => onNavigate("dashboard")}>
          ثبت هزینه ✓
        </Btn>
      </div>
    </PhoneFrame>
  );
};

// ─── SCREEN: Add Payment ──────────────────────
const AddPaymentScreen = ({ onNavigate }) => (
  <PhoneFrame title="ثبت پرداخت" onBack={() => onNavigate("dashboard")}>
    <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
      <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginBottom: 24 }}>
        پرداخت مستقیم بین دو نفر
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar name="حسین" size={56} />
          <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 600, color: COLORS.text }}>حسین</p>
          <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>پرداخت‌کننده</p>
        </div>
        <div style={{ fontSize: 28, color: COLORS.accent }}>←</div>
        <div style={{ textAlign: "center" }}>
          <Avatar name="علی" size={56} />
          <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 600, color: COLORS.text }}>علی</p>
          <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>دریافت‌کننده</p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>
          مبلغ پرداخت
        </label>
        <div
          style={{
            background: COLORS.inputBg,
            borderRadius: 18,
            padding: "24px 16px",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 900, color: COLORS.accent }}>۱,۱۵۰</span>
          <span style={{ fontSize: 18, color: COLORS.textMuted, marginRight: 8 }}>₺</span>
        </div>
      </div>

      <InputField label="توضیحات (اختیاری)" placeholder="مثلاً: تسویه نقدی" icon="📝" />

      <Btn full variant="primary" size="lg" onClick={() => onNavigate("dashboard")}>
        ثبت پرداخت ✓
      </Btn>
    </div>
  </PhoneFrame>
);

// ─── SCREEN: Settlement ──────────────────────
const SettlementScreen = ({ onNavigate }) => {
  const settlements = [
    { from: "حسین", to: "علی", amount: "۱,۱۵۰" },
    { from: "مریم", to: "علی", amount: "۹۰۰" },
    { from: "مریم", to: "سارا", amount: "۸۵۰" },
  ];
  return (
    <PhoneFrame title="تسویه حساب" onBack={() => onNavigate("dashboard")}>
      <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}15, transparent)`,
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
            border: `1px solid ${COLORS.accent}22`,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>
            کمترین تعداد انتقال برای تسویه کامل
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900, color: COLORS.accent }}>
            ۳ انتقال
          </p>
        </div>

        {settlements.map((s, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 10,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={s.from} size={36} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.from}</p>
                  <p style={{ margin: 0, fontSize: 11, color: COLORS.danger }}>بدهکار</p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.accent }}>
                  {s.amount} ₺
                </p>
                <p style={{ margin: 0, fontSize: 18, color: COLORS.textMuted }}>←</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.to}</p>
                  <p style={{ margin: 0, fontSize: 11, color: COLORS.accent }}>طلبکار</p>
                </div>
                <Avatar name={s.to} size={36} />
              </div>
            </div>
            <Btn
              full
              variant="secondary"
              size="sm"
              onClick={() => onNavigate("addPayment")}
            >
              ثبت پرداخت
            </Btn>
          </div>
        ))}
      </div>
      <BottomNav active="settlement" onNavigate={onNavigate} />
    </PhoneFrame>
  );
};

// ─── SCREEN: History ──────────────────────
const HistoryScreen = ({ onNavigate }) => {
  const logs = [
    { action: "ایجاد", detail: "هزینه «ناهار رستوران» ثبت شد", user: "علی", time: "۱۰ دقیقه پیش", icon: "🟢" },
    { action: "تایید", detail: "هزینه «هتل» تایید شد", user: "علی (ادمین)", time: "۲۵ دقیقه پیش", icon: "✅" },
    { action: "ویرایش", detail: "مبلغ «بنزین» از ۱,۵۰۰ به ۱,۸۰۰ تغییر کرد", user: "سارا", time: "۱ ساعت پیش", icon: "🔵" },
    { action: "حذف", detail: "هزینه «خرید سوغاتی» حذف شد", user: "علی (ادمین)", time: "۲ ساعت پیش", icon: "🔴" },
    { action: "پرداخت", detail: "حسین ← علی: ۵۰۰ ₺", user: "حسین", time: "۳ ساعت پیش", icon: "💸" },
    { action: "عضویت", detail: "سارا به سفر پیوست", user: "سارا", time: "دیروز", icon: "👋" },
  ];
  return (
    <PhoneFrame title="تاریخچه تغییرات" onBack={() => onNavigate("dashboard")}>
      <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
        {logs.map((log, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "14px 0",
              borderBottom: i < logs.length - 1 ? `1px solid ${COLORS.border}` : "none",
            }}
          >
            <div style={{ fontSize: 18, paddingTop: 2 }}>{log.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{log.detail}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>👤 {log.user}</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>⏰ {log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </PhoneFrame>
  );
};

// ─── SCREEN: Members ──────────────────────
const MembersScreen = ({ onNavigate }) => {
  const members = [
    { name: "علی", role: "ادمین اصلی", badge: "👑" },
    { name: "حسین", role: "ادمین معتمد", badge: "⭐" },
    { name: "مریم", role: "عضو", badge: null },
    { name: "سارا", role: "عضو", badge: null },
  ];
  return (
    <PhoneFrame title="اعضای سفر" onBack={() => onNavigate("dashboard")}>
      <div style={{ padding: "0 20px 20px", direction: "rtl" }}>
        {members.map((m, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 8,
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Avatar name={m.name} size={42} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{m.name}</span>
                {m.badge && <span style={{ fontSize: 14 }}>{m.badge}</span>}
              </div>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{m.role}</span>
            </div>
            {m.role === "عضو" && (
              <Btn variant="ghost" size="sm">ارتقا به ادمین</Btn>
            )}
          </div>
        ))}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div
            style={{
              background: COLORS.card,
              borderRadius: 14,
              padding: 18,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: 13, color: COLORS.textMuted }}>🔗 لینک دعوت</p>
            <div
              style={{
                background: COLORS.inputBg,
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: COLORS.accent,
                marginBottom: 10,
                wordBreak: "break-all",
                direction: "ltr",
              }}
            >
              dongi.app/join/xK9m2pQ
            </div>
            <Btn variant="primary" size="sm">کپی لینک</Btn>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Btn full variant="secondary" size="md">
            + افزودن عضو جدید
          </Btn>
        </div>
      </div>
    </PhoneFrame>
  );
};

// ─── MAIN APP ──────────────────────
export default function DongiSafarWireframe() {
  const [screen, setScreen] = useState("login");

  const screenMap = {
    login: <LoginScreen onNavigate={setScreen} />,
    trips: <TripsScreen onNavigate={setScreen} />,
    newTrip: <NewTripScreen onNavigate={setScreen} />,
    dashboard: <DashboardScreen onNavigate={setScreen} />,
    addExpense: <AddExpenseScreen onNavigate={setScreen} />,
    addPayment: <AddPaymentScreen onNavigate={setScreen} />,
    settlement: <SettlementScreen onNavigate={setScreen} />,
    history: <HistoryScreen onNavigate={setScreen} />,
    members: <MembersScreen onNavigate={setScreen} />,
  };

  const screenLabels = [
    { id: "login", label: "ورود", emoji: "🔐" },
    { id: "trips", label: "سفرها", emoji: "🎒" },
    { id: "newTrip", label: "سفر جدید", emoji: "✨" },
    { id: "dashboard", label: "داشبورد", emoji: "📊" },
    { id: "addExpense", label: "ثبت هزینه", emoji: "💳" },
    { id: "addPayment", label: "ثبت پرداخت", emoji: "💸" },
    { id: "settlement", label: "تسویه", emoji: "🤝" },
    { id: "history", label: "تاریخچه", emoji: "📋" },
    { id: "members", label: "اعضا", emoji: "👥" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080E14",
        fontFamily: "'Vazirmatn', 'SF Pro Display', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 20px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#00D68F", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
          🎒 دنگی‌سفر — وایرفریم
        </h1>
        <p style={{ fontSize: 14, color: "#7A8FA6", margin: 0 }}>
          PWA مدیریت هزینه سفر گروهی · روی هر صفحه کلیک کنید
        </p>
      </div>

      {/* Screen Selector */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          marginBottom: 30,
          maxWidth: 600,
        }}
      >
        {screenLabels.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              background: screen === s.id ? "#00D68F" : "#1A2736",
              color: screen === s.id ? "#0F1923" : "#7A8FA6",
              transition: "all 0.15s",
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Phone */}
      <div style={{ filter: "drop-shadow(0 30px 60px rgba(0,214,143,0.08))" }}>
        {screenMap[screen]}
      </div>
    </div>
  );
}
