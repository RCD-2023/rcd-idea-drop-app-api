import express from 'express';
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
//

//
const ideaRouter = express.Router();
/**
 * @route         Get /api/ideas
 * @description   Get all ideas
 * @access        public(all users)
 * @query _limit(optional limit for ideas returned)
 */
ideaRouter.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 });
    if (!isNaN(limit)) {
      query.limit(limit);
    }
    const ideas = await query.exec();
    res.json(ideas);
  } catch (error) {
    next(error);
  }
});

/**
 * @route         Get /api/ideas/:id
 * @description   Get single idea
 * @access       public(all users)
 */
ideaRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error('Idea Not Found');
    }
    res.json(idea);
  } catch (error) {
    next(error);
  }
});

/**
 * @route        Post /api/ideas
 * @description  Create a new idea
 * @access       public (deocamdata)
 */
ideaRouter.post('/', protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }
    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
      user: req.user.id,
    });
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    next(error);
  }
});
/**
 * @route         DELETE /api/ideas/:id
 * @description   DELETE an idea
 * @access       public(all users)
 */
ideaRouter.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }

    // Check if the logged-in user owns the idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this idea');
    }

    await idea.deleteOne();

    res.json({ message: 'Idea was deleted!' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route         PUT/api/ideas/:id
 * @description   Update an idea
 * @access       public(all users)
 */
ideaRouter.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea not found');
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    // Check if the logged-in user owns the idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this idea');
    }

    //
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    /**
     * // varianta cu nested ternary era in curs
     * idea.tags = Array.isArray(tags)
  ? tags
  : typeof tags === 'string'
  ? tags.split(',').map((t) => t.trim()).filter(Boolean)
  : [];
     * 
     * 
     * 
     */
    if (Array.isArray(tags)) {
      idea.tags = tags;
    } else if (typeof tags === 'string') {
      idea.tags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      idea.tags = [];
    }

    const updatedIdea = await idea.save();

    //
    res.json(updatedIdea);
    //
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default ideaRouter;
