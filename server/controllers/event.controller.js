import Event from '../models/Event.model.js';
import { paginate } from '../utils/paginate.js';

// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const { status, category, club, page, limit } = req.query;
    const filter = { isPublished: true };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (club) filter.club = club;
    const query = Event.find(filter)
      .populate('organizer', 'name email')
      .populate('club', 'name logo')
      .sort({ startDate: 1 });
    const result = await paginate(query, { page, limit });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/events/:id
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar')
      .populate('club', 'name logo')
      .populate('registeredParticipants', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, category, club, venue, startDate, endDate, maxParticipants, registrationDeadline, image } = req.body;
    const event = await Event.create({
      title, description, category, club, venue, startDate, endDate,
      maxParticipants, registrationDeadline, image,
      organizer: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/events/:id/register
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registrationDeadline && new Date() > event.registrationDeadline)
      return res.status(400).json({ message: 'Registration deadline passed' });
    if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants)
      return res.status(400).json({ message: 'Event is full' });
    if (event.registeredParticipants.includes(req.user._id))
      return res.status(400).json({ message: 'Already registered' });
    event.registeredParticipants.push(req.user._id);
    await event.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/events/:id/unregister
export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.registeredParticipants = event.registeredParticipants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );
    await event.save();
    res.json({ message: 'Unregistered successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
