/**
 * Admin User Seeding Utility
 * Automatically creates admin user if it doesn't exist
 * Works with both MongoDB and Supabase
 */

const bcrypt = require('bcryptjs');

/**
 * Seed admin user in MongoDB
 */
const seedAdminMongoDB = async (User) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stumarto.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@stumarto2024';
    
    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      console.log(`✅ Admin user exists: ${adminEmail}`);
      return existing;
    }

    const admin = await User.create({
      name: 'Platform Admin',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'admin',
      location: 'Headquarters',
      createdAt: new Date()
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
    return admin;
  } catch (error) {
    console.error('❌ Error seeding admin in MongoDB:', error.message);
    throw error;
  }
};

/**
 * Seed admin user in Supabase
 */
const seedAdminSupabase = async (supabaseService) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stumarto.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@stumarto2024';

    // Check if admin exists
    const existing = await supabaseService.getUser(adminEmail.toLowerCase());
    if (existing) {
      console.log(`✅ Admin user exists: ${adminEmail}`);
      return existing;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await supabaseService.createUser({
      name: 'Platform Admin',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      location: 'Headquarters'
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
    return admin;
  } catch (error) {
    console.error('❌ Error seeding admin in Supabase:', error.message);
    // Don't throw - let it fail silently and allow the app to continue
    return null;
  }
};

/**
 * Seed data based on database type
 */
const seedAdmin = async (User, supabaseService) => {
  if (process.env.SUPABASE_URL && supabaseService) {
    return await seedAdminSupabase(supabaseService);
  } else if (User) {
    return await seedAdminMongoDB(User);
  }
};

module.exports = {
  seedAdmin,
  seedAdminMongoDB,
  seedAdminSupabase
};
