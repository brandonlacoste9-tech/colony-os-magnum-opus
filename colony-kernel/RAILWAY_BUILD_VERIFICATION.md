# Railway Build Log Diagnostic Guide

**Purpose**: Diagnose Railway deployment failures for ColonyOS Kernel (Python/FastAPI backend)

## ⚠️ Service Identification (CRITICAL)

**For backend (FastAPI / Python) issues, always check the Kernel service, not the Next.js frontend.**

- **Backend Service**: ColonyOS Kernel - Service ID: `bda28ced-eeef-4b01-b226-7de4b4b1cb21`
- **Frontend Service**: Magnum Opus (Next.js) - Different service, separate logs

**Why this matters**: Mixing backend and frontend logs will lead you to chase 404s or build failures in the wrong place when debugging.

---

## How to Access Build Logs

### Method 1: Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app)
2. Open the **Kernel service** (ID: `bda28ced-eeef-4b01-b226-7de4b4b1cb21`)
3. Click **Deployments** tab
4. Find the failed deployment (check timestamp)
5. Click the deployment → **View Logs**
6. Check **both tabs**: **Build Logs** and **Deploy Logs**

### Method 2: Railway CLI

```powershell
# Set your token (DO NOT hardcode in guides)
$env:RAILWAY_TOKEN="<your-railway-token>"

# Link to the service
railway link --service bda28ced-eeef-4b01-b226-7de4b4b1cb21

# View logs for specific deployment
railway logs --deployment <deployment-id>

# Or view latest logs
railway logs
```

**Security Note**: Never hardcode real tokens in documentation. Use `<your-railway-token>` placeholder.

---

## What to Look For in Build Logs

### 1. First Lines (Build Detection)

**What to check:**
- Does it show `Detected Python project` or `Detected Node.js project`?
- Does it find `requirements.txt` or `package.json`?

**Key Indicator:**
> If it only mentions Node.js / package.json for this backend service, that's a strong hint the root directory or repo wiring is wrong.

**Expected (Correct):**
```
using build driver railpack-v0.15.4
Detected Python project
Found requirements.txt
Found runtime.txt
```

**Problem (Wrong):**
```
Detected Node.js project
Found package.json
```

### 2. Build Phase

**What to check:**
- Does it run `pip install -r requirements.txt` or `npm install`?
- Any errors during dependency installation?

**Expected:**
```
[build] pip install -r requirements.txt
Collecting fastapi>=0.115.0
Collecting uvicorn[standard]>=0.32.0
...
Successfully installed fastapi-0.115.x uvicorn-0.32.x ...
```

### 3. Deploy Phase

**What to check:**
- Does it run `python -m colonyos.main`?
- Any Python import errors?
- **Search for `Uvicorn running` or similar to confirm the server actually started**

**Expected:**
```
[deploy] Starting service with command: python -m colonyos.main
Starting ColonyOS Kernel (env: production)
Starting API server on 0.0.0.0:xxxx
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:xxxx
```

**Problem Indicators:**
```
ModuleNotFoundError: No module named 'colonyos'
Error: Could not find requirements.txt
```

### 4. Error Messages

**What to capture:**
- Copy the **exact error text** (including stack traces)
- Note which **phase** failed: Build or Deploy
- Note any **file paths** mentioned in errors

---

## Common Failure Patterns

### Pattern 1: Wrong Root Directory

**Symptoms:**
```
Error: Could not find requirements.txt
or
Detected Node.js project
Found package.json
```

**Diagnosis:**
- Root Directory not set to `colony-kernel`
- Railway is looking in repository root instead of subdirectory

**Fix:**
1. Railway Dashboard → Service Settings
2. Set **Root Directory** to: `colony-kernel`
3. Save and redeploy

### Pattern 2: Python Not Detected

**Symptoms:**
```
Error: No build method found
or
No buildpack detected
```

**Diagnosis:**
- Missing `requirements.txt` or `runtime.txt` at root
- Files not in expected location

**Fix:**
1. Verify `requirements.txt` exists in `colony-kernel/`
2. Verify `runtime.txt` exists (contains `python-3.11.9`)
3. Verify root directory is `colony-kernel` (not `/colony-kernel`)

### Pattern 3: Module Not Found

**Symptoms:**
```
ModuleNotFoundError: No module named 'colonyos'
or
ImportError: cannot import name 'ColonyKernel' from 'colonyos'
```

**Diagnosis:**
- Python path issues
- Root directory mismatch
- Missing `__init__.py` files

**Fix:**
1. Verify `colony-kernel/colonyos/` directory structure
2. Check `colony-kernel/colonyos/__init__.py` exists
3. Verify `colony-kernel/colonyos/main.py` exists
4. Ensure root directory is `colony-kernel` so Python can find modules

### Pattern 4: Port Binding / Health Check Timeout

**Symptoms:**
```
Address already in use
or
Health check timeout
or
Deploy phase shows "Crashed" but build succeeded
```

**Diagnosis:**
- Port not reading Railway's `PORT` env var
- Host binding to `127.0.0.1` instead of `0.0.0.0`
- Application took too long to start

**Fix:**

The FastAPI app **must**:

1. **Read PORT from environment** (Railway injects this):
```python
port = int(os.getenv("PORT") or os.getenv("COLONY_PORT", "8000"))
```

2. **Bind to 0.0.0.0** (not 127.0.0.1):
```python
host = os.getenv("COLONY_HOST", "0.0.0.0")  # Must be 0.0.0.0 for Railway

config_uvicorn = uvicorn.Config(
    app,
    host=host,  # 0.0.0.0 allows Railway proxy to reach the app
    port=port,  # Railway's dynamically assigned port
    log_level=config.log_level.lower(),
)
```

3. **Verify in logs**:
   - Should show: `Uvicorn running on http://0.0.0.0:xxxx`
   - Where `xxxx` matches Railway's assigned port (not hardcoded 8000)

4. **If health check times out**:
   - Increase "Health Check Timeout" in Railway Settings (default 300s)
   - Ensure `/health` endpoint responds quickly

---

## Quick Verification Checklist

Before checking logs, verify these in Railway Dashboard:

- [ ] **Service → Settings → Root Directory** = `colony-kernel` (not `/`, not empty)
- [ ] **Service → Variables** → All required env vars present:
  - `COLONY_ENV=production`
  - `COLONY_PORT` (optional, Railway uses `PORT` automatically)
  - `COLONY_HOST=0.0.0.0` (optional, default in code)
  - Other vars from `.railway/env.template`

---

## Share the Logs for Analysis

To diagnose your specific failure, please share:

1. **First 20-30 lines** (build detection phase)
2. **Any error messages** (exact text, including stack traces)
3. **Last 20-30 lines** (deployment attempt)
4. **Which phase failed**: Build or Deploy?

With this information, I can pinpoint the exact issue and provide a targeted fix.

---

## Success Indicators

When build is correct, you should see:

1. ✅ Python dependencies installing (`pip install`)
2. ✅ FastAPI/Uvicorn packages installed
3. ✅ Application starting (`python -m colonyos.main`)
4. ✅ Server bound to `0.0.0.0:xxxx` (Railway's assigned port)
5. ✅ Health check passing at `/health`
6. ✅ `Uvicorn running on http://0.0.0.0:xxxx` in logs

---

**The build logs are your first pulse check. Read them carefully!** 🐝✨
