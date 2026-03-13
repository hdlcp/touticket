// EntityPage.jsx
import { useState } from "react";
import Hero from "./TouticketComponents/Hero";
import Billetterie from "./TouticketComponents/Billeterie";
import Votes from "./TouticketComponents/Vote";
import { Search } from "lucide-react";

const tabs = [
  { id: "billetterie", label: "Billetterie" },
  { id: "votes", label: "Votes & Élections", isNew: true },
];

export default function EntityPage() {
  const [activeTab, setActiveTab] = useState("billetterie");

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

    {/* Tab bar */}

  <div className="flex justify-center  px-4 py-10">

    {/* Conteneur arrondi */}
    <div className="flex items-center border border-gray-300 bg-gray-100 rounded-full p-1 relative">

      {tabs.map((tab) => (
        <div key={tab.id} className="relative">
          
          {/* Badge Nouveau */}
          {tab.isNew && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-[2px] rounded-full leading-none">
              Nouveau
            </span>
          )}

          <button
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-60
              ${
                activeTab === tab.id
                  ? "bg-white border border-[#E95503] text-[#E95503] shadow-sm"
                  : "text-gray-500"
              }
            `}
          >
            {tab.label}
          </button>
        </div>
      ))}

    </div>



</div>
      {/* Search */}
              <form onSubmit="" className="mx-auto relative w-full px-4 sm:px-6 max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value=""
                  onChange=""
                  className="w-full px-4 py-1 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div
                  type="submit"
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-1 rounded-lg hover:bg-orange-600"
                >
                  <Search className="w-4 h-4" />
                </div>
              </form>
      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {activeTab === "billetterie" && <Billetterie />}
        {activeTab === "votes" && <Votes />}
      </div>
    </div>
  );
}