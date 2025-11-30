-- name: GetCoursesList :many
SELECT
    c.id,
    c.name,
    l.name as level,
    CASE
        WHEN c.calendar_url IS NOT NULL THEN 1
        ELSE 0
    END as calendar_available,
    c.last_sync_at
FROM courses c
JOIN level l ON c.level_id = l.id
ORDER BY c.id ASC;

-- name: GetAllCourseCalendars :many
SELECT
    id,
    calendar_url
FROM courses
WHERE calendar_url IS NOT NULL
ORDER BY id ASC;

-- name: UpdateCalendarSyncStatus :exec
UPDATE courses
SET
    last_sync_at = @last_sync_at,
    last_sync_http_status = @last_sync_http_status
    WHERE id = @id;

-- name: UpdateCourseICal :exec
INSERT INTO calendars (course_id, ics_string)
VALUES (@course_id, @ics_string)
ON CONFLICT (course_id) DO UPDATE
SET ics_string = @ics_string;

-- name: GetCourseICal :one
SELECT ics_string
FROM calendars
WHERE course_id = @course_id;

-- name: LoginUser :one
INSERT INTO users (
    first_name,
    last_name,
    email,
    picture,
    last_login_at
)
VALUES (
    @first_name,
    @last_name,
    @email,
    @picture,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE
SET
    first_name = @first_name,
    last_name = @last_name,
    picture = @picture,
    last_login_at = CURRENT_TIMESTAMP
RETURNING
    id,
    first_name,
    last_name,
    email,
    picture,
    last_login_at,
    last_calendar_sync_at;

-- name: FetchUser :one
SELECT
    first_name,
    last_name,
    picture,
    email
FROM
    users
WHERE
    email = @user_id LIMIT 1;
