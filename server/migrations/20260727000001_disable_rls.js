/**
 * Disable RLS on all tables for demo purposes.
 *
 * This is a demo project with no authentication.
 * RLS is not needed and would only add complexity.
 */

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE landlords DISABLE ROW LEVEL SECURITY;
    ALTER TABLE students DISABLE ROW LEVEL SECURITY;
    ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE images DISABLE ROW LEVEL SECURITY;
    ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
    ALTER TABLE roommate_profiles DISABLE ROW LEVEL SECURITY;
    ALTER TABLE verification_records DISABLE ROW LEVEL SECURITY;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
    ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE images ENABLE ROW LEVEL SECURITY;
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
    ALTER TABLE roommate_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
  `);
};
