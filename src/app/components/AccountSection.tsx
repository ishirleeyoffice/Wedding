import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";

export function AccountSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-[#FAF9F8] border-t border-gray-100 font-['Gowun_Dodum'] pb-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="text-center space-y-8 max-w-sm mx-auto"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-50 rounded-full mb-2">
          <Heart className="w-5 h-5 text-pink-300" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800">
            마음 전하실 곳
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            참석이 어려우신 분들을 위해<br />계좌번호를 기재하였습니다.<br />너른 양해 부탁드립니다.
          </p>
        </div>

        <div className="space-y-3 pt-6">
          <button
            onClick={() => navigate("/meal-ticket")}
            className="w-full py-4 px-6 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex justify-between items-center"
          >
            <span>식권QR 사전 발급받기</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">이동</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
