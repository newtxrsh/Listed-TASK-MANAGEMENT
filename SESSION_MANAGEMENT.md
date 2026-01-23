# Secure Session Management System

This document describes the secure, stateful session management system implemented for the application.

## Overview

The application uses Laravel's built-in session-based authentication with secure cookie configuration. Sessions are only created after successful user authentication and include security measures to prevent common attacks.

## Security Features

### Session Cookie Configuration

Sessions are configured with the following security headers:

- **HttpOnly**: `true` - Prevents JavaScript access to cookies, protecting against XSS attacks
- **Secure**: `true` (in production) - Ensures cookies are only sent over HTTPS
- **SameSite**: `Lax` - Provides balance between usability and CSRF protection
- **Max-Age**: 24 hours (1440 minutes) - Session duration

Configuration file: `config/session.php`

### Session Generation

- Sessions are **only** created after successful authentication
- No sessions are created for anonymous visitors
- Session ID is regenerated on login to prevent Session Fixation attacks

### Session Lifecycle

#### Login Flow

1. User provides credentials (email/password)
2. Credentials are validated
3. **Session regeneration** occurs BEFORE authentication (prevents Session Fixation)
4. User is authenticated via `Auth::login($user)`
5. Session cookie is automatically set by Laravel with secure headers

#### Logout Flow

1. User calls logout endpoint
2. Session is invalidated via `Auth::logout()`
3. Session data is cleared via `$request->session()->invalidate()`
4. CSRF token is regenerated
5. Session cookie is cleared by setting expiration to past date
6. User is redirected to login page

## Implementation Details

### Backend Changes

#### AuthController (`app/Http/Controllers/AuthController.php`)

**Login Method:**
```php
public function login(Request $request)
{
    // Validate credentials
    // ...
    
    // Regenerate session ID BEFORE authentication (prevents Session Fixation)
    $request->session()->regenerate();
    
    // Authenticate user
    Auth::login($user);
    
    // Store user_id in session
    $request->session()->put('user_id', $user->user_id);
    
    return response()->json(['message' => 'Login successful', 'user' => $user]);
}
```

**Logout Method:**
```php
public function logout(Request $request)
{
    // Destroy session
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    // Clear cookie
    $cookie = cookie($cookieName, '', -1, ...);
    
    return response()->json(['message' => 'Logged out successfully'])
        ->withCookie($cookie);
}
```

#### Task Permission Middleware (`app/Http/Middleware/CheckTaskPermission.php`)

A middleware that checks if the authenticated user has permission to access a specific task:

```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();
    $taskId = $request->route('taskId') ?? $request->input('task_id');
    
    // Check if user is a collaborator on this task
    $hasPermission = TaskCollaborator::where('task_id', $taskId)
        ->where('user_id', $user->user_id)
        ->exists();
    
    if (! $hasPermission) {
        return response()->json(['message' => 'Access denied'], 403);
    }
    
    return $next($request);
}
```

**Usage in Routes:**
```php
Route::put('/tasks/{taskId}', [TasksController::class, 'update'])
    ->middleware(['auth:web', 'task.permission']);
```

### Frontend Changes

#### API Composable (`frontend/composables/useApi.ts`)

All API requests now include credentials to send session cookies:

```typescript
const apiFetch = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T | null> => {
  const response = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
    method: options.method || 'GET',
    credentials: 'include', // Include cookies for session-based auth
    // ...
  })
}
```

#### Auth Store (`frontend/stores/auth.ts`)

- Removed token storage from localStorage
- Removed Authorization headers
- Session is managed via cookies automatically
- Session expiration is tracked via `lastActivity` timestamp

### Route Updates

All protected routes now use `auth:web` middleware instead of `auth:sanctum`:

```php
Route::middleware('auth:web')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // ...
});
```

## Error Handling

### Invalid/Expired Sessions

When a session is invalid or expired, the system returns a **401 Unauthorized** status code:

**Backend Exception Handler** (`bootstrap/app.php`):
```php
$exceptions->render(function (AuthenticationException $e, $request) {
    if ($request->is('api/*')) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
});
```

**Frontend Handling** (`frontend/composables/useApi.ts`):
```typescript
onResponseError({ response }) {
  if (response.status === 401) {
    authStore.clearAuth()
    navigateTo('/auth/login')
  }
}
```

## CORS Configuration

The CORS configuration (`config/cors.php`) is set to allow credentials:

```php
'supports_credentials' => true,
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
],
```

This ensures session cookies are sent with cross-origin requests from the frontend.

## Security Best Practices Implemented

1. ✅ **Session Fixation Prevention**: Session ID regenerated on login
2. ✅ **XSS Protection**: HttpOnly cookies prevent JavaScript access
3. ✅ **CSRF Protection**: SameSite=Lax provides CSRF protection
4. ✅ **HTTPS Enforcement**: Secure flag ensures cookies only sent over HTTPS (in production)
5. ✅ **Session Expiration**: 24-hour session lifetime
6. ✅ **Proper Logout**: Session destroyed and cookie cleared on logout
7. ✅ **Task-Level Security**: Middleware checks user permissions for specific tasks
8. ✅ **401 Error Handling**: Invalid/expired sessions return proper error codes

## Testing the Implementation

### Test Session Creation
1. Login with valid credentials
2. Check browser DevTools → Application → Cookies
3. Verify session cookie is set with HttpOnly, Secure, SameSite attributes

### Test Session Regeneration
1. Note the session ID before login
2. Login successfully
3. Verify session ID has changed (prevents Session Fixation)

### Test Logout
1. Login successfully
2. Call logout endpoint
3. Verify session cookie is cleared
4. Verify subsequent API calls return 401

### Test Task Permission Middleware
1. Login as User A
2. Try to access Task owned by User B
3. Verify 403 Forbidden response

### Test Session Expiration
1. Login successfully
2. Wait for session to expire (or manually expire in database)
3. Make API request
4. Verify 401 Unauthorized response

## Migration Notes

### Breaking Changes

1. **Token-based auth removed**: Frontend no longer uses Bearer tokens
2. **localStorage changes**: `auth_token` is no longer stored
3. **API requests**: Must include `credentials: 'include'` for cookies

### Backward Compatibility

- Old token-based authentication has been completely replaced
- Users will need to login again after deployment
- Existing tokens in localStorage will be ignored

## Environment Variables

Ensure these are set in your `.env`:

```env
SESSION_DRIVER=database
SESSION_LIFETIME=1440
SESSION_SECURE_COOKIE=true  # Set to false for local development
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

## Database

Sessions are stored in the `sessions` table (created by Laravel's default migration). The table structure:

- `id` - Session ID (primary key)
- `user_id` - Associated user ID (nullable)
- `ip_address` - Client IP address
- `user_agent` - Client user agent
- `payload` - Encrypted session data
- `last_activity` - Timestamp of last activity
