import { signal, computed } from '@preact/signals'

export interface Event {
  id: number
  description: string
  selected: boolean
  day: number
  start: number
  end: number
}

interface Command {
  do(): void
  undo(): void
}

class UndoManager {
  private undoStack: Command[] = []
  private redoStack: Command[] = []
  private undoState = signal(0) // Trigger reactivity when undo state changes
  
  execute(command: Command) {
    command.do() // Execute the command immediately
    this.undoStack.push(command)
    this.redoStack = []
    this.undoState.value++ // Trigger reactivity
  }

  undo() {
    const command = this.undoStack.pop()
    if (command) {
      this.redoStack.push(command)
      command.undo()
      this.undoState.value++ // Trigger reactivity
    }
  }

  redo() {
    const command = this.redoStack.pop()
    if (command) {
      this.undoStack.push(command)
      command.do()
      this.undoState.value++ // Trigger reactivity
    }
  }

  get canUndo() {
    this.undoState.value // Access signal to create dependency
    return this.undoStack.length > 0
  }

  get canRedo() {
    this.undoState.value // Access signal to create dependency
    return this.redoStack.length > 0
  }

  clear() {
    this.undoStack = []
    this.redoStack = []
    this.undoState.value++ // Trigger reactivity
  }
}

// Event bank 
const eventBank = [
  { description: "laundry", day: 0, start: 15, end: 16 },
  { description: "gym", day: 6, start: 8, end: 11 },
  { description: "dentist appointment", day: 2, start: 11, end: 12 },
  { description: "get groceries", day: 0, start: 13, end: 15 },
  { description: "meal prep", day: 0, start: 19, end: 22 },
  { description: "walk the dog", day: 1, start: 7, end: 8 },
  { description: "visit post office", day: 4, start: 9, end: 10 },
  { description: "clean the kitchen", day: 6, start: 14, end: 15 },
  { description: "cs349 lecture 1", day: 1, start: 13, end: 15 },
  { description: "cs349 lecture 2", day: 3, start: 13, end: 15 },
  { description: "project meeting", day: 5, start: 12, end: 15 },
  { description: "yoga class", day: 4, start: 19, end: 22 },
  { description: "brunch", day: 0, start: 10, end: 14 },
  { description: "breakfast", day: 1, start: 6, end: 7 },
  { description: "breakfast", day: 2, start: 6, end: 7 },
  { description: "breakfast", day: 3, start: 6, end: 7 },
  { description: "breakfast", day: 4, start: 6, end: 7 },
  { description: "breakfast", day: 5, start: 6, end: 7 },
  { description: "studying", day: 1, start: 9, end: 12 },
  { description: "studying", day: 2, start: 9, end: 12 },
  { description: "studying", day: 3, start: 9, end: 12 },
  { description: "studying", day: 4, start: 9, end: 12 },
  { description: "studying", day: 5, start: 9, end: 12 },
  { description: "voluntering", day: 2, start: 17, end: 21 },
  { description: "voluntering", day: 4, start: 17, end: 21 },
  { description: "golf", day: 5, start: 16, end: 20 },
  { description: "dinner with friends", day: 3, start: 18, end: 21 },
]

let uniqueId = 1
const undoManager = new UndoManager()

// Signals
export const events = signal<Event[]>([])
export const availableEvents = signal([...eventBank])
export const mode = signal<'overview' | 'agenda'>('overview')
export const agendaIndex = signal(0)
export const editingEvent = signal<Event | null>(null)

// Computed signals
export const selectedEvents = computed(() => 
  events.value
    .filter(e => e.selected)
    .sort((a, b) => {
      // Sort by day first, then by start time
      if (a.day !== b.day) {
        return a.day - b.day
      }
      return a.start - b.start
    })
)

export const selectedCount = computed(() => selectedEvents.value.length)

export const canUndo = computed(() => undoManager.canUndo)
export const canRedo = computed(() => undoManager.canRedo)

