import { 
  createEvent, 
  deleteSelectedEvents, 
  selectAll, 
  selectNone,
  allSelected,
  noneSelected,
  canDelete,
  canAdd
} from '../model'

export function Toolbar() {
  return (
    <div className="p-2.5 flex gap-x-2.5 mb-0 border-b border-black">
      <button 
        className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={allSelected.value}
        onClick={selectAll}
      >
        All
      </button>
      
      <button 
        className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={noneSelected.value}
        onClick={selectNone}
      >
        None
      </button>
      
      <button 
        className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canDelete.value}
        onClick={deleteSelectedEvents}
      >
        Delete
      </button>
      
      <button 
        className="w-[80px] px-2 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAdd.value}
        onClick={createEvent}
      >
        Add
      </button>
    </div>
  )
}
