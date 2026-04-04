import Placement from '../models/Placement.model.js';

// Get all placements
export const getPlacements = async (req, res) => {
  try {
    const filters = {};
    if (req.query.type && req.query.type !== 'all') {
      filters.type = req.query.type;
    }
    const placements = await Placement.find(filters).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(placements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single placement
export const getPlacementById = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id).populate('postedBy', 'name email');
    if (!placement) return res.status(404).json({ message: 'Placement opportunity not found' });
    res.status(200).json(placement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a placement
export const createPlacement = async (req, res) => {
  try {
    const newPlacement = new Placement({
      ...req.body,
      postedBy: req.user._id,
    });
    const savedPlacement = await newPlacement.save();
    
    // Simulate email notification
    console.log(`[EMAIL NOTIFICATION] New Placement Posted!
    Company: ${savedPlacement.company}
    Role: ${savedPlacement.role}
    Type: ${savedPlacement.type}
    Users are notified.`);
    
    res.status(201).json(savedPlacement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a placement
export const updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Placement opportunity not found' });

    // Check if the user is authorized to update
    if (placement.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       return res.status(403).json({ message: 'Not authorized to update this placement' });
    }

    const updatedPlacement = await Placement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPlacement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a placement
export const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Placement opportunity not found' });

    // Check if the user is authorized to delete
    if (placement.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       return res.status(403).json({ message: 'Not authorized to delete this placement' });
    }

    await Placement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Placement opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apply to a placement
export const applyToPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: 'Placement opportunity not found' });

    // Check if user already applied
    if (placement.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already applied to this placement' });
    }

    placement.applicants.push(req.user._id);
    await placement.save();

    res.status(200).json({ message: 'Successfully applied', placement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
