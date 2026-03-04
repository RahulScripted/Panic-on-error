# Panic on Error 🔊

A VS Code extension that plays a funny "FAH" meme sound whenever there's an error in your code!

## Features

- 🎵 Plays a meme sound when errors are detected
- 🎚️ Toggle sound on/off with a command
- 🔧 Configurable through VS Code settings
- 🌍 Cross-platform support (Windows, macOS, Linux)

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Add a sound file:
   - Place your `fah.mp3` file in the `sounds/` folder
   - Or run: `bash download-sound.sh` to download a sample sound

3. Compile the extension:
```bash
npm run compile
```

4. Test the extension:
   - Press `F5` in VS Code to open Extension Development Host
   - Open any file from the `playground/` folder
   - Uncomment error lines to trigger the sound!

## Usage

### Testing the Extension

1. Open the playground folder files:
   - `playground/test.js` - JavaScript errors
   - `playground/test.ts` - TypeScript errors
   - `playground/test.py` - Python errors

2. Uncomment any error example to hear the sound

3. Toggle the extension:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Panic on Error: Toggle Sound"

### Configuration

Open VS Code settings and search for "Panic on Error":
- `panicOnError.enabled` - Enable/disable the extension

## Development

- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch for changes
- Press `F5` - Launch extension in debug mode

## How It Works

The extension listens to VS Code's diagnostic events and plays a sound when:
- Syntax errors are detected
- Type errors occur
- Any error-level diagnostic is reported

## Requirements

For sound playback, you need one of these installed:
- **Linux**: `paplay`, `ffplay`, or `mpg123`
- **macOS**: `afplay` (built-in)
- **Windows**: PowerShell (built-in)
