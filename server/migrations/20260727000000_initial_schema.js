/**
 * Initial database schema for CampusNest AI.
 *
 * Creates all 7 tables defined in docs/03-database.md:
 *   landlords, students, listings, images, reviews,
 *   roommate_profiles, verification_records
 *
 * Foreign key order:
 *   landlords -> listings -> images, reviews, verification_records
 *   students  -> roommate_profiles
 */

exports.up = (pgm) => {
  // --- landlords ---
  pgm.createTable("landlords", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    name: { type: "text", notNull: true },
    phone: { type: "text", notNull: true },
    email: { type: "text", notNull: true },
  });

  // --- students ---
  pgm.createTable("students", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    name: { type: "text", notNull: true },
    university: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
    budget: { type: "numeric(10,2)", notNull: true },
    preferences: { type: "jsonb", notNull: true },
  });
  pgm.sql("ALTER TABLE students ALTER COLUMN preferences SET DEFAULT '{}'::jsonb");

  // --- listings ---
  pgm.createTable("listings", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    landlord_id: {
      type: "uuid",
      notNull: true,
      references: "landlords",
      onDelete: "CASCADE",
    },
    title: { type: "text", notNull: true },
    description: { type: "text", notNull: true },
    university: { type: "text", notNull: true },
    location: { type: "text", notNull: true },
    price: { type: "numeric(10,2)", notNull: true },
    distance: { type: "numeric(5,2)", notNull: true },
    wifi: { type: "boolean", notNull: true, default: false },
    bathrooms: { type: "integer", notNull: true, default: 1 },
    kitchen: { type: "boolean", notNull: true, default: false },
    gender: { type: "text", notNull: true, default: "mixed" },
    noise_level: { type: "text", notNull: true, default: "moderate" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("listings", "university");
  pgm.createIndex("listings", "price");
  pgm.createIndex("listings", "location");

  // --- images ---
  pgm.createTable("images", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    listing_id: {
      type: "uuid",
      notNull: true,
      references: "listings",
      onDelete: "CASCADE",
    },
    url: { type: "text", notNull: true },
  });

  pgm.createIndex("images", "listing_id");

  // --- reviews ---
  pgm.createTable("reviews", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    listing_id: {
      type: "uuid",
      notNull: true,
      references: "listings",
      onDelete: "CASCADE",
    },
    rating: { type: "integer", notNull: true },
    comment: { type: "text", notNull: true },
  });

  pgm.createIndex("reviews", "listing_id");

  // --- roommate_profiles ---
  pgm.createTable("roommate_profiles", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    student_id: {
      type: "uuid",
      notNull: true,
      references: "students",
      onDelete: "CASCADE",
    },
    cleanliness: { type: "text", notNull: true },
    study_schedule: { type: "text", notNull: true },
    sleep_schedule: { type: "text", notNull: true },
    smoking: { type: "boolean", notNull: true, default: false },
    interests: { type: "jsonb", notNull: true },
  });
  pgm.sql("ALTER TABLE roommate_profiles ALTER COLUMN interests SET DEFAULT '[]'::jsonb");

  pgm.createIndex("roommate_profiles", "student_id");

  // --- verification_records ---
  pgm.createTable("verification_records", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    listing_id: {
      type: "uuid",
      notNull: true,
      references: "listings",
      onDelete: "CASCADE",
    },
    verification_date: { type: "timestamptz", notNull: true },
    confidence: { type: "numeric(3,2)", notNull: true },
    notes: { type: "text", notNull: true },
  });

  pgm.createIndex("verification_records", "listing_id");
};

exports.down = (pgm) => {
  pgm.dropTable("verification_records");
  pgm.dropTable("roommate_profiles");
  pgm.dropTable("reviews");
  pgm.dropTable("images");
  pgm.dropTable("listings");
  pgm.dropTable("students");
  pgm.dropTable("landlords");
};
