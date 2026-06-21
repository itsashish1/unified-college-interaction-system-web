import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from './models/Club.model.js';
import Event from './models/Event.model.js';

dotenv.config();

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('\n--- Seeding Dummy Data ---');
    const dummyClub = await Club.create({
      name: 'Computer Science Hub Test ' + Date.now(),
      description: 'A test club for computer science students',
      category: 'technical',
      isActive: true,
      members: [] // Needed or optional depending on schema
    });

    const dummyEvent = await Event.create({
      title: 'Computer Coding Contest Test',
      description: 'Annual competitive programming test event',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      venue: 'Main Lab',
      status: 'upcoming',
      isPublished: true,
      organizer: new mongoose.Types.ObjectId()
    });

    console.log('Dummy data created successfully.');

    console.log('\n--- Testing Search System ("computer") ---');
    
    const query = 'computer';
    const regex = { $regex: query, $options: 'i' };

    const clubs = await Club.find({ name: regex, isActive: true }).select('name description category');
    const events = await Event.find({ title: regex, isPublished: true }).select('title description startDate venue');

    console.log('\nSearch Results for "computer":');
    console.log('Clubs found:', clubs.map(c => c.name));
    console.log('Events found:', events.map(e => e.title));

    console.log('\n--- Data persisted for browser testing ---');
    // Removed cleanup so data remains.
    console.log('Cleanup handled manually or via reset later.');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

runTest();
