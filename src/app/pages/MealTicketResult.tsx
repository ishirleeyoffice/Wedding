import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

type GuestInfo = { name: string; phone: string };
type SelectionInfo = {
  adultCount: number;
  childCount: number;
  parking: boolean;
  carNumber: string;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function MealTicketResult() {
  const navigate = useNavigate();

  const guest = useMemo(() => {
    const g = safeParse<GuestInfo>(sessionStorage.getItem("meal_ticket_guest"));
    return g ?? { name: "홍길동", phone: "" };
  }, []);

  const selection = useMemo(() => {
    const s = safeParse<SelectionInfo>(
      sessionStorage.getItem("meal_ticket_selection"),
    );
    return (
      s ?? { adultCount: 0, childCount: 0, parking: false, carNumber: "" }
    );
  }, []);

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

        <main className="px-6 py-10 flex-1 pb-28 text-center">
          <div className="space-y-1 mb-6">
            <p className="text-base font-medium text-gray-900">
              신랑 김성민, 신부 이지은
            </p>
            <p className="text-base font-medium text-gray-900"> 2026년 5월 24일 토요일 오후 1시</p>
          </div>

          <div className="mx-auto w-64 h-64 bg-white border-2 border-gray-300 flex items-center justify-center">
            <div className="w-56 h-56 grid grid-cols-7 grid-rows-7 gap-1">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={i % 3 === 0 || i % 7 === 0 ? "bg-black" : "bg-white"}
                />
              ))}
            </div>
          </div>

          <p className="text-base font-semibold text-gray-900 mt-6">
            하객 전용 QR코드
          </p>

          <div className="mt-6 space-y-2 text-gray-900">
            <p className="text-lg font-semibold">{guest.name}</p>
            <p className="text-base font-semibold">
              성인 {selection.adultCount}명, 아이 {selection.childCount}명
            </p>
            {selection.parking && (
              <p className="text-sm font-medium text-gray-700">
                주차권: 신청{selection.carNumber ? ` (차량번호 ${selection.carNumber})` : ""}
              </p>
            )}
          </div>

        
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] p-4 bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152a47] text-white font-medium transition-colors"
          >
            결과 확인
          </button>
        </div>
      </div>
    </div>
  );
}

