# 🔧 Fix Vercel 404 Error for React Router Routes

## 🐛 Problem
You're getting errors like:
```
No routes matched location "/sign-in"
No routes matched location "/forgot-password"
404 error on page refresh
```

This happens because Vercel doesn't know how to handle client-side routes (React Router).

---

## ✅ Solution

### Option 1: Redeploy (Fastest)

Your `vercel.json` is already configured correctly. You just need to redeploy:

```bash
cd src/ReactWeb
vercel --prod
```

**Or** push to GitHub if you have auto-deploy enabled:
```bash
git add .
git commit -m "Fix routing configuration"
git push origin main
```

---

### Option 2: Check Vercel Dashboard Settings

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Check **Framework Preset**: Should be `Vite` or `Other`
5. Check **Root Directory**: Should be `src/ReactWeb`
6. Check **Build Command**: Should be `npm run build` or `vite build`
7. Check **Output Directory**: Should be `dist`

---

### Option 3: Update Environment Variables

Make sure your production environment variables are set in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
VITE_API_BASE_URL=https://socialnetworkapp-o8qw.onrender.com/api
VITE_API_HUB_BASE_URL=https://socialnetworkapp-o8qw.onrender.com
VITE_DEFAULT_AVATAR=https://i.pinimg.com/originals/63/53/d9/6353d9fff14cc31af369dd0254fd8c97.jpg
VITE_DEFAULT_GROUP_COVER=https://thumbs.dreamstime.com/b/teamwork-group-friends-icon-vector-illustration-teamwork-group-friends-icon-118637039.jpg
VITE_DEFAULT_GROUP_AVATAR=https://thumbs.dreamstime.com/b/teamwork-group-friends-icon-vector-illustration-teamwork-group-friends-icon-118637039.jpg
VITE_DEFAULT_CHAT_GROUP_COVER=https://tse4.mm.bing.net/th/id/OIP.NKRY9zCIWY3hsEBahHv05gHaHa?r=0&cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3
VITE_DEFAULT_COVER_PHOTO=https://flowbite.com/docs/images/examples/image-3@2x.jpg
```

3. Click **Save**
4. Redeploy

---

### Option 4: Manual Fix via Vercel CLI

If you haven't deployed yet or need to start fresh:

```bash
# Navigate to your React app
cd src/ReactWeb

# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your account]
# - Link to existing project? N (or Y if already exists)
# - Project name? socialnetwork-frontend
# - Directory? ./
# - Override settings? N
```

---

## 🧪 Test After Deployment

Visit these URLs directly in your browser:

1. `https://your-app.vercel.app/sign-in` ✅ Should load
2. `https://your-app.vercel.app/forgot-password` ✅ Should load
3. `https://your-app.vercel.app/` ✅ Should load
4. Refresh any page ✅ Should not 404

---

## 🔍 Additional SignalR Hub 404 Error

The error you're seeing:
```
socialnetworkapp-o8qw.onrender.com/hubs/call?id=... 404
```

This means your backend API might not be running or the SignalR hub endpoint isn't available. Check:

### Backend Health Check

1. Visit: `https://socialnetworkapp-o8qw.onrender.com/health`
2. If it's down, check Render logs:
   - Go to Render Dashboard
   - Select your service
   - Check **Logs** tab

### SignalR Hub Registration

Make sure your backend `Program.cs` has:

```csharp
app.MapHub<ChatHub>("/hubs/chat");
app.MapHub<CallHub>("/hubs/call");
app.MapHub<NotificationHub>("/hubs/notifications");
```

### CORS Configuration

Make sure your backend allows your frontend URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://your-frontend.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

---

## 📝 Files Modified

- ✅ `vercel.json` - Updated with proper rewrites and headers
- ✅ `_redirects` - Created as fallback for static hosts

---

## 🚀 Quick Command Reference

```bash
# Test locally first
cd src/ReactWeb
npm run dev
# Test: http://localhost:5173/sign-in

# Build and preview
npm run build
npm run preview
# Test: http://localhost:4173/sign-in

# Deploy to Vercel
vercel --prod
```

---

## 💡 Why This Happens

1. **React Router** = Client-side routing (JavaScript handles routes)
2. **Vercel Server** = Doesn't know about `/sign-in` or `/forgot-password`
3. **Solution** = Tell Vercel to serve `index.html` for ALL routes
4. **Result** = React Router takes over and handles routing

---

## ✅ Checklist

- [ ] `vercel.json` exists in `src/ReactWeb/`
- [ ] Redeployed to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Backend is running on Render
- [ ] CORS allows your frontend URL
- [ ] SignalR hubs are registered
- [ ] Tested routes directly in browser
- [ ] Page refresh doesn't cause 404

---

**After redeploying, wait 1-2 minutes for changes to propagate, then test again!**
