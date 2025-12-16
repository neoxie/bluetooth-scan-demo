# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bluetooth Scanner application built with React 19 and TypeScript that uses the Web Bluetooth API to scan, connect, and manage Bluetooth Low Energy (BLE) devices from the browser. The app provides a clean, modern UI for device discovery and management.

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server on port 3000 (host: 0.0.0.0)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN)
- **API**: Web Bluetooth API (native browser API)

### Project Structure
```
/
├── index.html           # Main HTML entry point with Tailwind CDN
├── index.tsx           # React DOM rendering
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions for Web Bluetooth API
├── services/
│   └── bluetoothService.ts  # Core Bluetooth operations (scan, connect, disconnect)
├── components/         # Reusable UI components
│   ├── BluetoothIcon.tsx
│   ├── Button.tsx
│   ├── DeviceInfo.tsx
│   └── StatusBadge.tsx
├── vite.config.ts      # Vite configuration with React plugin
└── tsconfig.json       # TypeScript configuration
```

### Core Components

#### Bluetooth Service (`services/bluetoothService.ts`)
Encapsulates all Web Bluetooth API interactions:
- `isBluetoothSupported()` - Checks browser compatibility
- `requestBluetoothDevice()` - Opens device picker and returns selected device
- `connectToDevice()` - Establishes GATT connection
- `disconnectDevice()` - Terminates connection

#### App Component (`App.tsx`)
Main application logic with state management for:
- Device list and connection statuses
- Loading states for async operations
- Error handling and user feedback
- Responsive grid layout for device cards

### Key Implementation Details

#### Web Bluetooth API Usage
- Uses `navigator.bluetooth.requestDevice()` with `acceptAllDevices: true`
- Requests optional services (`battery_service`, `device_information`) for broader compatibility
- Handles GATT server connections and disconnection events
- Implements proper error handling for user cancellation and browser restrictions

#### State Management Pattern
- Device list stored as array of `BluetoothDevice` objects
- Connection status tracked separately by device ID in a Record
- Loading states managed per device for concurrent operations
- Error state with dismissible notifications

#### UI Architecture
- Component-based architecture with reusable UI elements
- Tailwind CSS for responsive design and dark theme
- Custom animations and transitions for user feedback
- Sticky navigation and error notifications

## Browser Compatibility

The Web Bluetooth API has limited browser support:
- **Supported**: Chrome, Edge, Opera
- **iOS**: Bluefy browser
- **Not Supported**: Firefox, Safari (desktop)

The app includes compatibility checking and displays an appropriate message for unsupported browsers.

## Security Considerations

- The Web Bluetooth API requires HTTPS in production
- User must explicitly select devices through browser picker
- Some device types may be blocked by browsers for security reasons
- GATT services must be specified in `optionalServices` array

## Development Notes

### Path Aliases
- `@/*` resolves to the project root directory
- Used for clean imports: `import { BluetoothDevice } from '@/types'`

### Environment Variables
- Environment variables are injected via `define` in Vite config

### TypeScript Configuration
- Target: ES2022 with DOM libraries
- Module resolution: bundler mode
- JSX: react-jsx transform
- Strict type checking enabled