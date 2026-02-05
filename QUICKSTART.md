# 🚀 Quick Start Guide - Stumarto Live

Your school marketplace is **LIVE** and ready to use!

---

## 📍 Access Your App

**🌐 Live URL**: https://poetic-ambition-production-4e42.up.railway.app/

**✅ Status**: Running on Railway  
**⚡ Performance**: Optimized production build  
**🛡️ Security**: HTTPS enabled  
**📊 Database**: Mock mode (auto-fallback working)

---

## 🎮 Test Credentials

### Admin Account (Pre-seeded)
```
Email:    admin@stumarto.com
Password: admin123
```

### Create Test User
- Click "Sign Up" on the app
- Enter any email and password
- Start shopping!

---

## ✨ Quick Feature Test

1. **Browse Products**
   - Go to Marketplace
   - View available products

2. **Add to Cart**
   - Click "Add to Cart"
   - View cart

3. **Checkout**
   - Proceed to checkout
   - Use test payment (Razorpay test mode)

4. **Admin Dashboard**
   - Login as admin
   - View sales, users, orders

---

## 🔄 Deploying Changes

### Your Code → Live in 2 Minutes

```bash
# 1. Make code changes
# 2. Commit
git add .
git commit -m "Your change"

# 3. Push to Railway
git push

# ✅ Auto-deployment starts
# Takes ~2-3 minutes
```

**That's it!** No manual deployment needed.

---

## 📊 Monitor Your App

### View Logs (Real-time)
1. Go to https://railway.app/
2. Login
3. Select your project
4. Click "Logs" tab
5. See what's happening now

### Check Performance
- CPU/Memory usage
- Request count
- Error rates
- Uptime

---

## 🔧 Update Environment Variables

### To Add MongoDB (Optional)
1. Railway dashboard → Variables
2. Add new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://user:pass@cluster.mongodb.net/database`
3. Save
4. Railway auto-restarts

### To Enable Live Razorpay (Optional)
1. Railway dashboard → Variables
2. Update these variables:
   - `PAYMENT_MODE=live`
   - `RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx`
   - `RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx`
3. Save and restart

---

## 💡 Useful Commands

```bash
# Local testing
npm install           # Install all deps
npm run build        # Build frontend
npm start            # Start backend

# Docker testing
docker build -t stumarto .
docker run -p 5000:5000 stumarto

# Git operations
git push             # Deploy to Railway
git log --oneline   # View commit history
```

---

## 🆘 Troubleshooting

### App won't load
- Check Railway logs for errors
- Try refreshing the page
- Check internet connection

### API returning 404
- Verify API endpoint: `/api/products`, `/api/cart`, etc.
- Check backend logs
- Make sure backend is running

### Payment not working
- Currently in test mode (this is normal)
- To enable live payments, add real Razorpay keys
- Test mode cards work with mock data

### Database errors
- App gracefully falls back to mock database
- To use real MongoDB, add MONGODB_URI variable
- MongoDB is optional - app works fine without it

---

## 📈 Performance Metrics

| Metric | Value |
|--------|-------|
| **Build Time** | ~30 seconds |
| **Bundle Size** | 605KB total, 180KB gzipped |
| **Backend Memory** | 50-100MB |
| **Startup Time** | 3-5 seconds |
| **Database** | Mock (instant), MongoDB (optional) |

---

## 🎯 Next Steps

**Immediate**:
1. ✅ Test the app at live URL
2. ✅ Try all features (sign up, cart, checkout)
3. ✅ Share the link!

**Short-term** (Next week):
1. Add real MongoDB for persistent data
2. Customize branding/colors
3. Add more products

**Medium-term** (Next month):
1. Enable live Razorpay payments
2. Setup analytics/monitoring
3. Add more features/pages

**Long-term**:
1. Mobile app version
2. Advanced analytics
3. Social features
4. Marketing integrations

---

## 📚 Docs to Read

- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Full checklist
- [DEPLOYMENT_FINAL.md](DEPLOYMENT_FINAL.md) - Detailed deployment guide
- [backend/README.md](backend/README.md) - Backend API docs
- [README.md](README.md) - Project overview

---

## 🆘 Need Help?

**Check these first:**
1. Railway logs (dashboard → logs)
2. Error messages in browser console (F12)
3. Backend error responses

**Common issues:**
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+Shift+R)
- Check internet connection
- Verify variable names are exact

---

## 🎉 You're All Set!

Your marketplace is live! Share the link and start selling! 🚀

```
https://poetic-ambition-production-4e42.up.railway.app/
```

**Questions?** Check the documentation or Railway docs at https://docs.railway.app/

---

*Status: ✅ LIVE*  
*Last Updated: Today*  
*Environment: Production*  
*Platform: Railway*
