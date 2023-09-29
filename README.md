# FilmFront
![Thumbnail Image](https://mtlh.vercel.app/assets/filmfront_thumb.be80b84e_Z2vjuV8.webp)

## About
Movie site made using TMDb API that allows users to search new movies, tv shows and actors, create lists and answer trivia questions.

## Demo
This project is deployed directly onto Vercel. 
[filmfront.vercel.app](https://filmfront.vercel.app/)

## Technologies
- TailwindCSS
- Typescript
- React
- NextJS
- Supabase
- Vercel (hosting)

## How to deploy locally
Follow the steps below:
1. Download code from this repository.
2. Install every dependency.
```typescript
npm install
```
3. Create api keys from the following sources:
    1. [Supabase](https://supabase.com/dashboard/projects)

4. Get all required keys setup in a .env file.
```typescript
SUPABASE_URL='https://supabaseurl.supabase.co'
BASE_URL='http://localhost:3000/'
SUPABASE_ANON_KEY='supbaseanonkey'
TMDB_APIKEY='apikey'
```
The BASE_URL must be configured based on which port you are using, when creating a hosted version this must be update to be the final url eg. https://filmfront.vercel.app/

5. Run locally
```typescript
 npm run dev
```

6. Enjoy!
