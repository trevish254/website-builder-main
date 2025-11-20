# 🌐 Port Forwarding Guide - Share Your Local Dev Server

Your development server is currently running on **port 3000**. Here are several ways to make it publicly accessible for testing:

## ✅ Current Status
- ✅ Dev server running: `bun run dev`
- ✅ Port 3000 is active: `http://localhost:3000`

---

## Option 1: VS Code/Cursor Built-in Port Forwarding

### Steps:
1. **Open the Ports panel** in Cursor/VS Code:
   - Click the **Ports** tab in the bottom panel, OR
   - Press `Ctrl+Shift+P` → Type "Ports: Focus on Ports View"

2. **Forward port 3000**:
   - If you see port 3000 listed, click the **globe icon** 🌐 next to it
   - If not listed, click **"Forward a Port"** and enter `3000`
   - **IMPORTANT**: Make sure to select **"Public"** visibility (not Private)

3. **Copy the public URL** that appears (looks like: `https://xxxx-xxxx-xxxx.vscode-cursor.com` or similar)

### If it fails:
- Ensure port 3000 is not blocked by firewall
- Try stopping and restarting Cursor/VS Code
- Check if you need to sign in to GitHub for port forwarding service

---

## Option 2: Localtunnel (Simple & Free) ⭐ RECOMMENDED

This is the easiest option that works immediately:

### Install and Run:
```bash
# One-time install (if not already installed)
bun install -g localtunnel

# Start tunnel (keep this terminal window open)
lt --port 3000
```

You'll get a URL like: `https://random-name.loca.lt`

### Keep it running:
- Leave this terminal window open
- Share the URL with your friends
- The link stays active as long as the command runs

---

## Option 3: Cloudflare Tunnel (Free & Reliable) ⭐ BEST FOR LONG TERM

Cloudflare Tunnel (cloudflared) is free and very reliable:

### Install:
```bash
# Download from: https://github.com/cloudflare/cloudflared/releases
# Or use winget on Windows:
winget install --id Cloudflare.cloudflared
```

### Run:
```bash
# Start tunnel (keep this terminal window open)
cloudflared tunnel --url http://localhost:3000
```

You'll get a URL like: `https://xxxx-xxxx.trycloudflare.com`

---

## Option 4: Ngrok (Popular, Requires Account)

### Install:
1. Download from: https://ngrok.com/download
2. Unzip to a folder
3. Sign up for free account at https://ngrok.com
4. Get your authtoken

### Setup:
```bash
# Authenticate (one time)
ngrok config add-authtoken YOUR_TOKEN_HERE

# Start tunnel
ngrok http 3000
```

You'll get a URL like: `https://xxxx-xxxx.ngrok-free.app`

---

## Option 5: Serveo (No Installation, SSH-based)

Simply run in a new terminal:
```bash
ssh -R 80:localhost:3000 serveo.net
```

---

## 🔧 Troubleshooting

### Port forwarding in IDE fails:
1. **Check firewall**: Windows Firewall might be blocking
   ```powershell
   # Run as Administrator
   netsh advfirewall firewall add rule name="Allow Port 3000" dir=in action=allow protocol=TCP localport=3000
   ```

2. **Verify server is running**:
   ```bash
   netstat -ano | findstr :3000
   ```

3. **Try alternative tool** (localtunnel is easiest)

### Connection refused errors:
- Make sure your dev server is running: `bun run dev`
- Check the server started successfully (should show "Ready" message)
- Verify no firewall is blocking port 3000

### URL stops working:
- **Localtunnel**: URLs expire after inactivity. Just restart the tunnel command
- **Cloudflare**: URLs are more stable but may change between sessions
- **Ngrok**: Most stable, especially with paid plan

---

## 💡 Quick Start (Recommended)

**For immediate testing**, use Localtunnel:

```bash
# In a NEW terminal window (keep dev server running in the other)
bunx localtunnel --port 3000
```

Or install globally for easier use:
```bash
bun install -g localtunnel
lt --port 3000
```

**Keep both terminals open:**
- Terminal 1: `bun run dev` (your dev server)
- Terminal 2: `lt --port 3000` (your public tunnel)

---

## 📝 Notes

- Your dev server (`bun run dev`) must stay running
- The tunnel/forwarding command must also stay running
- Share the **public URL** (not localhost:3000) with friends
- URLs from free services may change between sessions
- All traffic goes through the tunnel service (be careful with sensitive data)

---

## 🔒 Security Reminder

When sharing your local server publicly:
- ✅ Only share with trusted testers
- ✅ Don't expose production credentials
- ✅ Consider using environment variables for sensitive data
- ✅ The tunnel is temporary for testing only
