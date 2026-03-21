import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu, PenLine } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import React from "react";

interface GuestbookEntry {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b8ec7463/guestbook`;

  const fetchEntries = async () => {
    try {
      const res = await fetch(SERVER_URL, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("이름과 내용을 모두 입력해주세요.");
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
        body: JSON.stringify({ name, content }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      
      setName("");
      setContent("");
      setIsModalOpen(false);
      toast.success("방명록이 등록되었습니다.");
      fetchEntries();
    } catch (error) {
      toast.error("등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("삭제되었습니다.");
      fetchEntries();
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <section className="py-20 px-6 bg-[#F5F5F5] font-['Gowun_Dodum'] relative min-h-[400px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="space-y-6 max-w-sm mx-auto flex flex-col"
      >
        <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800 text-center mb-4">
          방명록
        </h2>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-gray-400 py-10 bg-white rounded-sm shadow-sm">첫 번째 방명록을 남겨주세요!</p>
          ) : (
            entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="bg-white p-5 rounded-sm shadow-sm">
                <div className="text-sm mb-3">
                  <span className="text-gray-400 mr-1">FROM.</span>
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <p className="text-gray-800 leading-relaxed text-[15px] mb-6 whitespace-pre-wrap">
                  {entry.content}
                </p>
                <div className="flex justify-end items-center text-[13px] text-gray-400 space-x-2">
                  <span>{formatDate(entry.createdAt)}</span>
                  <button onClick={() => handleDelete(entry.id)} className="p-1 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center space-x-3 pt-6">
          <button className="flex-1 flex items-center justify-center space-x-2 bg-[#EAEAEA] py-3 rounded-md text-gray-700 font-medium text-sm transition-colors hover:bg-gray-200">
            <Menu className="w-4 h-4" />
            <span>전체보기</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#EAEAEA] py-3 rounded-md text-gray-700 font-medium text-sm transition-colors hover:bg-gray-200"
          >
            <PenLine className="w-4 h-4" />
            <span>작성하기</span>
          </button>
        </div>
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
              className="relative w-full max-w-[90%] sm:max-w-[400px] bg-white rounded-lg shadow-xl overflow-hidden z-10 font-['Gowun_Dodum']"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-6 pb-6 space-y-6">
                <div>
                  <h2 className="text-[22px] font-bold text-gray-800 font-['Noto_Serif_KR']">
                    방명록 작성하기
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">방명록을 작성해주세요!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="성함을 입력해주세요."
                    className="w-full bg-[#F9F9F9] p-4 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400 text-sm"
                    maxLength={20}
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해주세요 (비방, 욕설, 정치적 성향의 글은 임의로 삭제되며 형사처벌의 대상이 될 수 있습니다.)"
                    className="w-full bg-[#F9F9F9] p-4 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400 placeholder:leading-relaxed h-32 resize-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-medium py-4 rounded-md mt-2 disabled:bg-gray-400"
                  >
                    {isLoading ? "등록 중..." : "작성하기"}
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
