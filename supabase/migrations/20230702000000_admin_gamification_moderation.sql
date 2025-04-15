-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
-- Note: In a real application, you would hash the password properly
-- This is just for demonstration purposes
INSERT INTO admin_users (email, password_hash) 
VALUES ('allenkileo7@gmail.com', 'Year2020$');

-- Create chat_rules table
CREATE TABLE IF NOT EXISTS chat_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity INTEGER NOT NULL, -- 1: warning, 2: temporary suspension, 3: permanent ban
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default chat rules
INSERT INTO chat_rules (title, description, severity) VALUES
('Respectful Communication', 'Always communicate respectfully with others. Avoid offensive language, personal attacks, or disrespectful behavior.', 1),
('No Harassment', 'Harassment of any kind is not tolerated. This includes threats, intimidation, or persistent unwanted contact.', 3),
('No Harmful Content', 'Do not share content that promotes self-harm, suicide, or harmful behaviors.', 3),
('Privacy Respect', 'Respect the privacy of others. Do not share personal information without consent.', 2),
('No Spam', 'Do not send spam messages or repeatedly post the same content.', 1);

-- Create flagged_messages table
CREATE TABLE IF NOT EXISTS flagged_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admin_users(id)
);

-- Create user_violations table
CREATE TABLE IF NOT EXISTS user_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  rule_id UUID REFERENCES chat_rules(id),
  message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('warning', 'temporary_suspension', 'permanent_ban')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Create gamification tables
-- Points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, description, points, icon_name) VALUES
('First Steps', 'Complete your profile and first mood entry', 50, 'award'),
('Consistent Tracker', 'Log your mood for 7 consecutive days', 100, 'calendar'),
('Journal Master', 'Create 10 journal entries', 150, 'book'),
('Mindfulness Explorer', 'Complete 5 chat sessions with the AI assistant', 100, 'brain'),
('Connection Seeker', 'Book your first appointment with a therapist', 200, 'users'),
('Feedback Provider', 'Leave a review for a therapist', 75, 'message-square'),
('Streak Champion', 'Maintain a 30-day streak of app usage', 300, 'zap'),
('Reflection Pro', 'Complete 30 journal entries', 250, 'pen-tool'),
('Mood Analyst', 'Track your mood for 30 days total', 200, 'bar-chart');

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  achievement_id UUID REFERENCES achievements(id),
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Point activities table
CREATE TABLE IF NOT EXISTS point_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics tables
CREATE TABLE IF NOT EXISTS app_usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_users INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  new_users INTEGER NOT NULL DEFAULT 0,
  mood_entries INTEGER NOT NULL DEFAULT 0,
  journal_entries INTEGER NOT NULL DEFAULT 0,
  chat_messages INTEGER NOT NULL DEFAULT 0,
  therapist_appointments INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions and triggers for gamification
-- Function to update user points when a mood entry is created
CREATE OR REPLACE FUNCTION update_points_on_mood_entry()
RETURNS TRIGGER AS $
BEGIN
  -- Check if user exists in user_points
  INSERT INTO user_points (user_id, total_points, streak_days, last_activity_date)
  VALUES (NEW.user_id, 0, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update streak if last activity was yesterday
  UPDATE user_points
  SET 
    streak_days = CASE 
      WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
      WHEN last_activity_date = CURRENT_DATE THEN streak_days
      ELSE 1
    END,
    last_activity_date = CURRENT_DATE,
    total_points = total_points + 10,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Record the activity
  INSERT INTO point_activities (user_id, activity_type, points, description)
  VALUES (NEW.user_id, 'mood_entry', 10, 'Logged mood entry');
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for mood entries
CREATE TRIGGER mood_entry_points_trigger
AFTER INSERT ON mood_entries
FOR EACH ROW
EXECUTE FUNCTION update_points_on_mood_entry();

-- Function to update user points when a journal entry is created
CREATE OR REPLACE FUNCTION update_points_on_journal_entry()
RETURNS TRIGGER AS $
BEGIN
  -- Check if user exists in user_points
  INSERT INTO user_points (user_id, total_points, streak_days, last_activity_date)
  VALUES (NEW.user_id, 0, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update points
  UPDATE user_points
  SET 
    total_points = total_points + 20,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Record the activity
  INSERT INTO point_activities (user_id, activity_type, points, description)
  VALUES (NEW.user_id, 'journal_entry', 20, 'Created journal entry');
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for journal entries
CREATE TRIGGER journal_entry_points_trigger
AFTER INSERT ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_points_on_journal_entry();

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $
BEGIN
  -- Check for mood tracking achievements
  IF (SELECT COUNT(*) FROM mood_entries WHERE user_id = NEW.user_id) = 1 THEN
    -- First mood entry
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT NEW.user_id, id FROM achievements WHERE name = 'First Steps'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
  
  IF (SELECT COUNT(*) FROM mood_entries WHERE user_id = NEW.user_id) >= 30 THEN
    -- 30 mood entries
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT NEW.user_id, id FROM achievements WHERE name = 'Mood Analyst'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
  
  -- Check for streak achievements
  IF NEW.streak_days >= 7 THEN
    -- 7-day streak
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT NEW.user_id, id FROM achievements WHERE name = 'Consistent Tracker'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
  
  IF NEW.streak_days >= 30 THEN
    -- 30-day streak
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT NEW.user_id, id FROM achievements WHERE name = 'Streak Champion'
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;
  
  -- Update user level based on points
  UPDATE user_points
  SET level = FLOOR(total_points / 100) + 1
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for checking achievements when points are updated
CREATE TRIGGER check_achievements_trigger
AFTER UPDATE ON user_points
FOR EACH ROW
EXECUTE FUNCTION check_achievements();

-- Function to update analytics
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS VOID AS $
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Create or update today's record
  INSERT INTO app_usage_stats (date, total_users, active_users, new_users, mood_entries, journal_entries, chat_messages, therapist_appointments)
  VALUES (
    today,
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(DISTINCT user_id) FROM user_points WHERE last_activity_date = today),
    (SELECT COUNT(*) FROM auth.users WHERE created_at::date = today),
    (SELECT COUNT(*) FROM mood_entries WHERE created_at::date = today),
    (SELECT COUNT(*) FROM journal_entries WHERE created_at::date = today),
    (SELECT COUNT(*) FROM chat_messages WHERE created_at::date = today),
    (SELECT COUNT(*) FROM appointments WHERE created_at::date = today)
  )
  ON CONFLICT (date) DO UPDATE
  SET 
    total_users = (SELECT COUNT(*) FROM auth.users),
    active_users = (SELECT COUNT(DISTINCT user_id) FROM user_points WHERE last_activity_date = today),
    new_users = (SELECT COUNT(*) FROM auth.users WHERE created_at::date = today),
    mood_entries = (SELECT COUNT(*) FROM mood_entries WHERE created_at::date = today),
    journal_entries = (SELECT COUNT(*) FROM journal_entries WHERE created_at::date = today),
    chat_messages = (SELECT COUNT(*) FROM chat_messages WHERE created_at::date = today),
    therapist_appointments = (SELECT COUNT(*) FROM appointments WHERE created_at::date = today);
END;
$ LANGUAGE plpgsql;

-- Create a function to be called by a cron job to update analytics daily
CREATE OR REPLACE FUNCTION cron_update_analytics()
RETURNS VOID AS $
BEGIN
  PERFORM update_daily_analytics();
END;
$ LANGUAGE plpgsql;
