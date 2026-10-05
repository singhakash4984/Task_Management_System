

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async(pgm) => {
  pgm.createExtension("pgcrypto", {
    ifNotExists: true,
  });

  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    token_hash: {
      type: "text",
      notNull: true,
     
    },
    ip: {
      type: "inet",
      notNull: true,
    },
    user_agent: {
      type: "text",
    },
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    rotated_from: {
      type: "uuid",
      references:"sessions(id)",
      onDelete:"CASCADE"
    },
    revoked_at: {
      type: "timestamptz",
    },
  });

   pgm.createIndex("sessions",["expires_at"])
   pgm.createIndex("sessions",["token_hash"],{
    unique: true
   })
  pgm.createIndex("sessions", ["user_id"], {
    where: "revoked_at is NULL ",
  });

  pgm.createIndex("sessions",["rotated_from"],) ;

 
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async(pgm) => {
  pgm.dropTable("sessions");
};
