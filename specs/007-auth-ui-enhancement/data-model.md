# Data Model: Auth UI Enhancement

## Entity: Authentication State
**Description**: Represents the current authentication status of the user, including token, user profile, and permissions

### Fields:
- **isAuthenticated**: boolean - Whether the user is currently authenticated
- **user**: User object (optional) - Contains user profile information when authenticated
  - id: string - Unique identifier for the user
  - email: string - User's email address
  - name: string - User's display name
  - role: string - User's role in the system
- **token**: string (optional) - JWT token for authenticated requests
- **isLoading**: boolean - Whether authentication state is being determined
- **error**: string (optional) - Any error message related to authentication

### Relationships:
- Related to User entity for profile information
- Connected to Session entity for managing login sessions

### Validation Rules:
- token must be a valid JWT format when present
- email must be a valid email format when present
- user.id must be present when isAuthenticated is true

### State Transitions:
- Unauthenticated → Authenticating → Authenticated/Failed
- Authenticated → LoggingOut → Unauthenticated

## Entity: User
**Description**: Represents a registered user of the application

### Fields:
- **id**: string - Unique identifier for the user
- **email**: string - User's email address (unique)
- **name**: string - User's display name
- **role**: string - User's role (e.g., "user", "admin")
- **createdAt**: Date - Timestamp of account creation
- **updatedAt**: Date - Timestamp of last update
- **isActive**: boolean - Whether the account is active

### Relationships:
- Has many Sessions
- Associated with many Preferences

### Validation Rules:
- email must be unique and valid format
- name must be between 2 and 50 characters
- role must be one of allowed values

## Entity: Navigation Configuration
**Description**: Defines the structure and content of navigation elements, including visible links and user profile options

### Fields:
- **menuItems**: Array of MenuItem objects - Navigation items to display
- **userDropdownOptions**: Array of DropdownOption objects - Options in user profile dropdown
- **activePage**: string - Current page identifier for highlighting
- **isLoggedIn**: boolean - Whether user is authenticated (affects menu items)

### Relationships:
- Depends on Authentication State entity
- Connected to User entity for personalized options

### Validation Rules:
- menuItems must have valid URLs
- activePage must match one of the menuItems URLs

## Entity: MenuItem
**Description**: Individual item in the navigation menu

### Fields:
- **id**: string - Unique identifier for the menu item
- **label**: string - Display text for the menu item
- **url**: string - Target URL for the navigation
- **icon**: string (optional) - Icon identifier for the menu item
- **isVisible**: boolean - Whether the item should be displayed
- **requiresAuth**: boolean - Whether user must be authenticated to see this item

### Relationships:
- Belongs to Navigation Configuration entity
- Connected to Page entity (conceptual)

### Validation Rules:
- label must not be empty
- url must be a valid relative or absolute URL
- requiresAuth must be consistent with target page permissions

## Entity: UI Theme
**Description**: Represents the visual styling properties including glassmorphism effects, color schemes, and animation parameters

### Fields:
- **colors**: Object - Color scheme definitions
  - primary: string - Primary brand color
  - secondary: string - Secondary brand color
  - background: string - Background color
  - text: string - Text color
- **glassEffects**: Object - Glassmorphism effect parameters
  - blurIntensity: number - Level of backdrop blur (in pixels)
  - transparency: number - Opacity level (0-100)
  - borderWidth: number - Border width for glass effect
- **animationParams**: Object - Animation timing and easing
  - duration: number - Default animation duration in milliseconds
  - easing: string - Easing function for animations
  - staggerDelay: number - Delay between staggered animations

### Relationships:
- Applied to all UI components
- Influences Navbar, Hero Section, and other UI elements

### Validation Rules:
- Color values must be valid CSS color formats
- Blur intensity must be between 0 and 20 pixels
- Transparency must be between 0 and 100
- Duration must be positive number

## Entity: Session
**Description**: Represents a user's login session with token and expiration information

### Fields:
- **id**: string - Unique session identifier
- **userId**: string - Reference to the user
- **token**: string - JWT token for the session
- **refreshToken**: string - Refresh token for extending session
- **expiresAt**: Date - Expiration timestamp
- **createdAt**: Date - Session creation timestamp
- **lastActivity**: Date - Last activity timestamp

### Relationships:
- Belongs to User entity
- Connected to Authentication State entity

### Validation Rules:
- token must be valid JWT
- expiresAt must be in the future
- userId must reference an existing user