# Error Handling Documentation

This document outlines the error handling setup for the GridPulse Energy Management Platform server.

## Error Handling Middleware

The error handling middleware is defined in `src/middleware/errorMiddleware.ts` and consists of two main functions:

1. `notFound`: Handles 404 errors for routes that don't exist.
2. `errorHandler`: Provides a centralized error handling mechanism for the entire application.

### notFound Middleware

This middleware is used to catch any requests to routes that don't exist in our application.