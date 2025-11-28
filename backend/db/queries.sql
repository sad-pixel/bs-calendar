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
