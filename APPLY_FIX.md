# How to Apply the pnpm Lockfile Fix

## Problem
The `copilot/import-figma-token-support` branch fails to deploy on Vercel due to an outdated pnpm-lock.yaml file.

## Solution
Apply the fix using one of the methods below:

### Method 1: Apply the Patch File (Recommended)
```bash
# Switch to the problematic branch
git checkout copilot/import-figma-token-support

# Apply the patch
git am < fix-pnpm-lockfile.patch

# Push the fix
git push origin copilot/import-figma-token-support
```

### Method 2: Cherry-pick the Fix Commit
```bash
# Switch to the problematic branch
git checkout copilot/import-figma-token-support

# Cherry-pick the fix commit
git cherry-pick e928520

# Push the fix
git push origin copilot/import-figma-token-support
```

### Method 3: Manual Fix
If the above methods don't work, manually apply the fix:

```bash
# Switch to the problematic branch
git checkout copilot/import-figma-token-support

# Edit package.json to remove the line:
#   "@types/jszip": "^3.4.0",
# (It's in the devDependencies section)

# Update the lockfile
pnpm install --no-frozen-lockfile

# Commit the changes
git add package.json pnpm-lock.yaml
git commit -m "Fix pnpm lockfile: add jszip and remove unnecessary @types/jszip"

# Push the fix
git push origin copilot/import-figma-token-support
```

## Verification
After applying the fix, verify it works:

```bash
# Clean install with frozen lockfile (simulates Vercel)
rm -rf node_modules
pnpm install --frozen-lockfile

# Build the project
pnpm run build
```

Both commands should complete successfully without errors.

## What the Fix Does
1. **Updates pnpm-lock.yaml**: Adds jszip@3.10.1 and all its transitive dependencies to the lockfile
2. **Removes @types/jszip**: This package is unnecessary because jszip@3.10.1 includes its own TypeScript type definitions

## Files Included
- `fix-pnpm-lockfile.patch`: Git patch file containing the exact changes
- `FIX_SUMMARY.md`: Detailed explanation of the problem and solution
- `APPLY_FIX.md`: This file with step-by-step application instructions
