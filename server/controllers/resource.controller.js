import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Resource from '../models/Resource.model.js';
import { paginate } from '../utils/paginate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/resources
export const uploadResource = async (req, res) => {
  try {
    const { title, description, subject, department } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Resource file is required' });
    }

    const fileUrl = `uploads/resources/${req.file.filename}`;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
    const fileSize = req.file.size;

    const resource = await Resource.create({
      title,
      description,
      subject,
      department,
      fileUrl,
      fileType,
      fileSize,
      uploadedBy: req.user._id,
    });

    // Populate uploader details
    const populated = await Resource.findById(resource._id).populate('uploadedBy', 'name role');

    res.status(201).json(populated);
  } catch (err) {
    // Clean up uploaded file if DB insertion failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to clean up file after failed DB save:', unlinkErr);
      }
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resources
export const getResources = async (req, res) => {
  try {
    const { department, search, page, limit } = req.query;
    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const query = Resource.find(filter)
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    const result = await paginate(query, { page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resources/:id/download
export const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Resolve physical path
    const physicalPath = path.join(__dirname, '..', resource.fileUrl);

    if (!fs.existsSync(physicalPath)) {
      return res.status(404).json({ message: 'Physical file not found on server' });
    }

    // Increment downloads count
    resource.downloadsCount += 1;
    await resource.save();

    // Serve download
    const filename = `${resource.title}.${resource.fileType}`;
    res.download(physicalPath, filename);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Authorize: Only uploader or admin can delete
    const isUploader = resource.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this resource' });
    }

    // Physical file deletion
    const physicalPath = path.join(__dirname, '..', resource.fileUrl);
    if (fs.existsSync(physicalPath)) {
      try {
        fs.unlinkSync(physicalPath);
      } catch (unlinkErr) {
        console.error('Error deleting physical file:', unlinkErr);
      }
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
