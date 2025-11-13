# PR Labeling Guide

Add one of these labels to your PR before merging:

- **`feature`** or **`enhancement`** → Minor version bump (0.x.0)
- **`bug`** or **`fix`** → Patch version bump (0.0.x)
- **`breaking`** or **`major`** → Major version bump (x.0.0)

Example:
- PR with `feature` label: 0.13.0 → 0.14.0
- PR with `bug` label: 0.13.0 → 0.13.1
- PR with `breaking` label: 0.13.0 → 1.0.0

No label = defaults to patch bump
