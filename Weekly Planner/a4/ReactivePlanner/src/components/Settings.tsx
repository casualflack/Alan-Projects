import { undo, redo, toggleMode, canUndo, canRedo, mode, canGoToAgenda } from '../model'

export function Settings() {
  // Access signal values to create reactive dependencies
  const currentMode = mode.value
  const isAgendaMode = currentMode === 'agenda'
  const undoEnabled = canUndo.value
  const redoEnabled = canRedo.value
  const agendaEnabled = canGoToAgenda.value
  
  return (
    <div className={`p-2 flex justify-between items-center ${isAgendaMode ? 'bg-blue-200' : 'bg-gray-300'}`}>
      {/* Only show undo/redo in overview mode */}
      {!isAgendaMode && (
        <div className="flex gap-x-2.5">
          <button 
            className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!undoEnabled}
            onClick={undo}
          >
            Undo
          </button>
          <button 
            className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!redoEnabled}
            onClick={redo}
          >
            Redo
          </button>
        </div>
      )}
      
      {/* Add empty div for spacing in agenda mode */}
      {isAgendaMode && <div></div>}
      
      <button 
        className="w-[128px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentMode === 'overview' && !agendaEnabled}
        onClick={toggleMode}
      >
        {currentMode === 'overview' ? 'Agenda' : 'Overview'}
      </button>
    </div>
  )
}
