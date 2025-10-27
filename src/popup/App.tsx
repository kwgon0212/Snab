import logo from "@/assets/logo.png";
import qrCode from "@/assets/kakaopay.jpg";

export default function App() {
  return (
    <div className="w-[300px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      {/* 헤더 섹션 */}
      <div className="px-4 py-2 flex items-center justify-start gap-2">
        <img src={logo} alt="Snab Logo" className="w-8 h-8 rounded" />
        <h1 className="text-xl font-semibold text-white drop-shadow-lg">
          Snab
        </h1>
      </div>

      {/* 후원 섹션 */}
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <p className="text-sm leading-relaxed opacity-90">
          Snab이 도움이 되셨다면
          <br />
          커피 한 잔 어떠신지요 ㅎㅎ..
        </p>

        {/* QR 코드 섹션 */}
        <div className="mb-6">
          <div className="flex justify-center mb-3">
            {/* 실제 QR 코드 이미지를 여기에 넣으세요 */}
            <img
              src={qrCode}
              alt="후원 QR 코드"
              className="w-full aspect-square object-contain rounded-md"
            />
          </div>
          <p className="text-xs opacity-80 font-medium">
            QR 코드를 스캔하여 후원하기
          </p>
        </div>
      </div>
    </div>
  );
}
