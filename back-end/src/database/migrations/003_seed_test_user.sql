INSERT INTO users (name, email, password, salt, role)
VALUES (
  'Teste',
  'teste@teste.com',
  '$2b$12$MjIkNyfBn43ChD9Rl6b3M.L.FIA10EqSczoLmfSv.TM65LytzF8cK',
  '$2b$12$MjIkNyfBn43ChD9Rl6b3M.',
  'user'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users_screens (user_id, screen_id)
SELECT u.user_id, s.screen_id
  FROM users   u
  JOIN screens s ON s.name = 'Dashboard'
 WHERE u.email = 'teste@teste.com'
ON CONFLICT DO NOTHING;
