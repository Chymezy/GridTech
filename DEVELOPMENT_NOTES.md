# Development Notes: Authentication Setup and TypeScript Configuration

## Core Concepts

1. TypeScript Declaration Files (.d.ts):
   - Purpose: Provide type information for JavaScript code or extend existing types.
   - Usage: Declare types for libraries, extend global interfaces, or define module augmentations.

2. TypeScript Configuration (tsconfig.json):
   - Purpose: Specify the root files and compiler options required to compile a TypeScript project.
   - Key options: 
     - `typeRoots`: Specify locations to look for type definition files.
     - `types`: List of type declaration files to include.
     - `include`: Specify which files should be included in compilation.

3. Type Augmentation in TypeScript:
   - Purpose: Extend existing types without modifying their original declaration.
   - Usage: Add properties or methods to interfaces from third-party libraries.

4. Express Middleware and Request Object:
   - Middleware: Functions that have access to the request and response objects, and the next middleware function in the application's request-response cycle.
   - Extending Request: Adding custom properties to the Express Request object for use in route handlers.

5. Module Augmentation vs. Global Augmentation:
   - Module Augmentation: Extend types within a specific module.
   - Global Augmentation: Extend types in the global scope, affecting the entire project.

## Issues Encountered

1. TypeScript couldn't recognize the `user` property on the `Request` object, which we added in our authentication middleware.

2. Importing type definition files directly caused module not found errors.

## Solutions Implemented

1. Created a custom type definition file (`src/types/express/index.d.ts`) to extend the Express `Request` interface using declaration merging.

2. Updated `tsconfig.json` to include custom type definitions using the `typeRoots` option.

3. Explicitly imported and used the extended `Request` type in `server.ts` and `auth.ts`.

4. Removed direct imports of type definition files and relied on TypeScript's automatic type inference.

## Key Changes

1. In `src/types/express/index.d.ts`:
   - Used declaration merging to extend the Express `Request` interface globally.

2. In `tsconfig.json`:
   - Added `"typeRoots": ["./node_modules/@types", "./src/types"]` to include custom type definitions.
   - Added `"include": ["src/**/*"]` to ensure all source files are included in compilation.

3. In `src/server.ts` and `src/middleware/auth.ts`:
   - Used `AuthenticatedRequest` interface to type requests with the `user` property.

4. In `src/utils/firebaseAdmin.ts`:
   - Properly typed the `serviceAccount` object as `admin.ServiceAccount`.

## Lessons Learned

1. Declaration Merging: TypeScript's declaration merging allows us to extend existing types without modifying their original source. This is crucial for adding properties to the Express Request object.

2. TypeScript Configuration: The `typeRoots` and `types` options in `tsconfig.json` are essential for TypeScript to find and use custom type definitions. Understanding these options helps in properly structuring a TypeScript project.

3. Explicit Type Imports: In some cases, explicitly importing and using types is necessary, especially when dealing with extended interfaces or complex type relationships.

4. Middleware and Type Safety: When creating custom middleware that adds properties to the request object, we need to ensure that TypeScript is aware of these additions through proper type declarations. This maintains type safety throughout the application.

5. Troubleshooting Process: Systematically checking type definitions, configurations, and import statements is crucial when dealing with TypeScript errors. Understanding the TypeScript compilation process helps in identifying and resolving issues.

6. Environment Consistency: Ensuring all team members use the same TypeScript and Node.js versions helps prevent inconsistent behavior across different development environments.

## Best Practices Moving Forward

1. Always create proper type definitions when extending existing types or interfaces.

2. Keep `tsconfig.json` up to date with any new type definition files or directories.

3. Use explicit typing in functions and methods, especially when dealing with extended interfaces.

4. Regularly review and update dependencies to ensure compatibility and leverage the latest TypeScript features.

5. Document any non-standard type extensions or configurations to help team members understand the project structure.

6. Use declaration merging judiciously, and prefer module augmentation over global augmentation when possible to avoid polluting the global namespace.

7. Understand the difference between `@types` packages and custom type definitions, and when to use each.

8. Regularly run TypeScript in strict mode (`"strict": true` in tsconfig.json) to catch potential type issues early in development.

## Recent Updates

1. User Model:
   - Created a User model in `src/models/User.ts` to store user information in MongoDB.

2. User Controller:
   - Implemented `createUser` and `getUserProfile` functions in `src/controllers/userController.ts`.

3. User Routes:
   - Set up routes for user creation and profile retrieval in `src/routes/userRoutes.ts`.

4. Server Integration:
   - Updated `src/server.ts` to use the new user routes.

## Next Steps

1. Implement error handling middleware to standardize error responses.
2. Add input validation for user creation and profile update.
3. Implement additional user management features (e.g., update profile, delete account).
4. Set up unit and integration tests for the new user management features.
5. Implement logging system for better debugging and monitoring.