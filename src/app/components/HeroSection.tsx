import { motion } from "motion/react";
import { CalendarHeart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FBF9F6]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[90%] mx-auto mt-12 mb-8 relative"
      >
        <div className="aspect-[3/4] rounded-t-full overflow-hidden shadow-lg border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1660294502608-d65e5c62f244?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB3ZWRkaW5nJTIwY291cGxlfGVufDF8fHx8MTc3Mjg0MzE2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Wedding Couple"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center space-y-6 pb-20 font-['Noto_Serif_KR']"
      >
        <div className="space-y-2">
          <p className="text-sm tracking-widest text-gray-500 uppercase">
            Wedding Invitation
          </p>
          <h1 className="text-3xl font-medium text-gray-800 tracking-wider">
            김성민 <span className="text-pink-300 mx-2">&hearts;</span> 이지은
          </h1>
        </div>

        <div className="space-y-1 text-gray-600 font-['Gowun_Dodum']">
          <p>2026년 5월 24일 토요일 오후 1시</p>
          <p>서울 신라호텔 영빈관 1층</p>
        </div>
      </motion.div>
    </section>
  );
}
