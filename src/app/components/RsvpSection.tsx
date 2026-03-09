import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function RsvpSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestCount, setGuestCount] = useState("1");

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8ec7463/rsvp`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("성함을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name, attending, guestCount }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      
      setName("");
      setAttending("yes");
      setGuestCount("1");
      setIsModalOpen(false);
      toast.success("참석 정보가 전달되었습니다. 감사합니다!");
    } catch (error) {
      toast.error("등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100 font-['Gowun_Dodum'] text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="space-y-6 max-w-sm mx-auto"
      >
        <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800">
          참석 여부 전달
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          축하해주시는 모든 분들께 감사드리며,<br />
          원활한 예식 진행을 위해 참석 여부를 전달해주시면<br />
          정성껏 자리를 마련하겠습니다.
        </p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 px-6 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
        >
          참석 여부 전달하기
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto sm:px-0 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[90%] sm:max-w-[400px] bg-white rounded-lg shadow-xl overflow-hidden z-10 font-['Gowun_Dodum'] text-left"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 font-['Noto_Serif_KR']">
                  참석 여부
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold block">참석 여부</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAttending("yes")}
                        className={`flex-1 py-3 rounded-md border text-sm font-medium transition-colors ${attending === 'yes' ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500 bg-gray-50'}`}
                      >
                        참석할게요
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttending("no")}
                        className={`flex-1 py-3 rounded-md border text-sm font-medium transition-colors ${attending === 'no' ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 text-gray-500 bg-gray-50'}`}
                      >
                        마음만 전할게요
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-semibold block">성함</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="성함을 입력해주세요"
                      className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                    />
                  </div>

                  {attending === 'yes' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 font-semibold block">동행 인원</label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                      >
                        <option value="1">본인 (1명)</option>
                        <option value="2">2명</option>
                        <option value="3">3명</option>
                        <option value="4">4명</option>
                        <option value="5">5명 이상</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-medium py-4 rounded-md mt-4 disabled:bg-gray-400"
                  >
                    {isLoading ? "전송 중..." : "참석 정보 전달하기"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
