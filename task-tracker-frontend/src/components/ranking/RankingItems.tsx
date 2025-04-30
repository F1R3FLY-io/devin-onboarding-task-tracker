import React, { useState, useContext, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RankingContext, { RankingItem } from '../../context/ranking/RankingContext';
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
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
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
      }`}
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
          <p className="text-xs text-blue-600">Linked to task</p>
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

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    try {
      const draggedItem = localItems[dragIndex];
      const updatedItems = [...localItems];
      
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      
      setLocalItems(updatedItems);
      
      const finalItems = calculateNonConflictingValues(updatedItems);
      
      setLocalItems(finalItems);
      
      resetItemValues(listId);
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
    
    const sortedItems = [...items];
    
    const step = 100 / (sortedItems.length - 1);
    
    return sortedItems.map((item, index) => ({
      ...item,
      value: Math.round((100 - (index * step)) * 100) / 100 // Round to 2 decimal places
    }));
  };

  const handleValueChange = (id: string, newValue: number) => {
    try {
      if (newValue < 0 || newValue > 100) {
        alert('Value must be between 0 and 100.');
        return;
      }

      const item = items.find(item => item._id === id);
      if (!item) return;
      
      const conflictingItem = items.find(i => i._id !== id && i.value === newValue);
      
      if (conflictingItem) {
        const updatedItems = [...items];
        const itemIndex = updatedItems.findIndex(i => i._id === id);
        const conflictIndex = updatedItems.findIndex(i => i._id === conflictingItem._id);
        
        if (newValue > item.value) {
          updateItem({
            ...conflictingItem,
            value: Math.max(0, newValue - 1)
          });
        } else {
          updateItem({
            ...conflictingItem,
            value: Math.min(100, newValue + 1)
          });
        }
      }
      
      updateItem({
        ...item,
        value: newValue
      });
      
      setLocalItems([...items].sort((a, b) => b.value - a.value));
    } catch (error) {
      console.error('Error changing value:', error);
      alert('An error occurred while updating the value. Please try again.');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < localItems.length - 1) {
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
      const text = prompt('Enter text for the new item:');
      if (!text || text.trim() === '') return;
      
      let newValue: number;
      
      if (localItems.length === 0) {
        newValue = 50;
      } else if (index === 0) {
        newValue = Math.min(100, localItems[0].value + 5);
      } else if (index >= localItems.length) {
        newValue = Math.max(0, localItems[localItems.length - 1].value - 5);
      } else {
        const beforeValue = localItems[index - 1].value;
        const afterValue = localItems[index].value;
        newValue = (beforeValue + afterValue) / 2;
      }
      
      const newItem = {
        text,
        value: newValue,
        taskId: null
      };
      
      addItem(newItem, listId);
      
      setTimeout(() => {
        resetItemValues(listId);
      }, 500);
    } catch (error) {
      console.error('Error adding item between:', error);
      alert('An error occurred while adding the item. Please try again.');
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
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
            disabled={localItems.length < 2}
          >
            Reset Values
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
