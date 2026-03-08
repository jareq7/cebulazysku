-- Admin function: get user stats with tracked offers count
-- Only callable by service_role (used from admin API)

CREATE OR REPLACE FUNCTION admin_get_users_with_stats()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  last_activity_date DATE,
  tracked_offers_count BIGINT,
  conditions_completed BIGINT,
  days_inactive INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    u.id AS user_id,
    u.email::TEXT,
    u.created_at,
    u.last_sign_in_at,
    s.last_activity_date,
    COALESCE(t.cnt, 0) AS tracked_offers_count,
    COALESCE(c.done, 0) AS conditions_completed,
    CASE
      WHEN s.last_activity_date IS NOT NULL
        THEN (CURRENT_DATE - s.last_activity_date)::INTEGER
      WHEN u.last_sign_in_at IS NOT NULL
        THEN (CURRENT_DATE - u.last_sign_in_at::DATE)::INTEGER
      ELSE (CURRENT_DATE - u.created_at::DATE)::INTEGER
    END AS days_inactive
  FROM auth.users u
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS cnt
    FROM tracked_offers
    GROUP BY user_id
  ) t ON t.user_id = u.id
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS done
    FROM condition_progress
    WHERE count > 0
    GROUP BY user_id
  ) c ON c.user_id = u.id
  LEFT JOIN user_streaks s ON s.user_id = u.id
  ORDER BY u.created_at DESC;
$$;

-- Summary stats function
CREATE OR REPLACE FUNCTION admin_get_user_summary()
RETURNS TABLE (
  total_users BIGINT,
  new_last_7_days BIGINT,
  new_last_30_days BIGINT,
  users_tracking BIGINT,
  total_tracked_offers BIGINT,
  active_last_7_days BIGINT,
  inactive_14_plus BIGINT,
  inactive_30_plus BIGINT,
  churn_rate_30d NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH user_activity AS (
    SELECT
      u.id,
      COALESCE(
        s.last_activity_date::TIMESTAMPTZ,
        u.last_sign_in_at,
        u.created_at
      ) AS last_active
    FROM auth.users u
    LEFT JOIN user_streaks s ON s.user_id = u.id
  )
  SELECT
    (SELECT COUNT(*) FROM auth.users) AS total_users,
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '7 days') AS new_last_7_days,
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '30 days') AS new_last_30_days,
    (SELECT COUNT(DISTINCT user_id) FROM tracked_offers) AS users_tracking,
    (SELECT COUNT(*) FROM tracked_offers) AS total_tracked_offers,
    (SELECT COUNT(*) FROM user_activity WHERE last_active >= NOW() - INTERVAL '7 days') AS active_last_7_days,
    (SELECT COUNT(*) FROM user_activity WHERE last_active < NOW() - INTERVAL '14 days') AS inactive_14_plus,
    (SELECT COUNT(*) FROM user_activity WHERE last_active < NOW() - INTERVAL '30 days') AS inactive_30_plus,
    CASE
      WHEN (SELECT COUNT(*) FROM auth.users) = 0 THEN 0
      ELSE ROUND(
        (SELECT COUNT(*)::NUMERIC FROM user_activity WHERE last_active < NOW() - INTERVAL '30 days')
        / (SELECT COUNT(*)::NUMERIC FROM auth.users) * 100, 1
      )
    END AS churn_rate_30d;
$$;
