// import TempStorage from "./TempStorage";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="w-full h-16 shrink-0 flex items-center justify-between px-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* 로고 */}
        <img src={logo} alt="Snab" className="size-8 rounded" />
        <h1 className="text-xl font-bold text-gray-800">Snab</h1>
        <h2 className="text-sm text-gray-500">Tab Management</h2>
      </div>
    </header>
  );
};

export default Header;
