const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const RankingList = require('../models/RankingList');
const RankingItem = require('../models/RankingItem');
const Task = require('../models/Task');

router.get('/:listId', auth, async (req, res) => {
  try {
    const list = await RankingList.findById(req.params.listId);
    
    if (!list) return res.status(404).json({ msg: 'Ranking list not found' });
    
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const items = await RankingItem.find({ list: req.params.listId }).sort({ value: -1 }); // Sort descending for unified approach
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/:listId',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('value', 'Value is required and must be a number').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, value, taskId } = req.body;

    try {
      const list = await RankingList.findById(req.params.listId);
      
      if (!list) return res.status(404).json({ msg: 'Ranking list not found' });
      
      if (list.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const existingItem = await RankingItem.findOne({ 
        list: req.params.listId, 
        value: parseFloat(value) 
      });
      
      if (existingItem) {
        return res.status(400).json({ msg: 'An item with this value already exists' });
      }

      const newItem = new RankingItem({
        text,
        value: parseFloat(value),
        list: req.params.listId,
        user: req.user.id,
        taskId: taskId || null
      });

      const item = await newItem.save();
      
      if (taskId) {
        try {
          const task = await Task.findById(taskId);
          
          if (task && task.user.toString() === req.user.id) {
            if (!task.itemIds.includes(item._id)) {
              task.itemIds.push(item._id);
              await task.save();
            }
          }
        } catch (err) {
          console.error('Error updating associated task:', err.message);
        }
      }
      
      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  const { text, value, taskId } = req.body;

  const itemFields = {};
  if (text !== undefined) itemFields.text = text;
  if (value !== undefined) itemFields.value = parseFloat(value);
  if (taskId !== undefined) itemFields.taskId = taskId || null;

  try {
    let item = await RankingItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (value !== undefined && value !== item.value) {
      const existingItem = await RankingItem.findOne({ 
        list: item.list, 
        value: parseFloat(value),
        _id: { $ne: req.params.id }
      });
      
      if (existingItem) {
        return res.status(400).json({ msg: 'An item with this value already exists' });
      }
    }

    const originalItem = await RankingItem.findById(req.params.id);
    const originalTaskId = originalItem.taskId;
    
    item = await RankingItem.findByIdAndUpdate(
      req.params.id,
      { $set: itemFields },
      { new: true }
    );

    if (taskId !== undefined && originalTaskId !== taskId) {
      if (originalTaskId) {
        try {
          const previousTask = await Task.findById(originalTaskId);
          if (previousTask && previousTask.user.toString() === req.user.id) {
            previousTask.itemIds = previousTask.itemIds.filter(id => id.toString() !== req.params.id);
            await previousTask.save();
          }
        } catch (err) {
          console.error('Error updating previous task:', err.message);
        }
      }
      
      if (taskId) {
        try {
          const newTask = await Task.findById(taskId);
          if (newTask && newTask.user.toString() === req.user.id) {
            if (!newTask.itemIds.includes(item._id)) {
              newTask.itemIds.push(item._id);
              await newTask.save();
            }
          }
        } catch (err) {
          console.error('Error updating new task:', err.message);
        }
      }
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await RankingItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (item.taskId) {
      try {
        const task = await Task.findById(item.taskId);
        if (task && task.user.toString() === req.user.id) {
          task.itemIds = task.itemIds.filter(id => id.toString() !== req.params.id);
          await task.save();
        }
      } catch (err) {
        console.error('Error updating associated task:', err.message);
      }
    }

    await RankingItem.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/:listId/reset', auth, async (req, res) => {
  try {
    const list = await RankingList.findById(req.params.listId);
    
    if (!list) return res.status(404).json({ msg: 'Ranking list not found' });
    
    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const items = await RankingItem.find({ list: req.params.listId });
    
    if (items.length === 0) {
      return res.status(400).json({ msg: 'No items to reset' });
    }

    items.sort((a, b) => b.value - a.value);
    
    const step = items.length > 1 ? 100 / (items.length - 1) : 50;
    
    const updates = items.map((item, index) => {
      const newValue = items.length > 1 ? 100 - (index * step) : 50;
      return RankingItem.findByIdAndUpdate(
        item._id,
        { $set: { value: newValue } },
        { new: true }
      );
    });
    
    try {
      await Promise.all(updates);
    } catch (updateErr) {
      console.error('Error updating items:', updateErr);
      return res.status(500).json({ msg: 'Error updating item values' });
    }
    
    const updatedItems = await RankingItem.find({ list: req.params.listId }).sort({ value: -1 }); // Sort descending
    res.json(updatedItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/:listId/addBetween',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('beforeValue', 'Before value is required').optional(),
      check('afterValue', 'After value is required').optional()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, beforeValue, afterValue, taskId } = req.body;

    try {
      const list = await RankingList.findById(req.params.listId);
      
      if (!list) return res.status(404).json({ msg: 'Ranking list not found' });
      
      if (list.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      let value;
      
      if (beforeValue !== undefined && afterValue !== undefined) {
        value = (parseFloat(beforeValue) + parseFloat(afterValue)) / 2;
      } else if (beforeValue !== undefined) {
        const nextItem = await RankingItem.findOne({
          list: req.params.listId,
          value: { $gt: parseFloat(beforeValue) }
        }).sort({ value: 1 });
        
        if (nextItem) {
          value = (parseFloat(beforeValue) + nextItem.value) / 2;
        } else {
          value = parseFloat(beforeValue) + 1;
        }
      } else if (afterValue !== undefined) {
        const prevItem = await RankingItem.findOne({
          list: req.params.listId,
          value: { $lt: parseFloat(afterValue) }
        }).sort({ value: -1 });
        
        if (prevItem) {
          value = (parseFloat(afterValue) + prevItem.value) / 2;
        } else {
          value = parseFloat(afterValue) - 1;
        }
      } else {
        const lastItem = await RankingItem.findOne({
          list: req.params.listId
        }).sort({ value: -1 });
        
        value = lastItem ? lastItem.value + 1 : 50;
      }

      const newItem = new RankingItem({
        text,
        value,
        list: req.params.listId,
        user: req.user.id,
        taskId: taskId || null
      });

      const item = await newItem.save();
      
      if (taskId) {
        try {
          const task = await Task.findById(taskId);
          
          if (task && task.user.toString() === req.user.id) {
            if (!task.itemIds.includes(item._id)) {
              task.itemIds.push(item._id);
              await task.save();
            }
          }
        } catch (err) {
          console.error('Error updating associated task:', err.message);
        }
      }
      
      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
