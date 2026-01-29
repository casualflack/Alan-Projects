import { Toolbar } from './Toolbar.tsx'
import { Grid } from './Grid.tsx'

export function Overview() {
  return (
    <div className="h-full flex flex-col overflow-hidden border border-black">
      <Toolbar />
      <Grid />
    </div>
  )
}

