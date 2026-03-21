import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Copy, Gift, ArrowUpRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  groomAccounts,
  brideAccounts,
  handleKakaoPay,
  handleToss,
  type Account,
} from "../lib/mealTicketAccounts";

function AccountCard({ acc }: { acc: Account }) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("계좌번호가 복사되었습니다.", {
      style: {
        background: "#333",
        color: "#fff",
        border: "none",
        fontFamily: "'Gowun Dodum', sans-serif",
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 font-medium">{acc.bank}</span>
        <span className="text-gray-800 font-semibold">{acc.name}</span>
      </div>
      <div className="text-base tracking-widest text-gray-700 font-mono text-center py-2">
        {acc.number}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <button
          type="button"
          onClick={() => handleCopy(acc.number)}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs text-gray-700 transition-colors"
        >
          <Copy className="w-4 h-4 text-gray-500" />
          <span>복사하기</span>
        </button>
        <button
          type="button"
          onClick={() => handleKakaoPay(acc)}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-[#FEE500] hover:bg-[#FADA0A] active:bg-[#F3D000] text-[#191919] rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <Gift className="w-4 h-4" />
          <span>카카오페이</span>
        </button>
        <button
          type="button"
          onClick={() => handleToss(acc)}
          className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-[#0050FF] hover:bg-[#0040D0] active:bg-[#0030B0] text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>토스페이</span>
        </button>
      </div>
    </div>
  );
}

export function MealTicketStep2() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("groom");

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
          <Progress value={66} className="h-2 mb-4 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-green-500" />
          <p className="text-sm text-gray-500 mb-1">단계2</p>
          <h2 className="text-lg font-medium text-green-600 mb-4">축의금 송금 수단 선택</h2>

       

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="groom" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                신랑 측
              </TabsTrigger>
              <TabsTrigger value="bride" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                신부 측
              </TabsTrigger>
            </TabsList>
            <TabsContent value="groom" className="space-y-4 mt-0">
              {groomAccounts.map((acc, idx) => (
                <AccountCard key={idx} acc={acc} />
              ))}
            </TabsContent>
            <TabsContent value="bride" className="space-y-4 mt-0">
              {brideAccounts.map((acc, idx) => (
                <AccountCard key={idx} acc={acc} />
              ))}
            </TabsContent>
          </Tabs>

          <p className="text-red-600 text-sm mt-4 flex items-center gap-1">
            <span aria-hidden>*</span>
            5만원 이상만 식권 발급 가능
          </p>

          <div className="space-y-3">
          <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800">
          참석이 어려우신 분들은 계좌이체만 진행 하시고 <br/> 본 화면 이탈 하셔도 됩니다.
          </h2>
          </div>
          
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] p-4 bg-white border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/meal-ticket")}
            className="flex-1 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => navigate("/meal-ticket/confirm")}
            className="flex-1 py-4 rounded-xl bg-[#1e3a5f] hover:bg-[#152a47] text-white font-medium transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
