import { useState, useEffect } from 'preact/hooks'
import { updateEvent, editingEvent } from '../model'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function EditPanel() {
  const event = editingEvent.value
  if (!event) return null
  
  const [description, setDescription] = useState(event.description)
  const [day, setDay] = useState(event.day)
  const [start, setStart] = useState(event.start)
  const [end, setEnd] = useState(event.end)
  
  // Reset form whenever the panel opens (including reopening the same event)
  useEffect(() => {
    setDescription(event.description)
    setDay(event.day)
    setStart(event.start)
    setEnd(event.end)
  }, [editingEvent.value]) // Watch the editingEvent signal directly
  
  // Validation for description only (times auto-constrain)
  const isDescriptionValid = description.length > 0 && !description.startsWith(' ')
  
  // Handle description changes with validation
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }
  
  // Handle start time changes with auto-constraint
  const handleStartChange = (value: number) => {
    // Constrain start time to 0-23
    const constrainedStart = Math.max(0, Math.min(23, value))
    setStart(constrainedStart)
    
    // If start >= end, set end to start + 1 (but respect end's max of 24)
    if (constrainedStart >= end) {
      setEnd(Math.min(24, constrainedStart + 1))
    }
  }
  
  // Handle end time changes with auto-constraint  
  const handleEndChange = (value: number) => {
    // Constrain end time to 1-24
    const constrainedEnd = Math.max(1, Math.min(24, value))
    
    // If end <= start, set start to end - 1 (but respect start's min of 0)
    if (constrainedEnd <= start) {
      setStart(Math.max(0, constrainedEnd - 1))
    }
    
    setEnd(constrainedEnd)
  }
  
  const handleSave = () => {
    if (!isDescriptionValid) return
    
    updateEvent(event.id, {
      description: description.trim(),
      day,
      start,
      end
    })
    editingEvent.value = null
  }
  
  const handleCancel = () => {
    editingEvent.value = null
  }
  
  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-[60px]"
      style={{ background: 'rgba(32,32,32,0.4)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleCancel()
      }}
    >
      <div className="bg-gray-100 border border-black p-[30px] w-full h-full flex flex-col gap-2.5">
        {/* Description Row */}
        <div className="flex items-center gap-2.5">
          <label className="w-[80px] text-right text-base">Description:</label>
          <input
            type="text"
            value={description}
            onInput={(e) => handleDescriptionChange((e.target as HTMLInputElement).value)}
            className={`flex-1 min-w-0 px-2 py-1 border rounded ${
              !isDescriptionValid 
                ? 'border-red-500 bg-red-50 text-red-600' 
                : 'border-gray-400 bg-white text-black'
            }`}
            placeholder="Enter event description"
            maxLength={100}
          />
        </div>
        
        {/* Day of Week Row */}
        <div className="flex items-center gap-2.5">
          <label className="w-[80px] text-right text-base">Day:</label>
          <select
            value={day}
            onChange={(e) => setDay(Number((e.target as HTMLSelectElement).value))}
            className="flex-1 px-2 py-1 border border-gray-400 rounded bg-white"
          >
            {DAYS.map((dayName, index) => (
              <option key={index} value={index}>{dayName}</option>
            ))}
          </select>
        </div>
        
        {/* Start Time Row */}
        <div className="flex items-center gap-2.5">
          <label className="w-[80px] text-right text-base">Start:</label>
          <input
            type="number"
            min="0"
            max="23"
            value={start}
            onInput={(e) => handleStartChange(Number((e.target as HTMLInputElement).value))}
            className="flex-1 px-2 py-1 border border-gray-400 rounded bg-white"
          />
        </div>
        
        {/* End Time Row */}
        <div className="flex items-center gap-2.5">
          <label className="w-[80px] text-right text-base">End:</label>
          <input
            type="number"
            min="1"
            max="24"
            value={end}
            onInput={(e) => handleEndChange(Number((e.target as HTMLInputElement).value))}
            className="flex-1 px-2 py-1 border border-gray-400 rounded bg-white"
          />
        </div>
        
        {/* Buttons Row */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleSave}
            disabled={!isDescriptionValid}
            className={`px-6 py-2 border border-gray-300 rounded ${
              isDescriptionValid 
                ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
