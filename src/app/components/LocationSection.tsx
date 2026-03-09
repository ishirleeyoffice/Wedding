import { motion } from "motion/react";
import { MapPin, Phone, Car, Train } from "lucide-react";

export function LocationSection() {
  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100 font-['Gowun_Dodum']">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium font-['Noto_Serif_KR'] text-gray-800">
            오시는 길
          </h2>
          <p className="text-gray-600 leading-relaxed">
            서울 중구 동호로 249<br />
            신라호텔 영빈관 1층
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative shadow-inner">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.090623321453!2d127.0042456!3d37.5555431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca310214a1f59%3A0xc6fbef1a8684bbd5!2sThe%20Shilla%20Seoul!5e0!3m2!1sen!2skr!4v1700000000000!5m2!1sen!2skr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="space-y-6 text-sm text-gray-700 pt-4">
          <div className="flex gap-4 items-start">
            <div className="bg-gray-50 p-2 rounded-full text-gray-400 shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">지하철 이용시</h3>
              <p className="leading-relaxed">
                3호선 동대입구역 5번 출구<br />
                도보 5분 거리
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-gray-50 p-2 rounded-full text-gray-400 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">자가용 이용시</h3>
              <p className="leading-relaxed">
                호텔 내 주차장 이용 가능 (하객 3시간 무료)<br />
                만차 시 인근 공영주차장 이용
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
