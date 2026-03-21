import { motion } from "motion/react";
import React from "react";

export function GreetingSection() {
  return (
    <section className="py-20 px-8 text-center bg-white space-y-12 border-b border-gray-100 font-['Gowun_Dodum']">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="space-y-6 text-gray-700 leading-loose"
      >
        <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800 mb-8">
          초대합니다
        </h2>
        <p>
          서로가 마주 보며 다져온 사랑을
          <br />
          이제 함께 한 곳을 바라보며 걸어갈 수 있는
          <br />
          큰 사랑으로 키우고자 합니다.
          <br />
          <br />
          저희 두 사람이 사랑의 이름으로 지켜나갈 수 있게
          <br />
          앞날을 축복해 주시면 감사하겠습니다.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
        }}
        className="space-y-4"
      >
        <div className="flex justify-center items-center space-x-2 text-lg">
          <span className="font-semibold text-gray-800">김철수 · 박영희</span>
          <span className="text-sm text-gray-500">의 장남</span>
          <span className="font-semibold text-gray-800 ml-2">성민</span>
        </div>
        <div className="flex justify-center items-center space-x-2 text-lg">
          <span className="font-semibold text-gray-800">이동국 · 최수진</span>
          <span className="text-sm text-gray-500">의 차녀</span>
          <span className="font-semibold text-gray-800 ml-2">지은</span>
        </div>
      </motion.div>
    </section>
  );
}
