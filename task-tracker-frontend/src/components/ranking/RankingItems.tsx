import React, { useState, useContext, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import RankingContext, { RankingItem } from '../../context/ranking/RankingContext';
import TaskContext from '../../context/task/TaskContext';
import RankingItemForm from './RankingItemForm';

type RankingItemsProps = {
  items: RankingItem[];
  listId: string;
  mode: 'unified';
};

type DraggableItemProps = {
  item: RankingItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: RankingItem) => void;
  onDelete: (id: string) => void;
  onValueChange: (id: string, newValue: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  items: RankingItem[];
};

const ItemType = 'RANKING_ITEM';

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  index, 
  moveItem, 
  onEdit, 
  onDelete,
  onValueChange,
  onMoveUp,
  onMoveDown,
  items
}) => {
  const rankingContext = useContext(RankingContext);
  const taskContext = useContext(TaskContext);
  const navigate = useNavigate();
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      try {
        if (!monitor.didDrop()) {
          rankingContext.clearErrors();
        }
      } catch (error) {
        console.error('Error in drag end:', error);
      }
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      try {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      } catch (error) {
        console.error('Error during drag hover:', error);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const [isEditing, setIsEditing] = useState(false);
  const [valueInput, setValueInput] = useState(item.value.toString());

  useEffect(() => {
    setValueInput(item.value.toString());
  }, [item.value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  const handleValueBlur = () => {
    const newValue = parseFloat(valueInput);
    if (!isNaN(newValue) && newValue !== item.value) {
      onValueChange(item._id, newValue);
    } else {
      setValueInput(item.value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={`flex items-center p-3 mb-2 bg-white rounded shadow-sm ${
        isDragging ? 'opacity-50' : ''
      } ${isOver ? 'border-2 border-blue-400' : ''}`}
      style={{ 
        cursor: 'grab',
        transition: 'all 0.2s ease',
        boxShadow: isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : '',
      }}
    >
      <div className="flex-shrink-0 w-16 mr-3">
        <input
          type="number"
          value={valueInput}
          onChange={handleValueChange}
          onBlur={handleValueBlur}
          onKeyDown={handleKeyDown}
          step="0.01"
          min="0"
          max="100"
          className="w-full p-1 text-center border rounded"
        />
      </div>
      <div className="flex-grow">
        <p className="font-medium">{item.text}</p>
        {item.taskId && (
          <div className="mt-1">
            <button 
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors flex items-center"
              onClick={() => {
                const task = taskContext?.tasks.find(t => t._id === item.taskId);
                if (task) {
                  taskContext?.setCurrent(task);
                  navigate('/');
                }
              }}
              title="View associated task"
            >
              {taskContext?.tasks.find(t => t._id === item.taskId)?.title || 'Linked to task'}
              <span className="ml-1 text-blue-600">→</span>
            </button>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className={`p-1 mr-1 rounded ${
            index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
          }`}
          title="Move Up"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={index === items.length - 1}
          className={`p-1 mr-1 rounded ${
            index === items.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
          }`}
          title="Move Down"
        >
          ↓
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-1 mr-1 text-blue-500 hover:bg-blue-100 rounded"
          title="Edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="p-1 text-red-500 hover:bg-red-100 rounded"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const RankingItems: React.FC<RankingItemsProps> = ({ items, listId, mode }) => {
  const rankingContext = useContext(RankingContext);
  const taskContext = useContext(TaskContext);
  const { 
    updateItem, 
    deleteItem, 
    setCurrentItem, 
    resetItemValues,
    addItemBetween,
    addItem
  } = rankingContext;

  const [showItemForm, setShowItemForm] = useState(false);
  const [localItems, setLocalItems] = useState<RankingItem[]>([]);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const sortedItems = [...items].sort((a, b) => 
      sortDirection === 'desc' ? b.value - a.value : a.value - b.value
    );
    setLocalItems(sortedItems);
  }, [items, sortDirection]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    try {
      rankingContext.clearErrors();
      
      const draggedItem = localItems[dragIndex];
      const updatedItems = [...localItems];
      
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      
      const finalItems = calculateNonConflictingValues(updatedItems);
      setLocalItems(finalItems);
      
      Promise.all(
        finalItems.map(updatedItem => {
          const originalItem = items.find(i => i._id === updatedItem._id);
          if (originalItem && Math.abs(originalItem.value - updatedItem.value) > 0.001) {
            return updateItem(updatedItem).catch(err => {
              console.error('Error updating item:', err);
              return null;
            });
          }
          return Promise.resolve(null);
        })
      );
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  const calculateNonConflictingValues = (items: RankingItem[]): RankingItem[] => {
    if (items.length <= 1) {
      return items.map(item => ({
        ...item,
        value: 50 // Default value for single items
      }));
    }
    
    const itemsCopy = [...items];
    
    const step = items.length > 1 ? 100 / (items.length - 1) : 50;
    
    return itemsCopy.map((item, index) => ({
      ...item,
      value: Math.min(100, Math.max(0, Math.round((100 - (index * step)) * 100) / 100))
    }));
  };

  const handleValueChange = (id: string, newValue: number) => {
    try {
      rankingContext.clearErrors(); // Clear any existing errors
      
      if (newValue < 0 || newValue > 100) {
        alert('Value must be between 0 and 100.');
        return;
      }

      const item = items.find(item => item._id === id);
      if (!item) return;
      
      let updatedItems = [...items];
      const itemIndex = updatedItems.findIndex(i => i._id === id);
      
      updatedItems[itemIndex] = { ...item, value: newValue };
      
      updatedItems.sort((a, b) => sortDirection === 'desc' ? b.value - a.value : a.value - b.value);
      
      const valueMap = new Map<number, string[]>();
      
      updatedItems.forEach(item => {
        const value = Math.round(item.value * 100) / 100; // Round to 2 decimal places
        if (!valueMap.has(value)) {
          valueMap.set(value, []);
        }
        valueMap.get(value)!.push(item._id);
      });
      
      let hasConflicts = false;
      for (const [value, itemIds] of valueMap.entries()) {
        if (itemIds.length > 1) {
          hasConflicts = true;
          break;
        }
      }
      
      if (hasConflicts) {
        if (updatedItems.length <= 10) {
          let maxIterations = 5; // Prevent infinite loops
          while (hasConflicts && maxIterations > 0) {
            hasConflicts = false;
            maxIterations--;
            
            const valueMap = new Map<number, string[]>();
            
            updatedItems.forEach(item => {
              const value = Math.round(item.value * 100) / 100;
              if (!valueMap.has(value)) {
                valueMap.set(value, []);
              }
              valueMap.get(value)!.push(item._id);
            });
            
            for (const [value, itemIds] of valueMap.entries()) {
              if (itemIds.length > 1) {
                hasConflicts = true;
                
                const conflictingIndices = itemIds.map(itemId => 
                  updatedItems.findIndex(i => i._id === itemId)
                ).sort((a, b) => a - b);
                
                for (let i = 1; i < conflictingIndices.length; i++) {
                  const idx = conflictingIndices[i];
                  const prevIdx = conflictingIndices[i - 1];
                  
                  if (updatedItems[idx]._id === id) {
                    updatedItems[prevIdx] = {
                      ...updatedItems[prevIdx],
                      value: Math.min(100, value + 1)
                    };
                  } else if (updatedItems[prevIdx]._id === id) {
                    updatedItems[idx] = {
                      ...updatedItems[idx],
                      value: Math.max(0, value - 1)
                    };
                  } else {
                    updatedItems[prevIdx] = {
                      ...updatedItems[prevIdx],
                      value: Math.min(100, value + 0.5)
                    };
                    updatedItems[idx] = {
                      ...updatedItems[idx],
                      value: Math.max(0, value - 0.5)
                    };
                  }
                }
              }
            }
            
            updatedItems.sort((a, b) => sortDirection === 'desc' ? b.value - a.value : a.value - b.value);
          }
        } 
        
        if (hasConflicts || updatedItems.length > 10) {
          const changedItemIndex = updatedItems.findIndex(i => i._id === id);
          
          updatedItems = calculateNonConflictingValues(updatedItems);
        }
      }
      
      setLocalItems(updatedItems);
      
      Promise.all(
        updatedItems.map(updatedItem => {
          const originalItem = items.find(i => i._id === updatedItem._id);
          if (originalItem && Math.abs(originalItem.value - updatedItem.value) > 0.001) {
            return updateItem(updatedItem).catch(err => {
              console.error('Error updating item:', err);
              return null;
            });
          }
          return Promise.resolve(null);
        })
      );
      
    } catch (error) {
      console.error('Error changing value:', error);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      rankingContext.clearErrors(); // Clear any existing errors
      moveItem(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < localItems.length - 1) {
      rankingContext.clearErrors(); // Clear any existing errors
      moveItem(index, index + 1);
    }
  };

  const handleEdit = (item: RankingItem) => {
    setCurrentItem(item);
    setShowItemForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const handleResetValues = () => {
    if (window.confirm('Are you sure you want to reset all values?')) {
      resetItemValues(listId);
    }
  };

  const handleAddBetween = (index: number) => {
    try {
      rankingContext.clearErrors(); // Clear any existing errors
      
      const text = prompt('Enter text for the new item:');
      if (!text || text.trim() === '') return;
      
      if (localItems.length === 0) {
        const newItem = {
          text,
          value: 50,
          taskId: null
        };
        
        addItem(newItem, listId);
      } else if (index === 0) {
        const afterValue = localItems[0].value;
        const beforeValue = Math.min(100, afterValue + 10); // Ensure we don't exceed 100
        
        addItemBetween(text, listId, beforeValue, afterValue);
      } else if (index >= localItems.length) {
        const beforeValue = localItems[localItems.length - 1].value;
        const afterValue = Math.max(0, beforeValue - 10); // Ensure we don't go below 0
        
        addItemBetween(text, listId, beforeValue, afterValue);
      } else {
        const beforeValue = localItems[index - 1].value;
        const afterValue = localItems[index].value;
        
        if (Math.abs(beforeValue - afterValue) < 0.01) {
          resetItemValues(listId);
          setTimeout(() => {
            const updatedBeforeValue = items[index - 1]?.value || 75;
            const updatedAfterValue = items[index]?.value || 25;
            addItemBetween(text, listId, updatedBeforeValue, updatedAfterValue);
          }, 500);
          return;
        }
        
        addItemBetween(text, listId, beforeValue, afterValue);
      }
      
      setTimeout(() => {
        resetItemValues(listId);
      }, 500);
    } catch (error) {
      console.error('Error adding item between:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => setShowItemForm(!showItemForm)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
          >
            {showItemForm ? 'Cancel' : 'Add Item'}
          </button>
          <button
            onClick={handleResetValues}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded mr-2"
            disabled={localItems.length < 2}
          >
            Reset Values
          </button>
          <button
            onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded"
            title={`Sort ${sortDirection === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            Sort: {sortDirection === 'desc' ? 'Highest First ↓' : 'Lowest First ↑'}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          {localItems.length} items • Drag to reorder
        </p>
      </div>
      
      {showItemForm && (
        <RankingItemForm 
          listId={listId} 
          onClose={() => setShowItemForm(false)} 
        />
      )}
      
      <DndProvider backend={HTML5Backend}>
        <div className="mt-4">
          {localItems.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>No items in this list. Add an item to get started.</p>
            </div>
          ) : (
            <>
              {/* Add button at the top */}
              <button
                onClick={() => handleAddBetween(0)}
                className="w-full py-1 mb-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-300"
              >
                + Add item here
              </button>
              
              {localItems.map((item, index) => (
                <React.Fragment key={item._id}>
                  <DraggableItem
                    item={item}
                    index={index}
                    moveItem={moveItem}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onValueChange={handleValueChange}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    items={localItems}
                  />
                  {/* Add button between items */}
                  <button
                    onClick={() => handleAddBetween(index + 1)}
                    className="w-full py-1 mb-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-300"
                  >
                    + Add item here
                  </button>
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default RankingItems;
