import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

function clampTicketCount(n: number) {
  if (n < 0) return 0;
  if (n > 2) return 2;
  return n;
}

export function MealTicketSelect() {
  const navigate = useNavigate();
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [parking, setParking] = useState(false);
  const [carNumber, setCarNumber] = useState("");

  const totalCount = useMemo(() => adultCount + childCount, [adultCount, childCount]);

  const handleCarNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    setCarNumber(digitsOnly);
  };

  const handleNext = () => {
    try {
      sessionStorage.setItem(
        "meal_ticket_selection",
        JSON.stringify({
          adultCount,
          childCount,
          parking,
          carNumber,
        }),
      );
    } catch {
      // ignore
    }
    navigate("/meal-ticket/result");
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-gray-900 font-['Gowun_Dodum']">
      <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative flex flex-col">
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

        <main className="px-6 py-6 flex-1 pb-28">
          <Progress
            value={85}
            className="h-2 mb-4 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-green-500"
          />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              식권 선택 해 주세요
            </h2>
            <span className="text-sm font-medium text-green-600">단계3</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">성인</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdultCount((v) => clampTicketCount(v - 1))}
                  disabled={adultCount === 0}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="성인 감소"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-20 h-10 rounded-md bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
                  {adultCount}
                </div>
                <button
                  type="button"
                  onClick={() => setAdultCount((v) => clampTicketCount(v + 1))}
                  disabled={adultCount === 2}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="성인 증가"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">아이</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildCount((v) => clampTicketCount(v - 1))}
                  disabled={childCount === 0}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="아이 감소"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-20 h-10 rounded-md bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
                  {childCount}
                </div>
                <button
                  type="button"
                  onClick={() => setChildCount((v) => clampTicketCount(v + 1))}
                  disabled={childCount === 2}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="아이 증가"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-blue-700 font-medium pl-1">
              ※ 7살 이상만 선택
            </p>
          </div>

          <div className="mt-10 space-y-5">
            <h3 className="text-base font-semibold text-gray-900">
              주차권 여부를 선택 해 주세요
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">주차권</span>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={parking}
                  onCheckedChange={(v) => setParking(Boolean(v))}
                  className="size-5 rounded-[4px]"
                  aria-label="주차권 선택"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="carNumber" className="text-base font-semibold text-gray-900">
                차량번호
              </Label>
              <div className="w-32">
                <Input
                  id="carNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={carNumber}
                  onChange={(e) => handleCarNumberChange(e.target.value)}
                  placeholder="1234"
                  className="h-11 rounded-md bg-gray-100 border-gray-200 text-center font-semibold tracking-widest"
                  aria-label="차량번호 4자리"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              선택된 식권: 성인 {adultCount}명, 아이 {childCount}명 (총 {totalCount}명)
            </p>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] p-4 bg-white border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/meal-ticket/confirm")}
            className="flex-1 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152a47] text-white font-medium transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

