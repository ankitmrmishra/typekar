"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock leaderboard data with user information
const mockLeaderboardData = [
  {
    id: 1,
    username: "SpeedDemon",
    wpm: 127,
    accuracy: 98,
    words: 70,
    date: "2024-01-15",
    time: "45.2s",
    country: "US",
  },
  {
    id: 2,
    username: "KeyboardNinja",
    wpm: 124,
    accuracy: 96,
    words: 70,
    date: "2024-01-14",
    time: "46.1s",
    country: "CA",
  },
  {
    id: 3,
    username: "TypeMaster",
    wpm: 119,
    accuracy: 99,
    words: 70,
    date: "2024-01-13",
    time: "47.8s",
    country: "UK",
  },
  {
    id: 4,
    username: "QuickFingers",
    wpm: 116,
    accuracy: 94,
    words: 70,
    date: "2024-01-12",
    time: "48.9s",
    country: "DE",
  },
  {
    id: 5,
    username: "RapidTyper",
    wpm: 113,
    accuracy: 97,
    words: 70,
    date: "2024-01-11",
    time: "50.2s",
    country: "FR",
  },
  {
    id: 6,
    username: "FlashKeys",
    wpm: 109,
    accuracy: 95,
    words: 30,
    date: "2024-01-10",
    time: "21.4s",
    country: "JP",
  },
  {
    id: 7,
    username: "SwiftWriter",
    wpm: 107,
    accuracy: 93,
    words: 30,
    date: "2024-01-09",
    time: "22.1s",
    country: "AU",
  },
  {
    id: 8,
    username: "LightningType",
    wpm: 104,
    accuracy: 98,
    words: 30,
    date: "2024-01-08",
    time: "23.5s",
    country: "BR",
  },
  {
    id: 9,
    username: "TurboTypist",
    wpm: 102,
    accuracy: 91,
    words: 10,
    date: "2024-01-07",
    time: "8.9s",
    country: "IN",
  },
  {
    id: 10,
    username: "VelocityKeys",
    wpm: 98,
    accuracy: 96,
    words: 10,
    date: "2024-01-06",
    time: "9.2s",
    country: "KR",
  },
  {
    id: 11,
    username: "BlazingKeys",
    wpm: 95,
    accuracy: 92,
    words: 70,
    date: "2024-01-05",
    time: "52.1s",
    country: "ES",
  },
  {
    id: 12,
    username: "RocketTyper",
    wpm: 93,
    accuracy: 89,
    words: 70,
    date: "2024-01-04",
    time: "53.8s",
    country: "IT",
  },
  {
    id: 13,
    username: "ThunderKeys",
    wpm: 91,
    accuracy: 94,
    words: 30,
    date: "2024-01-03",
    time: "24.2s",
    country: "NL",
  },
  {
    id: 14,
    username: "StormTypist",
    wpm: 89,
    accuracy: 96,
    words: 30,
    date: "2024-01-02",
    time: "25.1s",
    country: "SE",
  },
  {
    id: 15,
    username: "CyberKeys",
    wpm: 87,
    accuracy: 88,
    words: 10,
    date: "2024-01-01",
    time: "10.3s",
    country: "NO",
  },
  {
    id: 16,
    username: "DigitalDash",
    wpm: 85,
    accuracy: 93,
    words: 70,
    date: "2023-12-31",
    time: "55.4s",
    country: "FI",
  },
  {
    id: 17,
    username: "ByteBlaster",
    wpm: 83,
    accuracy: 90,
    words: 70,
    date: "2023-12-30",
    time: "56.7s",
    country: "DK",
  },
  {
    id: 18,
    username: "CodeCrusher",
    wpm: 81,
    accuracy: 95,
    words: 30,
    date: "2023-12-29",
    time: "26.8s",
    country: "CH",
  },
  {
    id: 19,
    username: "DataDasher",
    wpm: 79,
    accuracy: 87,
    words: 30,
    date: "2023-12-28",
    time: "27.9s",
    country: "AT",
  },
  {
    id: 20,
    username: "PixelPuncher",
    wpm: 77,
    accuracy: 92,
    words: 10,
    date: "2023-12-27",
    time: "11.2s",
    country: "BE",
  },
  {
    id: 21,
    username: "TechTornado",
    wpm: 75,
    accuracy: 89,
    words: 70,
    date: "2023-12-26",
    time: "58.3s",
    country: "PL",
  },
  {
    id: 22,
    username: "NetNinja",
    wpm: 73,
    accuracy: 91,
    words: 70,
    date: "2023-12-25",
    time: "59.6s",
    country: "CZ",
  },
  {
    id: 23,
    username: "WebWarrior",
    wpm: 71,
    accuracy: 86,
    words: 30,
    date: "2023-12-24",
    time: "29.1s",
    country: "HU",
  },
  {
    id: 24,
    username: "KeyKnight",
    wpm: 69,
    accuracy: 94,
    words: 30,
    date: "2023-12-23",
    time: "30.4s",
    country: "RO",
  },
  {
    id: 25,
    username: "TypeTitan",
    wpm: 67,
    accuracy: 88,
    words: 10,
    date: "2023-12-22",
    time: "12.7s",
    country: "BG",
  },
];

