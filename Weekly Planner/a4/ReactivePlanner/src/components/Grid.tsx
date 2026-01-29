import { events, editingEvent, updateEvent } from '../model'
import { EventComponent } from './EventComponent.tsx'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function Grid() {
  const allEvents = events.value // This creates a reactive dependency
  
  const handleDoubleClick = (event: any, e: MouseEvent) => {
    e.preventDefault()
    editingEvent.value = event
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent, dayIndex: number) => {
    e.preventDefault()
    const eventId = Number(e.dataTransfer?.getData('text/plain'))
    if (!eventId) return
    
    const event = allEvents.find(ev => ev.id === eventId)
    if (!event) return

    const offsetY = Number(e.dataTransfer?.getData('offsetY')) || 0
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const y = e.clientY - rect.top - offsetY
    const bodyHeight = rect.height
    const pxPerHour = bodyHeight / 24
    const newStart = Math.max(0, Math.min(23, Math.floor(y / pxPerHour)))
    const duration = event.end - event.start
    const newEnd = Math.min(24, newStart + duration)

    updateEvent(eventId, {
      day: dayIndex,
      start: newStart,
      end: newEnd
    })
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Headers */}
      <div className="grid grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="p-1 text-sm font-medium bg-gray-50 h-8 text-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Grid body */}
      <div className="flex-1 grid grid-cols-7">
        {DAYS.map((_, dayIndex) => (
          <div 
            key={dayIndex} 
            className={`relative bg-white h-full ${
              dayIndex < DAYS.length - 1 ? 'border-r border-gray-300' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, dayIndex)}
          >
            {/* Hour lines */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div 
                key={hour} 
                className="absolute w-full border-b border-gray-300" 
                style={{ 
                  top: `${(hour / 24) * 100}%`,
                  height: '1px'
                }}
              />
            ))}
            
            {/* Events for this day */}
            {allEvents
              .filter(event => event.day === dayIndex)
              .map(event => (
                <EventComponent 
                  key={event.id} 
                  event={event}
                  onDoubleClick={(e: MouseEvent) => handleDoubleClick(event, e)}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
