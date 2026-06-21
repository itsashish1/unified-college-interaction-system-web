import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Models
import User from './models/User.model.js';
import Club from './models/Club.model.js';
import Event from './models/Event.model.js';
import Announcement from './models/Announcement.model.js';
import Post from './models/Post.model.js';
import SupportTicket from './models/SupportTicket.model.js';
import Faculty from './models/Faculty.model.js';


dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Clearing all collections...');
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});
    await Post.deleteMany({});
    await SupportTicket.deleteMany({});
    await Faculty.deleteMany({});

    console.log('Collections cleared.');

    // Password hashing (handled by User model pre-save hook)
    const commonPassword = 'password123';

    console.log('Creating Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: commonPassword,
      role: 'admin',
      department: 'IT',
    });

    const student1 = await User.create({
      name: 'Harshit Jaiswal',
      email: 'harshit@college.edu',
      password: commonPassword,
      role: 'club_admin',
      department: 'CSE',
      year: '3rd Year',
      enrollmentNo: 'CSE/21/045'
    });

    const student2 = await User.create({
      name: 'Aisha Sharma',
      email: 'aisha@college.edu',
      password: commonPassword,
      role: 'student',
      department: 'ECE',
      year: '2nd Year',
      enrollmentNo: 'ECE/22/012'
    });

    const student3 = await User.create({
      name: 'Rohan Gupta',
      email: 'rohan@college.edu',
      password: commonPassword,
      role: 'student',
      department: 'MECH',
      year: '4th Year',
      enrollmentNo: 'MECH/20/089'
    });

    const teacher1 = await User.create({
      name: 'Dr. Anita Desai',
      email: 'anita@college.edu',
      password: commonPassword,
      role: 'faculty',
      department: 'CSE',
    });

    console.log('Creating Faculty Directory...');
    await Faculty.insertMany([
      { name: 'Prof. (Dr.) Pankaj Agarwal', email: 'pankaj.agarwal@krmu.edu.in', department: 'School of Engineering & Technology', designation: 'Dean & Professor', subjects: ['System Design', 'Software Engineering'], cabin: 'Block A - 301', officeHours: 'Mon-Wed 10:00 AM - 1:00 PM' },
      { name: 'Dr. Shweta Bansal', email: 'shweta.bansal@krmu.edu.in', department: 'School of Engineering & Technology', designation: 'HOD & Associate Professor', subjects: ['Database Management Systems', 'Computer Networks'], cabin: 'Block A - 302', officeHours: 'Tue-Thu 2:00 PM - 4:00 PM' },
      { name: 'Dr. Amar Saraswat', email: 'amar.saraswat@krmu.edu.in', department: 'School of Engineering & Technology', designation: 'Assistant Professor', subjects: ['Data Structures', 'Web Development'], cabin: 'Block A - 303', officeHours: 'Wed-Fri 1:00 PM - 3:00 PM' },
      { name: 'Dr. Monika Khatkar', email: 'monika.khatkar@krmu.edu.in', department: 'School of Engineering & Technology', designation: 'Assistant Professor', subjects: ['Artificial Intelligence', 'Machine Learning'], cabin: 'Block A - 304', officeHours: 'Mon-Fri 9:00 AM - 11:00 AM' },
      { name: 'Dr. Manish Kumar', email: 'manish.kumar@krmu.edu.in', department: 'School of Engineering & Technology', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Cyber Security'], cabin: 'Block A - 305', officeHours: 'Tue & Thu 10:00 AM - 12:00 PM' },
      { name: 'Prof. (Dr.) Amit Chawla', email: 'amit.chawla@krmu.edu.in', department: 'School of Emerging Media & Creator Economy', designation: 'Dean & Professor', subjects: ['Digital Media', 'Creator Economy', 'Media Production'], cabin: 'Block C - 101', officeHours: 'Mon-Wed 11:00 AM - 2:00 PM' },
      { name: 'Dr. Tania Gupta', email: 'tania.gupta@krmu.edu.in', department: 'School of Education', designation: 'Dean & Professor', subjects: ['Educational Psychology', 'Pedagogical Techniques'], cabin: 'Block B - 201', officeHours: 'Tue-Thu 10:00 AM - 12:00 PM' },
      { name: 'Dr. Indira Bhardwaj', email: 'indira.bhardwaj@krmu.edu.in', department: 'School of Management & Commerce', designation: 'Dean & Professor', subjects: ['Corporate Finance', 'Strategic Management'], cabin: 'Block D - 401', officeHours: 'Mon-Wed 1:00 PM - 3:00 PM' },
      { name: 'Dr. Anshika Prakash', email: 'anshika.prakash@krmu.edu.in', department: 'School of Management & Commerce', designation: 'Professor', subjects: ['Human Resource Management', 'Organizational Behavior'], cabin: 'Block D - 402', officeHours: 'Wed-Fri 11:00 AM - 1:00 PM' }
    ]);

    console.log('Creating Clubs...');
    const clubs = await Club.insertMany([
      { name: 'MUN Club', description: 'Model United Nations Club.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1541872511475-4ceb02f8dcab?q=80&w=800&auto=format&fit=crop' },
      { name: 'Chetna Society', description: 'Art, Film & Literature Society.', category: 'cultural', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800&auto=format&fit=crop' },
      { name: 'Economic Society', description: 'Economics and thought discussions.', category: 'social', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop' },
      { name: 'Dr. APJ Abdul Kalam Science Club', description: 'Explore, Experiment, Express.', category: 'technical', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop' },
      { name: 'Sports Club', description: 'Organizes inter-college sports tournaments.', category: 'social', coordinator: student2._id, createdBy: adminUser._id, members: [student1._id, student2._id], coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop' },
      { name: 'Tech Nexus Club', description: 'Coding and technology club.', category: 'technical', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop' },
      { name: 'Management Society', description: 'Management and business activities.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop' },
      { name: 'Mediaverse Club', description: 'Voices of our campus.', category: 'social', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop' },
      { name: 'Environment Club', description: 'Eco-sustainable future initiatives.', category: 'social', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop' },
      { name: 'DIA Club', description: 'Art and craft activities.', category: 'cultural', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a47?q=80&w=800&auto=format&fit=crop' },
      { name: 'Cultural Club', description: 'Theatre, dance, and music showcasing.', category: 'cultural', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1507676184212-d0330a156f95?q=80&w=800&auto=format&fit=crop' },
      { name: 'Roopantr Club', description: 'Fashion and arts society.', category: 'cultural', coordinator: student3._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop' },
      { name: 'Rhetoric Club', description: 'Language and speaking club.', category: 'social', coordinator: student1._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1543326727-cf68a5482acc?q=80&w=800&auto=format&fit=crop' },
      { name: 'Health Society', description: 'Health and wellness awareness.', category: 'social', coordinator: student2._id, createdBy: adminUser._id, members: [], coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop' },
    ]);

    console.log('Creating Events...');
    const events = [];
    const eventCategories = ['workshop', 'seminar', 'competition', 'cultural', 'sports'];
    for (let i = 0; i < 14; i++) {
      const startDate = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000); // Start from tomorrow
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
      events.push({
        title: `Campus Event ${i + 1}`,
        description: `Join us for an exciting day of learning and networking at Campus Event ${i + 1}.`,
        category: eventCategories[i % eventCategories.length],
        club: clubs[i % clubs.length]._id,
        organizer: adminUser._id,
        venue: i % 2 === 0 ? 'Main Auditorium' : 'Seminar Hall B',
        startDate,
        endDate,
        status: 'upcoming',
        isPublished: true,
        registeredParticipants: [],
        image: `https://picsum.photos/seed/${i + 50}/600/400`,
      });
    }
    await Event.insertMany(events);

    console.log('Creating Announcements...');
    const announcements = [];
    const annCategories = ['academic', 'exam', 'holiday', 'placement', 'general'];
    for (let i = 0; i < 6; i++) {
      announcements.push({
        title: `Official Notice: ${i % 2 === 0 ? 'Examination Schedule' : 'Placement Drive 2024'}`,
        content: `Detailed information regarding the upcoming ${i % 2 === 0 ? 'mid-semester examinations' : 'placement opportunities'} for students.`,
        category: annCategories[i % annCategories.length],
        author: adminUser._id,
        priority: i === 0 ? 'high' : 'medium',
        isPublished: true,
        targetAudience: 'all',
      });
    }
    await Announcement.insertMany(announcements);

    console.log('Creating Forum Posts...');
    const post1 = await Post.create({
      title: 'How to prepare for CSE Internships?',
      content: 'I am a 2nd year student and looking for some guidance on how to start preparation for internships.',
      category: 'academic',
      author: student3._id,
      tags: ['cse', 'internship', 'advice'],
      upvotes: [student1._id, student2._id],
    });

    await Post.create({
      title: 'Best resources for learning MERN stack',
      content: 'I want to build a real-time application using MERN. Any good courses?',
      category: 'general',
      author: student2._id,
      tags: ['webdev', 'mern', 'learning'],
    });

    console.log('Creating Support Tickets...');
    await SupportTicket.create({
      subject: 'WiFi access issue in Block 3',
      description: 'The WiFi signal is very weak on the 2nd floor of Block 3.',
      category: 'technical',
      status: 'open',
      priority: 'medium',
      raisedBy: student1._id,
    });



    console.log('✅ Entire Demo DB Seed completed successfully! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedDB();
