# Beads Constructor

A web-based application for designing bead weaving patterns and jewelry. Create, save, and manage your bead designs with an intuitive visual editor and multiple weaving pattern support.

## About

Beads Constructor is a specialized tool for crafters, jewelry makers, and bead weaving enthusiasts. It allows users to create detailed bead patterns using a grid-based editor, supporting various weaving techniques like straight weaving and brick stitch patterns.

## Key Features

### 🎨 **Pattern Design**
- Interactive grid-based canvas for creating bead patterns
- Color palette management with custom color saving
- Real-time pattern preview
- Multiple canvas sizes with validation
- Zoom and viewport controls for detailed work

### 🧵 **Weaving Pattern Support**
- **Straight Weaving**: Traditional grid pattern for basic jewelry
- **Brick/Mosaic Weaving**: Offset pattern for chokers and decorative pieces
- Pattern-specific cell styling and layout
- Visual pattern selector with descriptions

### 💾 **Design Management**
- User authentication with Firebase Auth
- Save and load designs to cloud storage
- Design versioning and updates
- Personal design library
- Design duplication and templates

### 📱 **User Experience**
- Responsive design for desktop and mobile
- Intuitive sidebar-based interface
- Real-time validation and feedback
- Performance optimization for large canvases
- Keyboard shortcuts and accessibility features

### 🎯 **Product-Oriented Design**
- Preset sizes for common jewelry types:
  - Bracelets (various widths)
  - Chokers and necklaces
  - Rings
  - Earrings
- Canvas size limits and recommendations
- Aspect ratio calculations

## Technology Stack

- **Frontend**: Angular 18 with TypeScript
- **UI Framework**: Angular Material + Bootstrap
- **Authentication**: Firebase Auth with email verification
- **Database**: Cloud Firestore for design storage
- **State Management**: Angular Signals (modern reactive approach)
- **Styling**: SCSS with responsive design

## Architecture

### Core Services

- **WeavingPatternService**: Manages different weaving techniques and their visual styles
- **CanvasViewportService**: Handles zoom, pan, and canvas rendering
- **CanvasLimitsService**: Enforces size constraints and validates canvas dimensions
- **DesignService**: Manages CRUD operations for saved designs
- **AuthService**: Handles user authentication and authorization

### Key Components

- **ConstructorPageComponent**: Main design interface
- **BeadsConstructorComponent**: Interactive canvas grid
- **PaintingPanelComponent**: Color management tools
- **SavedDesignsPageComponent**: Design library browser

## Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd beads-constructor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Cloud Firestore
   - Update `src/environments/environment.ts` with your Firebase config

4. **Run development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Getting Started
1. **Sign up** for a new account or log in
2. **Choose canvas size** from presets or set custom dimensions
3. **Select weaving pattern** (Straight or Brick)
4. **Design your pattern** by clicking grid cells and selecting colors
5. **Save your design** to your personal library

### Advanced Features
- **Zoom controls**: Use toolbar buttons or mouse wheel
- **Grid toggle**: Show/hide grid lines for better visualization
- **Pattern switching**: Change weaving patterns mid-design
- **Size validation**: Real-time feedback on canvas limits
- **Design management**: Edit, duplicate, or delete saved designs

## Canvas Limits

### Free Tier
- Maximum rows: 50
- Maximum columns: 100
- Maximum total cells: 2,500

### Premium Features (Future)
- Larger canvas sizes
- Advanced pattern types
- Export capabilities
- Pattern sharing

## File Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/          # Authentication components and services
│   │   └── header/        # Navigation header
│   ├── services/
│   │   ├── weaving-pattern.service.ts
│   │   ├── canvas-viewport.service.ts
│   │   ├── canvas-limits.service.ts
│   │   └── design.service.ts
│   ├── constructor-page/  # Main design interface
│   ├── saved-designs-page/ # Design library
│   ├── profile-page/      # User profile management
│   └── models/            # TypeScript interfaces
├── environments/          # Environment configurations
└── styles.scss           # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Additional weaving patterns (Peyote, Herringbone)
- [ ] Pattern import/export functionality
- [ ] Social features and design sharing
- [ ] Advanced color tools (gradients, palettes)
- [ ] Mobile app version
- [ ] Pattern generation algorithms
- [ ] Collaboration features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For bug reports and feature requests, please open an issue on GitHub.

For general questions, contact: [grytsenko.kate.ua@example.com]

---

**Happy Beading!** Create beautiful patterns and bring your jewelry designs to life.