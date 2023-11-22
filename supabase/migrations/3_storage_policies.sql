CREATE POLICY "all users can see all profiles 1ige2ga_0" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'profiles');

CREATE POLICY "Give users crud access to own folder 1ige2ga_0" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Give users crud access to own folder 1ige2ga_1" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
