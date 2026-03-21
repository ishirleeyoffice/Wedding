// ================================================
// src/app/components/MaterialRequestSection.tsx
// 모바일 최적화 + 커스텀 달력 피커
// ================================================
import React, { useState, useEffect, useRef } from "react";
import { WEDDING_DATE } from "../lib/weddingConfig";

const API_URL = (import.meta as ImportMeta & { env: Record<string, string> }).env?.VITE_API_URL || "http://localhost:4000";

interface FormState  { name: string; email: string; sendDate: string }
interface FormErrors { name?: string; email?: string; sendDate?: string }
type Phase = "idle" | "loading" | "success" | "error";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function fmtDate(str: string): string {
  if (!str) return "";
  return new Date(str + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });
}

// ── 커스텀 달력 컴포넌트 ──────────────────────
function CalendarPicker({ value, onChange }: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = new Date();
  const todayStr = getTodayStr();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // 현재 뷰 달의 날짜 배열 생성
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${mm}-${dd}`;
    if (dateStr <= todayStr) return;   // 오늘 이전 불가
    if (dateStr >= WEDDING_DATE) return; // 결혼식 당일 이후 불가
    onChange(dateStr);
  };

  const isSameDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return value === `${viewYear}-${mm}-${dd}`;
  };

  const isPast = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}` <= todayStr;
  };

  const isToday = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}` === todayStr;
  };

  const isAfterWedding = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${viewYear}-${mm}-${dd}` >= WEDDING_DATE;
  };

  return (
    <div style={CS.wrap}>
      {/* 헤더 */}
      <div style={CS.header}>
        <button style={CS.navBtn} onClick={prevMonth}>‹</button>
        <span style={CS.monthTitle}>{viewYear}년 {MONTHS[viewMonth]}</span>
        <button style={CS.navBtn} onClick={nextMonth}>›</button>
      </div>

      {/* 요일 헤더 */}
      <div style={CS.grid}>
        {DAYS.map((d, i) => (
          <div key={d} style={{
            ...CS.dayLabel,
            color: i === 0 ? "#e05" : i === 6 ? "#0074e4" : "#999",
          }}>{d}</div>
        ))}

        {/* 날짜 셀 */}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const past = isPast(day) || isAfterWedding(day);
          const selected = isSameDate(day);
          const todayMark = isToday(day);
          const isSun = (i % 7 === 0);
          const isSat = (i % 7 === 6);

          return (
            <div key={`d-${day}`}
              onClick={() => !past && selectDate(day)}
              style={{
                ...CS.cell,
                ...(past     ? CS.cellPast     : {}),
                ...(selected ? CS.cellSelected : {}),
                ...(todayMark && !selected ? CS.cellToday : {}),
                color: selected ? "#fff"
                  : past ? "#ccc"
                  : isSun ? "#e05"
                  : isSat ? "#0074e4"
                  : "#2d2d2d",
                cursor: past ? "default" : "pointer",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 선택된 날짜 표시 */}
      {value && (
        <div style={CS.selectedBar}>
          📅 {fmtDate(value)} 오전 9시 발송 예정
        </div>
      )}
    </div>
  );
}

// ── 달력 스타일 ──────────────────────────────
const CS: Record<string, React.CSSProperties> = {
  wrap:         { background: "#fff", borderRadius: 14, border: "1.5px solid #e8e4e0", overflow: "hidden" },
  header:       { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px", borderBottom: "1px solid #f0ece8" },
  monthTitle:   { fontSize: 15, fontWeight: 700, color: "#2d2d2d" },
  navBtn:       { background: "none", border: "none", fontSize: 20, color: "#888", cursor: "pointer", padding: "0 8px", lineHeight: 1 },
  grid:         { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, padding: "10px 10px 8px" },
  dayLabel:     { textAlign: "center", fontSize: 11, fontWeight: 600, padding: "4px 0 8px" },
  cell:         { textAlign: "center", fontSize: 13, fontWeight: 500, padding: "8px 4px", borderRadius: 8, transition: "background .15s" },
  cellPast:     { opacity: 0.35 },
  cellSelected: { background: "#2d2d2d", color: "#fff !important", borderRadius: 8, fontWeight: 700 },
  cellToday:    { border: "1.5px solid #2d2d2d", borderRadius: 8 },
  selectedBar:  { background: "#f5f3f0", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#c9826a", textAlign: "center", borderTop: "1px solid #f0ece8" },
};

// ════════════════════════════════════════════════
// 메인 컴포넌트
// ════════════════════════════════════════════════
export default function MaterialRequestSection() {
  const [form,    setForm]    = useState<FormState>({ name: "", email: "", sendDate: "" });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleDateChange = (date: string) => {
    setForm(p => ({ ...p, sendDate: date }));
    setErrors(p => ({ ...p, sendDate: "" }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim())  e.name = "이름을 입력해주세요";
    if (!form.email.trim()) e.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "올바른 이메일 형식이 아닙니다";
    if (!form.sendDate) e.sendDate = "날짜를 선택해주세요";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPhase("loading");
    try {
      const res = await fetch(`${API_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), sendDate: form.sendDate }),
      });
      const data = await res.json();
      data.success ? setPhase("success") : (setPhase("error"), setErrMsg(data.message || "오류가 발생했습니다."));
    } catch {
      setPhase("error");
      setErrMsg("서버에 연결할 수 없습니다.");
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", sendDate: "" });
    setErrors({});
    setPhase("idle");
    setErrMsg("");
  };

  // ── 성공 화면 ──────────────────────────────
  if (phase === "success") {
    return (
      <section ref={ref} style={S.section}>
        <style>{KEYFRAMES}</style>
        <div style={{ animation: "fadeUp .5s ease forwards" }}>
          <div style={S.successHeader}>
            <div style={S.successIconWrap}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={S.successTag}>신청 완료</p>
              <h3 style={S.successTitle}>자료 발송 예약됐어요!</h3>
            </div>
          </div>
          <div style={S.successCard}>
            <Row label="받는 날짜" value={fmtDate(form.sendDate)} />
            <div style={S.divider} />
            <Row label="발송 이메일" value={form.email} small />
            <div style={S.divider} />
            <Row label="신청자" value={form.name} />
          </div>
          <p style={S.successNote}>해당 날짜 오전 9시에 자동으로 발송됩니다.</p>
          <button style={S.ghostBtn} onClick={handleReset}>← 다시 신청하기</button>
        </div>
      </section>
    );
  }

  // ── 메인 폼 ────────────────────────────────
  return (
    <section ref={ref} style={S.section}>
      <style>{KEYFRAMES}</style>

      <div style={{
        ...S.titleWrap,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .6s ease, transform .6s ease",
      }}>
        <div style={S.titleDeco}>
          <span style={S.titleDecoLine} />
          <span style={S.titleDecoText}>REMINDER</span>
          <span style={S.titleDecoLine} />
        </div>
        <h2 style={S.heading}>리마인더 받기</h2>
        <p style={S.subText}>
          참석 여부가 아직 미확정이시라면 <br />
          아래 원하는 날짜를 선택하면<br />
          그 날 오전 9시에 이메일로 청첩장을 다시 보내드려요
        </p>
      </div>

      <div style={{
        ...S.card,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .6s ease .15s, transform .6s ease .15s",
      }}>
        {/* 이름 */}
        <Field label="성함" error={errors.name}>
          <input name="name" type="text" value={form.name}
            onChange={handleChange} placeholder="홍길동"
            style={{ ...S.input, ...(errors.name ? S.inputErr : {}) }} />
        </Field>

        {/* 이메일 */}
        <Field label="이메일" error={errors.email}>
          <input name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="hello@example.com"
            style={{ ...S.input, ...(errors.email ? S.inputErr : {}) }} />
        </Field>

        {/* 달력 날짜 선택 */}
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>
            자료 수신 날짜 <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <CalendarPicker value={form.sendDate} onChange={handleDateChange} />
          {errors.sendDate && <p style={S.errText}>⚠ {errors.sendDate}</p>}
        </div>

        {phase === "error" && (
          <div style={S.errBox}>⚠️ {errMsg}</div>
        )}

        <button onClick={handleSubmit} disabled={phase === "loading"}
          style={{ ...S.submitBtn, ...(phase === "loading" ? S.submitOff : {}) }}>
          {phase === "loading" ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={S.spinner} /> 처리 중...
            </span>
          ) : "알림 설정하기 →"}
        </button>

        <p style={S.privacy}>🔒 수집된 정보는 자료 발송 목적으로만 사용됩니다</p>
      </div>
    </section>
  );
}

// ── 서브 컴포넌트 ──────────────────────────────
function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={S.label}>{label} <span style={{ color: "#c0392b" }}>*</span></label>
      {children}
      {error && <p style={S.errText}>⚠ {error}</p>}
    </div>
  );
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={{ ...S.rowValue, fontSize: small ? 13 : 15 }}>{value}</span>
    </div>
  );
}

// ── 키프레임 ───────────────────────────────────
const KEYFRAMES = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin   { to { transform:rotate(360deg) } }
`;

// ── 스타일 ────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  section:      { padding: "48px 20px 56px", background: "#FAF9F8", borderTop: "1px solid #f0ece8", fontFamily: "'Gowun Dodum', sans-serif" },
  titleWrap:    { textAlign: "center", marginBottom: 28 },
  titleDeco:    { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 },
  titleDecoLine:{ display: "inline-block", width: 24, height: 1, background: "#d4a9a0" },
  titleDecoText:{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", color: "#d4a9a0" },
  heading:      { fontSize: 22, fontWeight: 700, color: "#2d2d2d", margin: "0 0 10px", letterSpacing: "-0.3px" },
  subText:      { fontSize: 13, color: "#888", lineHeight: 1.8, margin: 0 },
  card:         { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" },
  label:        { display: "block", fontSize: 11, fontWeight: 600, color: "#555", marginBottom: 7, letterSpacing: "0.5px" },
  input:        { width: "100%", padding: "12px 14px", border: "1.5px solid #e8e4e0", borderRadius: 10, fontSize: 15, color: "#2d2d2d", background: "#fafafa", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  inputErr:     { borderColor: "#f5a9a9", background: "#fff5f5" },
  errText:      { color: "#c0392b", fontSize: 11, margin: "5px 0 0" },
  errBox:       { background: "#fff5f5", border: "1px solid #fcd4d4", borderRadius: 10, padding: "10px 14px", color: "#c0392b", fontSize: 13, marginBottom: 14 },
  submitBtn:    { width: "100%", padding: "14px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4, fontFamily: "inherit", letterSpacing: "0.3px" },
  submitOff:    { opacity: 0.6, cursor: "not-allowed" },
  spinner:      { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" },
  privacy:      { textAlign: "center", fontSize: 11, color: "#bbb", margin: "14px 0 0", lineHeight: 1.6 },
  successHeader:{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
  successIconWrap: { width: 48, height: 48, borderRadius: "50%", background: "#4caf82", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(76,175,130,0.35)" },
  successTag:   { fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: "#4caf82", marginBottom: 3 },
  successTitle: { fontSize: 18, fontWeight: 700, color: "#2d2d2d", margin: 0 },
  successCard:  { background: "#fff", borderRadius: 14, padding: "4px 0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 16 },
  successNote:  { textAlign: "center", fontSize: 12, color: "#aaa", margin: "0 0 20px" },
  row:          { padding: "14px 18px", display: "flex", flexDirection: "column", gap: 3 },
  rowLabel:     { fontSize: 10, fontWeight: 600, letterSpacing: "1px", color: "#bbb" },
  rowValue:     { fontWeight: 600, color: "#2d2d2d" },
  divider:      { height: 1, background: "#f5f3f1", margin: "0 18px" },
  ghostBtn:     { width: "100%", padding: "13px", background: "transparent", border: "1.5px solid #e8e4e0", borderRadius: 12, fontSize: 14, color: "#999", cursor: "pointer", fontFamily: "inherit" },
};
