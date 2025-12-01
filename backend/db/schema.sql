CREATE TABLE level (
    id INTEGER PRIMARY KEY,
    name TEXT
);

CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    name TEXT,
    calendar_url TEXT,
    last_sync_at TEXT,
    last_sync_http_status INTEGER,
    level_id INTEGER,
    FOREIGN KEY (level_id) REFERENCES level(id)
);

CREATE INDEX idx_courses_level_id ON courses(level_id);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    picture TEXT,
    email TEXT UNIQUE,
    calendar_token TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(32)))),
    last_login_at TEXT,
    last_calendar_sync_at TEXT
);

CREATE INDEX idx_users_calendar_token ON users(calendar_token);

CREATE TABLE user_courses (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    course_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses(course_id);

CREATE TABLE calendars (
    id INTEGER PRIMARY KEY,
    course_id TEXT UNIQUE,
    ics_string TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE INDEX idx_calendars_course_id ON calendars(course_id);