export const allSelected = computed(() => 
  events.value.length > 0 && events.value.every(e => e.selected)
)

export const noneSelected = computed(() => 
  events.value.every(e => !e.selected)
)

export const canDelete = computed(() => selectedCount.value > 0)

export const canAdd = computed(() => 
  events.value.length < 10 && availableEvents.value.length > 0
)

export const canGoToAgenda = computed(() => 
  mode.value === 'overview' && selectedCount.value > 0
)

// Actions
export const createEvent = () => {
  if (availableEvents.value.length === 0 || events.value.length >= 10) return
  
  const index = Math.floor(Math.random() * availableEvents.value.length)
  const template = availableEvents.value[index]
  
  const newEvent: Event = {
    id: uniqueId++,
    description: template.description,
    selected: false,
    day: template.day,
    start: template.start,
    end: template.end,
  }
  
  const command: Command = {
    do: () => {
      events.value = [...events.value, newEvent]
      availableEvents.value = availableEvents.value.filter((_, i) => i !== index)
    },
    undo: () => {
      events.value = events.value.filter(e => e.id !== newEvent.id)
      availableEvents.value = [...availableEvents.value, template]
    }
  }
  
  undoManager.execute(command)
}

export const deleteSelectedEvents = () => {
  const toDelete = selectedEvents.value
  if (toDelete.length === 0) return
  
  const eventTemplates = toDelete.map(e => ({
    description: e.description,
    day: e.day,
    start: e.start,
    end: e.end
  }))
  
  const command: Command = {
    do: () => {
      events.value = events.value.filter(e => !e.selected)
      availableEvents.value = [...availableEvents.value, ...eventTemplates]
    },
    undo: () => {
      events.value = [...events.value, ...toDelete]
      availableEvents.value = availableEvents.value.filter(template => 
        !eventTemplates.some(t => 
          t.description === template.description &&
          t.day === template.day &&
          t.start === template.start &&
          t.end === template.end
        )
      )
    }
  }
  
  undoManager.execute(command)
}

export const selectAll = () => {
  events.value = events.value.map(e => ({ ...e, selected: true }))
  undoManager.clear()
}

export const selectNone = () => {
  events.value = events.value.map(e => ({ ...e, selected: false }))
  undoManager.clear()
}

export const toggleEventSelection = (id: number) => {
  const originalEvents = [...events.value]
  
  const command: Command = {
    do: () => {
      events.value = events.value.map(e => 
        e.id === id ? { ...e, selected: !e.selected } : e
      )
    },
    undo: () => {
      events.value = originalEvents
    }
  }
  
  undoManager.execute(command)
}

export const updateEvent = (id: number, updates: Partial<Event>) => {
  const originalEvents = [...events.value]
  
  // Validate the updates
  if (updates.start !== undefined && updates.end !== undefined) {
    if (updates.start >= updates.end) {
      console.warn('Start time must be before end time')
      return
    }
    if (updates.start < 0 || updates.start > 23 || updates.end < 1 || updates.end > 24) {
      console.warn('Invalid time range')
      return
    }
  }
  
  const command: Command = {
    do: () => {
      events.value = events.value.map(e => 
        e.id === id ? { ...e, ...updates } : e
      )
    },
    undo: () => {
      events.value = originalEvents
    }
  }
  
  undoManager.execute(command)
}

export const undo = () => {
  undoManager.undo()
}

export const redo = () => {
  undoManager.redo()
}

export const toggleMode = () => {
  mode.value = mode.value === 'overview' ? 'agenda' : 'overview'
  agendaIndex.value = 0
}

export const nextAgenda = () => {
  if (agendaIndex.value < selectedEvents.value.length - 1) {
    agendaIndex.value++
  }
}

export const prevAgenda = () => {
  if (agendaIndex.value > 0) {
    agendaIndex.value--
  }
}

// Initialize with 4 random events
for (let i = 0; i < 4; i++) {
  createEvent()
}

// Clear undo stack after initialization so undo/redo start disabled
undoManager.clear()
