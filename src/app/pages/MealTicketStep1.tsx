import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8ec7463/meal-ticket/guest`;

export function MealTicketStep1() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!trimmedPhone) {
      toast.error("핸드폰 번호를 입력해주세요.", {
        style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
      });
      return;
    }
    // 다음 화면(식권 선택/QR 결과)에서 표시할 기본 정보 저장
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
        // API 미배포 또는 서버 오류 시: 안내 후 다음 단계로 진행
        toast.warning("서버에 저장되지 않았을 수 있습니다. 다음 단계로 이동합니다.", {
          style: { background: "#333", color: "#fff", border: "none", fontFamily: "'Gowun Dodum', sans-serif" },
        });
      }
      navigate("/meal-ticket/transfer");
    } catch {
      // 네트워크 오류 등: 안내 후 다음 단계로 진행 (배포 전에도 플로우 사용 가능)
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
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                핸드폰 번호
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border-gray-200 bg-gray-50 h-12"
              />
            </div>

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
