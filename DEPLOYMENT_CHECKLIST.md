# Quick Deployment Checklist

## ✅ Files Created
- [x] `Dockerfile` - Multi-stage Docker build configuration
- [x] `.dockerignore` - Excludes unnecessary files from Docker build
- [x] `appsettings.Production.json` - Production configuration template
- [x] `render.yaml` - Render service configuration (optional)
- [x] `RENDER_DEPLOYMENT.md` - Detailed deployment guide
- [x] `/health` endpoint added to Program.cs

## 🚀 Quick Deploy Steps

### 1. Test Locally (Optional)
```powershell
cd d:\SocialNetworkApp\SocialNetworkApp
docker build -t socialnet-backend .
```

### 2. Push to GitHub
```powershell
git add .
git commit -m "Add Docker deployment configuration"
git push origin main
```

### 3. Deploy on Render
1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Runtime**: Docker
   - **Branch**: main
   - **Instance Type**: Free (for testing)
5. Add environment variables (see list below)
6. Click **Create Web Service**

### 4. Required Environment Variables

**Essential (Must configure):**
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=db.dusyyxgsdclghdebonua.supabase.co;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
Jwt__Key=YOUR_SECURE_JWT_KEY_MINIMUM_32_CHARACTERS_LONG!!!
ClientUrl=https://your-frontend-url.com
```

**Neo4j (Already configured, copy from appsettings.json):**
```
Neo4j__Uri=neo4j+s://8425bcf3.databases.neo4j.io
Neo4j__Username=8425bcf3
Neo4j__Password=SYXB4SP3kwXSvUclvDTbauf0sWDMBP5x7F88PBPDqzk
Neo4j__Database=8425bcf3
```

**Security:**
```
Security__MessageEncryptionKey=YOUR_32_CHARACTER_ENCRYPTION_KEY!!!
```

**Cloudinary (For image uploads):**
```
Cloudinary__CloudName=your_cloud_name
Cloudinary__ApiKey=your_api_key
Cloudinary__ApiSecret=your_api_secret
```

**Email (Optional, for password reset):**
```
Email__Smtp__Host=smtp.gmail.com
Email__Smtp__Port=587
Email__Smtp__Username=your_email@gmail.com
Email__Smtp__Password=your_app_password
Email__Smtp__FromName=SocialNet
Email__Smtp__FromAddress=your_email@gmail.com
Email__Smtp__UseSsl=true
```

**JWT Settings:**
```
Jwt__Issuer=SocialNet
Jwt__Audience=socialnet_users
Jwt__ExpirationDurationInHour=168
```

### 5. After Deployment

Your backend will be available at:
```
https://your-service-name.onrender.com
```

Test it:
- Health check: `https://your-service-name.onrender.com/health`
- Swagger UI: `https://your-service-name.onrender.com/swagger`

### 6. Update Frontend

Update your React app's API URL:
```javascript
// src/apis/axios.js
const API_URL = 'https://your-service-name.onrender.com';
```

## ⚠️ Important Notes

- **First Deploy**: Takes 5-10 minutes
- **Free Tier**: Spins down after 15 min inactivity, cold start takes 30-60s
- **Database**: Make sure Supabase allows connections from Render IPs
- **CORS**: Your ClientUrl must match your frontend domain exactly
- **Secrets**: Never commit appsettings.Production.json with real secrets

## 🐛 Troubleshooting

**Build fails?**
- Check Render logs for detailed error
- Verify Dockerfile is in repository root
- Ensure all .csproj files are committed

**App crashes?**
- Check environment variables are set correctly
- Verify database connection string
- Check Render logs for runtime errors

**502 Bad Gateway?**
- App might be starting up (wait 60s on free tier)
- Check if app is listening on port 8080
- Verify ASPNETCORE_URLS is set correctly

**CORS errors?**
- Verify ClientUrl environment variable matches frontend URL exactly
- Include protocol (https://) in ClientUrl
- Check browser console for exact CORS error

## 📚 Full Guide

See `RENDER_DEPLOYMENT.md` for detailed instructions.
