import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Progress } from "../components/ui/progress";

export function MealTicketConfirm() {
  const navigate = useNavigate();

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

        <main className="px-6 py-6 flex-1 pb-28 flex flex-col">
          <Progress
            value={66}
            className="h-2 mb-4 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-green-500"
          />
          <p className="text-sm text-gray-500 mb-8">단계2</p>

          <div className="flex flex-col items-center justify-center flex-1">
            <h2 className="text-lg font-medium text-gray-700 mb-10">
              결제 확인 중 입니다
            </h2>
            <div className="w-56 h-56 rounded-full bg-blue-300/70" />
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] p-4 bg-white border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/meal-ticket/transfer")}
            className="flex-1 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => navigate("/meal-ticket/select")}
            className="flex-1 py-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152a47] text-white font-medium transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

