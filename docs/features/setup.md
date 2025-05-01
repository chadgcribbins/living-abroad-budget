# Next.js Project Setup

## Initial Setup

The project uses Next.js 14 with TypeScript and the App Router. Key decisions and configurations:

### Configuration Choices
- Using JavaScript for Next.js configuration (`next.config.js`) to avoid TypeScript complexity during setup
- App Router only (no Pages Router) for simpler routing structure
- Minimal initial TypeScript configuration to get started

### Project Structure
```
/src
  /app
    layout.tsx    # Root layout with metadata
    page.tsx      # Home page
    not-found.tsx # 404 page
```

### Key Dependencies
- Next.js 14.2.28
- React 18
- TypeScript 5
- TailwindCSS (configuration in progress)
- DaisyUI (configuration in progress)

## Troubleshooting Learnings

Several issues were encountered and resolved during setup:

1. **404 Routing Issues**
   - Ensure App Router files are in correct locations
   - Clear `.next` cache when changing routing structure
   - Use proper file naming (`page.tsx` vs `index.tsx`)

2. **Process Management**
   - Kill all Node processes before fresh starts
   - Check for port conflicts (3000-3003)
   - Use `lsof -i :3000` to check for lingering processes

3. **TypeScript Configuration**
   - Start with JavaScript config files
   - Add TypeScript gradually
   - Use `as` type assertions for simpler setup

## Next Steps
- Complete TailwindCSS and DaisyUI configuration
- Set up linting and code formatting
- Configure testing framework

## Reference
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app) 