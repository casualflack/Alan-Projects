import { mode } from '../model'
import { Overview } from './Overview.tsx'
import { Agenda } from './Agenda.tsx'

export function Middle() {
  return (
    <div className="flex-1 p-2 overflow-hidden">
      { mode.value === 'overview' ? <Overview /> : <Agenda /> }
    </div>
  )
}
