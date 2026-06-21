import Club from '../models/Club.model.js';
import { paginate } from '../utils/paginate.js';

// GET /api/clubs
export const getClubs = async (req, res) => {
  try {
    const { category, page, limit } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const query = Club.find(filter).populate('coordinator', 'name email').sort({ createdAt: -1 });
    const result = await paginate(query, { page, limit });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/clubs/:id
export const getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('coordinator', 'name email avatar')
      .populate('members', 'name email avatar');
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/clubs
export const createClub = async (req, res) => {
  try {
    const { name, description, category, coverImage, coordinator } = req.body;
    const club = await Club.create({ name, description, category, coverImage, coordinator, createdBy: req.user._id });
    res.status(201).json(club);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/clubs/:id
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/clubs/:id
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ message: 'Club deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/clubs/:id/join
export const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (club.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
    club.members.push(req.user._id);
    await club.save();
    res.json({ message: 'Joined club successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/clubs/:id/leave
export const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    club.members = club.members.filter((m) => m.toString() !== req.user._id.toString());
    await club.save();
    res.json({ message: 'Left club successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
