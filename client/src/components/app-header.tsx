import { useQuery } from "@tanstack/react-query";

export default function AppHeader() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/1"], // Default user for demo
  });

  return (
    <header className="glass-effect fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-coral to-sky rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate font-['Poppins']">LocalCurate</h1>
            <p className="text-xs text-gray-600 flex items-center">
              <svg className="w-3 h-3 text-coral mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {user?.location || "Downtown Seattle"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center relative hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7.8c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9S13.4 2.9 16.1 2.9 21 5.1 21 7.8z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-coral flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
