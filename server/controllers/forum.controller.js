import Post from '../models/Post.model.js';
import { paginate } from '../utils/paginate.js';

// GET /api/forum
export const getPosts = async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    const query = Post.find(filter)
      .populate('author', 'name avatar role')
      .sort({ isPinned: -1, createdAt: -1 });
    const result = await paginate(query, { page, limit });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/forum/:id
export const getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name avatar role department')
     .populate('replies.author', 'name avatar role');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/forum
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await Post.create({ title, content, category, tags, author: req.user._id });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/forum/:id/reply
export const addReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.isClosed) return res.status(400).json({ message: 'Post is closed' });
    post.replies.push({ content: req.body.content, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/forum/:id/upvote
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.upvotes.indexOf(req.user._id);
    if (idx > -1) post.upvotes.splice(idx, 1);
    else post.upvotes.push(req.user._id);
    await post.save();
    res.json({ upvotes: post.upvotes.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/forum/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
