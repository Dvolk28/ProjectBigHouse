CREATE TABLE IF NOT EXISTS "illuminations" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "window_id" integer NOT NULL,
  "name" text NOT NULL,
  "goal" text NOT NULL,
  "color" text NOT NULL DEFAULT 'yellow',
  "timestamp" text NOT NULL,
  CONSTRAINT "illuminations_window_id_range" CHECK ("window_id" BETWEEN 1 AND 5000),
  CONSTRAINT "illuminations_name_length" CHECK (char_length("name") BETWEEN 2 AND 50),
  CONSTRAINT "illuminations_goal_length" CHECK (char_length("goal") BETWEEN 10 AND 200),
  CONSTRAINT "illuminations_color_length" CHECK (char_length("color") BETWEEN 1 AND 50)
);
