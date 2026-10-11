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
  pgm.createTable("tasks", {
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

    title: {
      type: "text",
      notNull: true,
    },

    description: {
      type: "text",
    },

    status: {
      type: "text",
      notNull: true,
      default: "pending",
    },

    priority: {
      type: "smallint",
      notNull: true,
      default: 3,
    },

    deadline_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()")
    },

    estimated_minutes: {
      type: "integer",
    },

    completed_at: {
      type: "timestamptz",
    },

    version: {
      type: "integer",
      notNull: true,
      default: 1,
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

  pgm.addConstraint("tasks", "tasks_status_check", {
    check: "status IN ('pending', 'in_progress', 'completed', 'cancelled')",
  });

  pgm.addConstraint("tasks", "tasks_priority_check", {
    check: "priority BETWEEN 1 AND 100",
  });

  pgm.addConstraint("tasks", "tasks_estimated_minutes_check", {
    check: "estimated_minutes IS NULL OR estimated_minutes > 0",
  });

  pgm.addConstraint("tasks", "tasks_completed_check", {
    check: `
      (status = 'completed' AND completed_at IS NOT NULL)
      OR
      (status <> 'completed' AND completed_at IS NULL)
    `,
  });

  pgm.createIndex("tasks", ["user_id"]);

  pgm.createIndex("tasks", ["user_id", "status"]);

  pgm.createIndex("tasks", ["user_id", "deadline_at"]);
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async(pgm) => {
  pgm.dropTable("tasks");
};

