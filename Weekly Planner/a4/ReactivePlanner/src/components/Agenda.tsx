import { useEffect } from 'preact/hooks'
import { selectedEvents, agendaIndex, nextAgenda, prevAgenda, toggleMode } from '../model'

export function Agenda() {
  const selected = selectedEvents.value
  const currentIndex = agendaIndex.value
  
  // Handle Escape key to return to overview mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleMode() // Switch back to overview mode
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  if (selected.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>No events selected for agenda view</p>
      </div>
    )
  }
  
  const currentEvent = selected[currentIndex]
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  return (
    <div className="h-full flex items-center justify-center p-[60px]">
      {/* Slideshow section with white background and black border */}
      <div className="bg-white border border-black w-full h-full flex flex-col">
        {/* Event details - centered in the middle area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{currentEvent.description}</h2>
            <p className="text-xl">
              {DAYS[currentEvent.day]}, {currentEvent.start}:00-{currentEvent.end}:00
            </p>
          </div>
        </div>
        
        {/* Navigation buttons - horizontally centered at bottom */}
        <div className="flex justify-center gap-4 p-4">
          <button 
            className="w-[128px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            onClick={prevAgenda}
          >
            Previous
          </button>
          
          <button 
            className="w-[128px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === selected.length - 1}
            onClick={nextAgenda}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
