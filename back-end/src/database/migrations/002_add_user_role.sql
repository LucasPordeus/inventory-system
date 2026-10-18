ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE users
   SET role = 'admin'
 WHERE email = LOWER(TRIM(current_setting('app.admin_email', true)))
   AND role <> 'admin';
