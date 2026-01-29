import { events, selectedCount, mode, selectedEvents, agendaIndex } from '../model'

export function Status() {
  const eventCount = events.value.length
  const selected = selectedCount.value
  const currentMode = mode.value
  const currentAgendaIndex = agendaIndex.value
  const agendaEvents = selectedEvents.value
  
  // Different status message for agenda mode
  if (currentMode === 'agenda') {
    if (agendaEvents.length === 0) {
      return <div className="bg-gray-300 p-2.5">No events selected</div>
    }
    return (
      <div className="bg-gray-300 p-2.5">
        Event {currentAgendaIndex + 1} of {agendaEvents.length}
      </div>
    )
  }
  
  // Overview mode status (existing logic)
  if (eventCount === 0) {
    return <div className="bg-gray-300 p-2.5">0 events</div>
  }
  
  const eventText = eventCount === 1 ? '1 event' : `${eventCount} events`
  const selectedText = selected > 0 ? ` (${selected} selected)` : ''
  
  return (
    <div className="bg-gray-300 p-2.5">
      {eventText}{selectedText}
    </div>
  )
}
