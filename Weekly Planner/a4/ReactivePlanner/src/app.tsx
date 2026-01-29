import { useEffect } from 'preact/hooks'
import { Settings } from './components/Settings.tsx'
import { Status } from './components/Status.tsx'
import { Middle } from './components/Middle.tsx'
import { EditPanel } from './components/EditPanel.tsx'
import { undo, redo, canUndo, canRedo, editingEvent } from './model'

export function App() {
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo.value) {
          undo()
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo.value) {
          redo()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Settings />
      <Middle />
      <Status />
      <EditPanel key={editingEvent.value?.id || 'closed'} />
    </div>
  )
}
