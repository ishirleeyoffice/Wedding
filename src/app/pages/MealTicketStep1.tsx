import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8ec7463/meal-ticket/guest`;

// 전화번호 포맷 함수: 숫자만 추출 후 010-XXXX-XXXX 형식으로
function formatPhone(raw: string): string {
  // 숫자만 추출
  const digits = raw.replace(/\D/g, "");
  // 최대 11자리
  const limited = digits.slice(0, 11);

  if (limited.length <= 3) return limited;
  if (limited.length <= 7) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
}

// 포맷된 번호에서 숫자 개수 (하이픈 제외)
function digitCount(formatted: string): number {
  return formatted.replace(/\D/g, "").length;
}

export function MealTicketStep1() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("010-"); // 010- 기본값
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // 사용자가 "010-" 앞부분 지우지 못하게
    const digits = raw.replace(/\D/g, "");
    if (!digits.startsWith("010")) {
      setPhone("010-");
      return;
    }

    const formatted = formatPhone(digits);
    setPhone(formatted);
  };

  // 완성된 번호인지 (11자리: 010-XXXX-XXXX)
  const isPhoneComplete = digitCount(phone) === 11;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error("이름을 입력해주세요.", {
        style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
      });
      return;
    }
    if (!trimmedPhone || !isPhoneComplete) {
      toast.error("핸드폰 번호를 끝까지 입력해주세요.", {
        style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
      });
      return;
    }

    try {
      sessionStorage.setItem(
        "meal_ticket_guest",
        JSON.stringify({ name: trimmedName, phone: trimmedPhone }),
      );
    } catch {
      // ignore
    }

    setIsLoading(true);
    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name: trimmedName, phone: trimmedPhone }),
      });
      if (res.ok) {
        toast.success("정보가 등록되었습니다.", {
          style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
        });
      } else {
        toast.warning("서버에 저장되지 않았을 수 있습니다. 다음 단계로 이동합니다.", {
          style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
        });
      }
      navigate("/meal-ticket/transfer");
    } catch {
      toast.warning("서버에 연결할 수 없습니다. 다음 단계로 이동합니다.", {
        style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
      });
      navigate("/meal-ticket/transfer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-gray-900 font-['Gowun_Dodum']">
      <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="뒤로"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium font-['Noto_Serif_KR'] text-gray-800 flex-1 text-center pr-8">
            식권QR 사전 발급받기
          </h1>
        </div>

        <main className="px-6 py-6">
          <Progress value={33} className="h-2 mb-4 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-green-500" />
          <p className="text-sm text-gray-500 mb-1">단계1</p>
          <h2 className="text-lg font-medium text-green-600 mb-6">하객 정보 입력</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                이름
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-gray-200 bg-gray-50 h-12"
              />
            </div>

            {/* 핸드폰 번호 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                핸드폰 번호
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"         // 모바일 숫자 키패드
                autoComplete="tel"          // 핸드폰 번호 자동완성 허용
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}              // 010-0000-0000 = 13자
                className="w-full rounded-xl border-gray-200 bg-gray-50 h-12 tracking-widest"
              />
              {/* 번호 입력 가이드 */}
              <p className="text-xs text-gray-400 pl-1">
                숫자만 입력하면 자동으로 - 가 추가됩니다
              </p>
            </div>

            {/* ✅ 번호 완성 시 재확인 표시 */}
            {isPhoneComplete && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <span className="text-green-500 text-lg">✓</span>
                <div>
                  <p className="text-xs text-green-600 font-medium mb-0.5">입력하신 번호가 맞나요?</p>
                  <p className="text-base font-bold text-gray-800 tracking-widest">{phone}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152a47] active:bg-[#0f1f33] text-white font-medium transition-colors disabled:opacity-60 mt-8"
            >
              {isLoading ? "처리 중..." : "축의금 송금 및 식권QR 받기"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}