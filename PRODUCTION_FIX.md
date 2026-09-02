# 🚨 Complete Fix for Production Issues

## Problems Identified

1. ❌ **Frontend 404 on routes** (`/sign-in`, `/forgot-password`)
2. ❌ **SignalR hub 404** (`/hubs/call`)
3. ❌ **Possible CORS issues** (backend may not allow frontend)

---

## ✅ Solution Steps

### Step 1: Update Backend Environment Variable on Render

Your backend CORS configuration reads from `ClientUrl` environment variable. You need to update it:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Go to **Environment** tab
4. Find `ClientUrl` variable
5. **Update the value to your actual Vercel URL:**
   ```
   https://your-actual-frontend.vercel.app
   ```
   ⚠️ **No trailing slash!**

6. Click **Save Changes**
7. Wait for automatic redeploy (2-3 minutes)

---

### Step 2: Redeploy Frontend to Vercel

Your `vercel.json` has been updated with proper routing configuration. Now redeploy:

```bash
cd src/ReactWeb

# Make sure you're logged in
vercel login

# Deploy to production
vercel --prod
```

**Or if you have GitHub auto-deploy:**
```bash
cd d:\SocialNetworkApp\SocialNetworkApp

git add .
git commit -m "Fix Vercel routing and CORS configuration"
git push origin main
```

Then wait 1-2 minutes for Vercel to auto-deploy.

---

### Step 3: Verify Backend is Running

Check if your backend is healthy:

**Open in browser:**
```
https://socialnetworkapp-o8qw.onrender.com/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-02T07:00:00Z"
}
```

**If you get an error:**
1. Go to Render Dashboard
2. Check **Logs** tab
3. Look for startup errors
4. Common issues:
   - Database connection failed (check connection string)
   - Missing environment variables
   - Build failed

---

### Step 4: Test SignalR Hubs

Your backend has these hubs registered:
- `/hubs/chat` ✅
- `/hubs/call` ✅
- `/hubs/notifications` ✅

**Why they might show 404 in console:**

SignalR hubs return 404 when:
- Accessed directly in browser (normal behavior)
- Backend is not running
- CORS blocks the connection

The hub URLs in your error show:
```
socialnetworkapp-o8qw.onrender.com/hubs/call
```

This is correct! The 404 might be because:
1. **Render service is sleeping** (free tier spins down after 15 min)
2. **CORS is blocking** the connection
3. **Backend crashed** during startup

---

## 🔍 Quick Diagnostics

### Test 1: Backend Health
```bash
curl https://socialnetworkapp-o8qw.onrender.com/health
```
✅ Should return: `{"status":"healthy",...}`

### Test 2: Swagger API Docs
Open in browser:
```
https://socialnetworkapp-o8qw.onrender.com/swagger
```
✅ Should show API documentation

### Test 3: Frontend Routes
After redeploying, test these URLs directly:
```
https://your-app.vercel.app/sign-in
https://your-app.vercel.app/forgot-password
https://your-app.vercel.app/
```
✅ Should load without 404

### Test 4: Check Browser Console
1. Open your frontend
2. Press F12 (DevTools)
3. Go to **Console** tab
4. Look for CORS errors like:
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```

---

## 🛠️ Additional Fixes

### If CORS Errors Persist

Update your Render environment variables to allow multiple origins:

**Add this variable:**
```
ClientUrl=https://your-frontend.vercel.app,https://your-frontend-preview.vercel.app
```

Then you'll need to update `Program.cs` to handle multiple origins:

```csharp
var clientUrls = builder.Configuration["ClientUrl"]!.Split(',');

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins(clientUrls)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
```

---

### If Render Service Keeps Sleeping

Free tier services on Render spin down after 15 minutes of inactivity. Solutions:

1. **Upgrade to paid plan** ($7/month) - keeps service always on
2. **Use a ping service** - Keep it awake (search "Render keep alive service")
3. **Accept the 30-60s cold start** - First request wakes it up

---

### If SignalR Connection Fails

Check your frontend SignalR connection code. It should use:

```javascript
const connection = new HubConnectionBuilder()
    .withUrl("https://socialnetworkapp-o8qw.onrender.com/hubs/chat", {
        withCredentials: true,
        accessTokenFactory: () => localStorage.getItem('token')
    })
    .build();
```

Make sure:
- ✅ URL has no trailing slash
- ✅ `withCredentials: true` is set
- ✅ Token is being sent
- ✅ CORS allows credentials

---

## 📋 Deployment Checklist

### Backend (Render)
- [ ] `ClientUrl` environment variable updated to Vercel URL
- [ ] Service redeployed automatically
- [ ] `/health` endpoint returns 200 OK
- [ ] `/swagger` loads correctly
- [ ] Check logs for errors

### Frontend (Vercel)
- [ ] `vercel.json` exists in `src/ReactWeb/`
- [ ] Environment variables set in Vercel dashboard:
  - [ ] `VITE_API_BASE_URL=https://socialnetworkapp-o8qw.onrender.com/api`
  - [ ] `VITE_API_HUB_BASE_URL=https://socialnetworkapp-o8qw.onrender.com`
  - [ ] Other `VITE_DEFAULT_*` variables
- [ ] Deployed to production
- [ ] Test direct URL access (no 404)
- [ ] Test page refresh (no 404)

### Integration Testing
- [ ] Can login successfully
- [ ] No CORS errors in console
- [ ] SignalR connects (check Network tab)
- [ ] Can create posts, send messages
- [ ] Real-time features work

---

## 🎯 Quick Command Summary

```bash
# 1. Redeploy frontend
cd src/ReactWeb
vercel --prod

# 2. Test backend health
curl https://socialnetworkapp-o8qw.onrender.com/health

# 3. Check Render logs
# Go to: https://dashboard.render.com → Your Service → Logs

# 4. Test frontend
# Visit: https://your-app.vercel.app/sign-in
```

---

## 🆘 Still Having Issues?

### Get Your Actual URLs

1. **Vercel Frontend URL:**
   - Go to Vercel Dashboard
   - Copy the production URL (e.g., `https://socialnet-xyz.vercel.app`)

2. **Update Render `ClientUrl`:**
   - Paste that exact URL in Render environment variables
   - No trailing slash!

3. **Update Vercel `VITE_API_BASE_URL`:**
   ```
   VITE_API_BASE_URL=https://socialnetworkapp-o8qw.onrender.com/api
   VITE_API_HUB_BASE_URL=https://socialnetworkapp-o8qw.onrender.com
   ```

4. **Redeploy both services**

5. **Wait 2-3 minutes for propagation**

6. **Clear browser cache** (Ctrl+Shift+Delete)

7. **Test again**

---

**After completing all steps, wait 2-3 minutes, clear cache, and test! 🚀**
