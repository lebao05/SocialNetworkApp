# Docker Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (free tier available at render.com)
- Git installed locally

## Steps to Deploy

### 1. Test Docker Build Locally (Optional)
```powershell
# From the solution root directory
cd d:\SocialNetworkApp\SocialNetworkApp

# Build the Docker image
docker build -t socialnet-backend .

# Test run locally (optional)
docker run -p 8080:8080 `
  -e ConnectionStrings__DefaultConnection="your_postgres_connection" `
  -e Jwt__Key="your_jwt_key" `
  -e Neo4j__Uri="your_neo4j_uri" `
  -e Neo4j__Username="your_neo4j_username" `
  -e Neo4j__Password="your_neo4j_password" `
  -e ClientUrl="http://localhost:5173" `
  socialnet-backend
```

### 2. Push to GitHub

```powershell
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Add Docker deployment configuration"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com/
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect account" if you haven't connected GitHub
   - Select your repository
   - Click "Connect"

3. **Configure Web Service**
   - **Name**: `socialnet-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.` if required)
   - **Runtime**: `Docker`
   - **Instance Type**: `Free` (or paid plan for production)

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" for each:

   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=Host=db.dusyyxgsdclghdebonua.supabase.co;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   Jwt__Key=YOUR_SECURE_JWT_KEY_AT_LEAST_32_CHARACTERS_LONG
   Jwt__Issuer=SocialNet
   Jwt__Audience=socialnet_users
   Jwt__ExpirationDurationInHour=168
   Neo4j__Uri=neo4j+s://8425bcf3.databases.neo4j.io
   Neo4j__Username=8425bcf3
   Neo4j__Password=SYXB4SP3kwXSvUclvDTbauf0sWDMBP5x7F88PBPDqzk
   Neo4j__Database=8425bcf3
   ClientUrl=https://your-frontend-url.com
   Security__MessageEncryptionKey=YOUR_32_CHARACTER_ENCRYPTION_KEY
   Cloudinary__CloudName=your_cloud_name
   Cloudinary__ApiKey=your_api_key
   Cloudinary__ApiSecret=your_api_secret
   Email__Smtp__Host=smtp.gmail.com
   Email__Smtp__Port=587
   Email__Smtp__Username=your_email@gmail.com
   Email__Smtp__Password=your_app_password
   Email__Smtp__FromName=SocialNet
   Email__Smtp__FromAddress=your_email@gmail.com
   Email__Smtp__UseSsl=true
   ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Render will automatically build and deploy your Docker container
   - Wait 5-10 minutes for the first deployment

6. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://socialnet-backend.onrender.com`
   - Test it by visiting: `https://socialnet-backend.onrender.com/swagger`

### 4. Update Frontend Configuration

Update your React app's API URL to point to the Render backend:
```javascript
// In your .env or axios.js
VITE_API_URL=https://socialnet-backend.onrender.com
```

### 5. Important Notes

- **Free Tier Limitations**: 
  - Service spins down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - 750 hours/month free

- **CORS Configuration**: Make sure your backend allows your frontend domain
  
- **Database**: Your Supabase PostgreSQL is already configured

- **Logs**: View logs in Render dashboard → Your service → Logs tab

### 6. Troubleshooting

If deployment fails:
1. Check build logs in Render dashboard
2. Verify all environment variables are set correctly
3. Ensure Dockerfile is in the repository root
4. Check that port 8080 is used (Render requirement)

### 7. Custom Domain (Optional)

Once deployed:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed by Render
