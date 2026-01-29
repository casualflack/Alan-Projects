import { type Event, toggleEventSelection, events } from '../model'

interface EventComponentProps {
  event: Event
  onDoubleClick: (e: MouseEvent) => void
  isDragging?: boolean
}

export function EventComponent({ event, onDoubleClick, isDragging }: EventComponentProps) {
  // Get the current event state reactively from the signal
  const currentEvent = events.value.find(e => e.id === event.id) || event
  
  const duration = currentEvent.end - currentEvent.start
  const minHeight = 1.25 // hours minimum per requirements
  const height = Math.max(duration, minHeight)
  
  const top = (currentEvent.start / 24) * 100
  const eventHeight = (height / 24) * 100
  
  const handleCheckboxChange = () => {
    toggleEventSelection(currentEvent.id)
  }

  const handleMouseDown = (e: MouseEvent) => {
    // Prevent drag if clicking on checkbox
    const target = e.target as HTMLInputElement
    if (target.type === 'checkbox') {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const handleDragStart = (e: DragEvent) => {
    // Don't allow drag if starting from checkbox
    const target = e.target as HTMLInputElement
    if (target.type === 'checkbox') {
      e.preventDefault()
      return false
    }
    
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', String(currentEvent.id))
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      const offsetY = e.clientY - rect.top
      e.dataTransfer.setData('offsetY', String(offsetY))
    }
  }
  
  return (
    <div
      className={`absolute w-full border border-black mb-0.5 px-1 cursor-move select-none transition-colors ${
        isDragging ? 'bg-blue-400 opacity-75' : 'bg-blue-200 hover:bg-blue-300'
      }`}
      style={{
        top: `${top}%`,
        height: `${eventHeight}%`,
        //minHeight: '30px', 
        zIndex: isDragging ? 10 : 1,
        left: '1px',
        right: '1px'
      }}
      onDblClick={onDoubleClick}
      onMouseDown={handleMouseDown}
      draggable={true}
      onDragStart={handleDragStart}
    >
      <input
        type="checkbox"
        checked={currentEvent.selected}
        onChange={handleCheckboxChange}
        className="mt-1 ml-1 mr-1 size-3 cursor-pointer"
        onMouseDown={(e) => e.stopPropagation()}
        draggable={false}
      />
      <span className="text-sm mt-0.125 leading-tight break-words overflow-hidden">
        {currentEvent.description}
      </span>
    </div>
  )
}
