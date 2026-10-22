HD Clarity Speech - Tutor Video Integration Directory
=====================================================

To integrate tutor showcase videos:

Option 1 (Direct Video File):
1. Place the tutor's video file in this directory:
   e.g. `/public/videos/tutor-[id].mp4` or `/public/videos/tutor-intro.mp4`
2. Update the video path in `src/components/tutor/TutorVideoShowcase.tsx` under CLIENT_TUTOR_VIDEOS.

Option 2 (YouTube / Vimeo / Cloudinary Link):
1. Copy the YouTube or Vimeo URL shared by the client (e.g. `https://www.youtube.com/watch?v=...` or `https://vimeo.com/...`).
2. Paste the link directly into `CLIENT_TUTOR_VIDEOS` in `src/components/tutor/TutorVideoShowcase.tsx` mapped to the tutor's ID.
3. The video player automatically handles the responsive cinema embed!
