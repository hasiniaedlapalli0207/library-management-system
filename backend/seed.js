const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    const Transaction = require('./models/Transaction');
    await Transaction.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created: admin@library.com / admin123');

    // Create student user
    const student = await User.create({
      name: 'John Student',
      email: 'john@student.com',
      password: 'student123',
      role: 'student',
    });
    console.log('✅ Student created: john@student.com / student123');

    // Create sample books
    const books = [
      { title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', isbn: '978-0132350884', quantity: 5, availableCopies: 3, rackNumber: 'A1-Shelf1', coverColor: '#3b82f6' },
      { title: 'The Pragmatic Programmer', author: 'David Thomas', category: 'Software Engineering', isbn: '978-0135957059', quantity: 3, availableCopies: 3, rackNumber: 'A1-Shelf2', coverColor: '#10b981' },
      { title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering', isbn: '978-0201633610', quantity: 4, availableCopies: 4, rackNumber: 'A2-Shelf1', coverColor: '#8b5cf6' },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0262033848', quantity: 6, availableCopies: 5, rackNumber: 'B1-Shelf1', coverColor: '#f59e0b' },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'Artificial Intelligence', isbn: '978-0136042594', quantity: 3, availableCopies: 2, rackNumber: 'B2-Shelf1', coverColor: '#ef4444' },
      { title: 'Computer Networking', author: 'James Kurose', category: 'Networking', isbn: '978-0133594140', quantity: 4, availableCopies: 4, rackNumber: 'C1-Shelf1', coverColor: '#06b6d4' },
      { title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Operating Systems', isbn: '978-1118063330', quantity: 5, availableCopies: 3, rackNumber: 'C1-Shelf2', coverColor: '#ec4899' },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Databases', isbn: '978-0078022159', quantity: 4, availableCopies: 4, rackNumber: 'C2-Shelf1', coverColor: '#f97316' },
      { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Web Development', isbn: '978-0596517748', quantity: 3, availableCopies: 2, rackNumber: 'D1-Shelf1', coverColor: '#3b82f6' },
      { title: 'Learning React', author: 'Alex Banks', category: 'Web Development', isbn: '978-1492051725', quantity: 4, availableCopies: 4, rackNumber: 'D1-Shelf2', coverColor: '#10b981' },
      { title: 'Python Crash Course', author: 'Eric Matthes', category: 'Programming', isbn: '978-1593279288', quantity: 6, availableCopies: 5, rackNumber: 'D2-Shelf1', coverColor: '#8b5cf6' },
      { title: 'The Art of Computer Programming', author: 'Donald Knuth', category: 'Computer Science', isbn: '978-0201896831', quantity: 2, availableCopies: 2, rackNumber: 'A3-Shelf1', coverColor: '#f59e0b' },
      { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', category: 'Computer Science', isbn: '978-0262510875', quantity: 3, availableCopies: 1, rackNumber: 'A3-Shelf2', coverColor: '#ef4444' },
      { title: 'Cracking the Coding Interview', author: 'Gayle McDowell', category: 'Career', isbn: '978-0984782857', quantity: 8, availableCopies: 6, rackNumber: 'E1-Shelf1', coverColor: '#06b6d4' },
      { title: 'Head First Design Patterns', author: 'Eric Freeman', category: 'Software Engineering', isbn: '978-0596007126', quantity: 3, availableCopies: 3, rackNumber: 'A2-Shelf2', coverColor: '#ec4899' },
    ];

    await Book.insertMany(books);
    console.log(`✅ ${books.length} books seeded`);

    console.log('\n🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
