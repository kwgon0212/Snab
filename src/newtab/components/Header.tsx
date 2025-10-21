import TempStorage from "./TempStorage";

const Header = () => {
  return (
    <header className="w-full h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        {/* 로고 */}
        <div className="w-8 h-8 bg-blue-500 rounded" />
        <h1 className="text-xl font-bold text-gray-800">Snab</h1>
        <h2 className="text-sm text-gray-500">Tab Management</h2>
      </div>

      <TempStorage />
    </header>
  );
};

export default Header;
