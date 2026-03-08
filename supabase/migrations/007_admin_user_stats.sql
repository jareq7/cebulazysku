-- Admin function: get user stats with tracked offers count
-- Only callable by service_role (used from admin API)

CREATE OR REPLACE FUNCTION admin_get_users_with_stats()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  tracked_offers_count BIGINT,
  conditions_completed BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    u.id AS user_id,
    u.email::TEXT,
    u.created_at,
    u.last_sign_in_at,
    COALESCE(t.cnt, 0) AS tracked_offers_count,
    COALESCE(c.done, 0) AS conditions_completed
  FROM auth.users u
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS cnt
    FROM tracked_offers
    GROUP BY user_id
  ) t ON t.user_id = u.id
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS done
    FROM condition_progress
    WHERE completed = true
    GROUP BY user_id
  ) c ON c.user_id = u.id
  ORDER BY u.created_at DESC;
$$;

-- Summary stats function
CREATE OR REPLACE FUNCTION admin_get_user_summary()
RETURNS TABLE (
  total_users BIGINT,
  new_last_7_days BIGINT,
  new_last_30_days BIGINT,
  users_tracking BIGINT,
  total_tracked_offers BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    (SELECT COUNT(*) FROM auth.users) AS total_users,
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '7 days') AS new_last_7_days,
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '30 days') AS new_last_30_days,
    (SELECT COUNT(DISTINCT user_id) FROM tracked_offers) AS users_tracking,
    (SELECT COUNT(*) FROM tracked_offers) AS total_tracked_offers;
$$;
