# sudocart

## Run locally

### Backend
1. Go to `backend`.
2. Create `.env` from `.env.example`.
3. Install packages and start server:

```bash
npm install
npm start
```

### Frontend
1. Go to `frontend`.
2. Create `.env` and set:

```env
REACT_APP_API_URL=https://sudocart.onrender.com
```

3. Install packages and run:

```bash
npm install
npm start
```

## Hosting guide (recommended)

Use this split setup:
- Backend: Render Web Service
- Frontend: Vercel (or Netlify)
- Database: MongoDB Atlas

### 1) Deploy backend on Render
1. Create a new Web Service from this repo, root directory: `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables:
	- `MONGO_URI`
	- `JWT_SECRET`
	- `PORT=8000`
	- `CLIENT_URLS=https://<your-frontend-domain>`
5. Deploy and copy backend URL, for example:
	- `https://sudocart-api.onrender.com`

### 2) Deploy frontend on Vercel
1. Import same repo, root directory: `frontend`.
2. Framework preset: `Create React App`.
3. Add environment variable:
	- `REACT_APP_API_URL=https://<your-backend-domain>`
4. Deploy.

### 3) Update CORS
After frontend is deployed, set backend `CLIENT_URLS` to your exact frontend URL.

If you have multiple frontend URLs, use comma-separated values:

```env
CLIENT_URLS=https://your-app.vercel.app,https://www.yourdomain.com
```

## Important security note
- Never commit real secrets in `.env`.
- If any credentials were exposed, rotate them immediately (MongoDB password + JWT secret).