-- Insert initial freemium users
INSERT INTO public.freemium_whitelist (email)
VALUES 
  ('lucascharao1@hotmail.com'),
  ('eliassilvestre61@gmail.com')
ON CONFLICT (email) DO NOTHING;