export default function Leaderboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<"all" | 10 | 30 | 70>(
    "all"
  );
  const [sortBy, setSortBy] = useState<"wpm" | "accuracy" | "date">("wpm");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on selected word count
  const filteredData = mockLeaderboardData.filter(
    (entry) => selectedFilter === "all" || entry.words === selectedFilter
  );

  // Sort data based on selected criteria
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "wpm":
        return b.wpm - a.wpm;
      case "accuracy":
        return b.accuracy - a.accuracy;
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: typeof sortBy) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push("/")}
                className="text-2xl font-light tracking-wider hover:text-white/60 transition-colors"
              >
                ← TYPING TEST
              </button>
            </div>
            <div className="text-2xl font-light tracking-wider">
              LEADERBOARD
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-sm font-medium tracking-wide text-white/60">
                FILTER BY WORDS
              </span>
              <div className="flex gap-2">
                {(["all", 10, 30, 70] as const).map((filter) => (
                  <button
                    key={filter}
                    className={cn(
                      "px-4 h-10 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                      "hover:border-white hover:bg-white hover:text-black",
                      selectedFilter === filter
                        ? "border-white bg-white text-black"
                        : ""
                    )}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter === "all" ? "ALL" : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-sm font-medium tracking-wide text-white/60">
                SORT BY
              </span>
              <div className="flex gap-2">
                {(["wpm", "accuracy", "date"] as const).map((sort) => (
                  <button
                    key={sort}
                    className={cn(
                      "px-4 h-10 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                      "hover:border-white hover:bg-white hover:text-black",
                      sortBy === sort ? "border-white bg-white text-black" : ""
                    )}
                    onClick={() => handleSortChange(sort)}
                  >
                    {sort.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm font-medium tracking-wide text-white/60">
            <div>
              SHOWING {startIndex + 1}-{Math.min(endIndex, sortedData.length)}{" "}
              OF {sortedData.length} RESULTS
            </div>
            <div>
              PAGE {currentPage} OF {totalPages}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="border border-white/10">
            {/* Table Header */}
            <div className="border-b border-white/10 px-8 py-6">
              <div className="grid grid-cols-8 gap-6 text-sm font-medium tracking-widest text-white/60">
                <div>RANK</div>
                <div>USER</div>
                <div>WPM</div>
                <div>ACCURACY</div>
                <div>WORDS</div>
                <div>TIME</div>
                <div>DATE</div>
                <div>COUNTRY</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {currentData.map((entry, index) => {
                const globalRank = startIndex + index + 1;
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      "px-8 py-6 hover:bg-white/5 transition-colors",
                      globalRank <= 3 ? "bg-white/[0.02]" : ""
                    )}
                  >
                    <div className="grid grid-cols-8 gap-6 items-center">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-8 h-8 flex items-center justify-center text-sm font-medium",
                            globalRank === 1 &&
                              "border border-white/40 text-white",
                            globalRank === 2 &&
                              "border border-white/30 text-white/80",
                            globalRank === 3 &&
                              "border border-white/20 text-white/60",
                            globalRank > 3 && "text-white/40"
                          )}
                        >
                          {globalRank}
                        </div>
                      </div>

                      <div className="font-medium tracking-wide">
                        {entry.username}
                      </div>

                      <div className="text-2xl font-light tracking-wide">
                        {entry.wpm}
                      </div>

                      <div className="text-lg font-light tracking-wide text-white/80">
                        {entry.accuracy}%
                      </div>

                      <div className="text-sm font-medium tracking-wide text-white/60">
                        {entry.words}
                      </div>

                      <div className="text-sm font-medium tracking-wide text-white/60">
                        {entry.time}
                      </div>

                      <div className="text-sm font-medium tracking-wide text-white/60">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>

                      <div className="text-sm font-medium tracking-wide text-white/60">
                        {entry.country}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-6 py-3 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                currentPage === 1
                  ? "text-white/40 border-white/10 cursor-not-allowed"
                  : "hover:border-white hover:bg-white hover:text-black"
              )}
            >
              PREVIOUS
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-12 h-12 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                      "hover:border-white hover:bg-white hover:text-black",
                      currentPage === pageNum
                        ? "border-white bg-white text-black"
                        : ""
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={cn(
                "px-6 py-3 border border-white/20 text-sm font-medium tracking-wide transition-all duration-200",
                currentPage === totalPages
                  ? "text-white/40 border-white/10 cursor-not-allowed"
                  : "hover:border-white hover:bg-white hover:text-black"
              )}
            >
              NEXT
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-8 pt-8">
            <div className="text-center space-y-2 border-r border-white/10">
              <div className="text-3xl font-light tracking-wider">
                {Math.max(...sortedData.map((d) => d.wpm))}
              </div>
              <div className="text-sm font-medium tracking-widest text-white/60">
                HIGHEST WPM
              </div>
            </div>

            <div className="text-center space-y-2 border-r border-white/10">
              <div className="text-3xl font-light tracking-wider">
                {Math.max(...sortedData.map((d) => d.accuracy))}%
              </div>
              <div className="text-sm font-medium tracking-widest text-white/60">
                BEST ACCURACY
              </div>
            </div>

            <div className="text-center space-y-2 border-r border-white/10">
              <div className="text-3xl font-light tracking-wider">
                {sortedData.length}
              </div>
              <div className="text-sm font-medium tracking-widest text-white/60">
                TOTAL USERS
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-light tracking-wider">
                {new Set(sortedData.map((d) => d.country)).size}
              </div>
              <div className="text-sm font-medium tracking-widest text-white/60">
                COUNTRIES
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-8">
            <button
              onClick={() => router.push("/")}
              className="px-12 py-4 border border-white/20 text-sm font-medium tracking-widest hover:border-white hover:bg-white hover:text-black transition-all duration-200"
            >
              TAKE NEW TEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
