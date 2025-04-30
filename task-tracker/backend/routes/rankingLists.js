const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const RankingList = require('../models/RankingList');
const RankingItem = require('../models/RankingItem');

router.get('/', auth, async (req, res) => {
  try {
    const lists = await RankingList.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('mode', 'Mode must be unified').isIn(['unified'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, mode } = req.body;

    try {
      const newList = new RankingList({
        name,
        mode: mode || 'unified',
        user: req.user.id
      });

      const list = await newList.save();
      res.json(list);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  const { name, mode } = req.body;

  const listFields = {};
  if (name) listFields.name = name;
  if (mode) listFields.mode = mode;

  try {
    let list = await RankingList.findById(req.params.id);

    if (!list) return res.status(404).json({ msg: 'Ranking list not found' });

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    list = await RankingList.findByIdAndUpdate(
      req.params.id,
      { $set: listFields },
      { new: true }
    );

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let list = await RankingList.findById(req.params.id);

    if (!list) return res.status(404).json({ msg: 'Ranking list not found' });

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await RankingItem.deleteMany({ list: req.params.id });
    
    await RankingList.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Ranking list removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
