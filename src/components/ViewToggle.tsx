'use client'

type ViewMode = 'grid' | 'map'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-[#F7F7F7] rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span className="font-medium text-sm hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => onViewModeChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        <span className="font-medium text-sm hidden sm:inline">Map</span>
      </button>
    </div>
  )
}
