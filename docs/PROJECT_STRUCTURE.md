## Project Structure

```
Animal Bite Center (CIS) /
├── src/
│   ├── components/     # Resable component
│   ├── pages/          # App pages
│   ├── assets/         # Static assets
│   ├── utils/          # Helper functions
│   ├── services/       # API services
│   ├── libs/           # Third-party libraries
│   ├── constants/      # Static data
│   ├── context/        # React context providers
│   ├── hooks/          # Custom hooks
│   ├── App.jsx         # Root component
│   ├── index.css       # Base stylesheets
│   └── main.jsx        # Entry point
├── public/             # Public assets
└── ... config files
```

## Directory Details

### `/src` Directory

- **components/**: Reusable UI components organized by feature
- **pages/**: Page components separated by user type (Patient/Staff)
- **assets/**: Processed assets that require bundler handling
- **utils/**: Utility functions and helpers
- **services/**: API integration and business logic
- **libs/**: Third-party libraries configurations
- **constants/**: Static data or variables.
- **context/**: React context providers for state management
- **hooks/**: Reusable hooks

### `/public` Directory

- **assets/images/**: Static images that don't require processing
- **assets/meta/**: SEO-related files (favicons, manifest, etc.)

### Configuration Files

- **.env**: Environment-specific configuration
- **vite.config.js**: Build and development setup
- **eslint.config.js**: Code style and quality rules
