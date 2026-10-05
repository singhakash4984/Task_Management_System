/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    email: {
      type: "text",
      notNull: true,
    },

    password_hash: {
      type: "text",
      notNull: true,
    },

    role: {
      type: "text",
      notNull: true,
      default: "client",
    },

    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // 🔥 CRITICAL: case-insensitive unique email
  pgm.createIndex("users", ["LOWER(email)"], {
    unique: true,
  });

  // 🔥 Optional but useful for queries (same expression index reused)
  pgm.createIndex("users", ["LOWER(email)"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
  pgm.dropTable("users");
};



