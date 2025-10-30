# Company Commander 🖥️

A lightweight, cross-platform desktop application for executing system administration commands and SSH connections with
a single click. Built with Neutralino.js for minimal resource usage and maximum efficiency.

## ✨ Features

- **🎯 One-Click Command Execution**: Execute complex bash scripts, SSH connections, and system commands instantly
- **🖥️ Interactive Terminal Support**: Commands open in separate terminal windows for full interaction
- **📊 Background Task Execution**: Run status checks and monitoring commands in the background
- **🌙 Modern Dark Theme**: Professional dark interface with muted colors and smooth animations
- **⚡ Lightweight**: Built with Neutralino.js - no Electron bloat
- **🔧 Highly Configurable**: Simple JSON configuration file for easy customization
- **🖱️ Visual Command Types**: Different colors for interactive vs background commands
- **📱 Responsive Design**: Works on different screen sizes
- **🔄 Cross-Platform**: Runs on Linux, macOS, and Windows

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Install Neutralino CLI globally:**
   ```bash
   npm install -g @neutralinojs/neu
   ```

2. **Clone or download this repository:**
   ```bash
   git clone https://github.com/yourusername/company-commander.git
   cd company-commander
   ```

3. **Create your configuration file:**
   ```bash
   cp resources/config.json.example resources/config.json
   # Edit the config.json file with your commands (see Configuration section)
   ```

4. **Run the application:**
   ```bash
   neu run
   ```

### Building for Production

1. **Build the application:**
   ```bash
   neu build
   ```

2. **Find your executable in the `dist` folder:**
    - **Linux**: `dist/company-commander/company-commander`
    - **Windows**: `dist/company-commander/company-commander.exe`
    - **macOS**: `dist/company-commander/company-commander`

3. **Copy the config file to the build directory:**
   ```bash
   cp resources/config.json dist/company-commander/resources/
   ```

## ⚙️ Configuration

Company Commander uses a simple JSON file (`resources/config.json`) to define your commands. Each command has three
properties:

### Command Structure

```json
{
  "title": "Display name for the button",
  "command": "bash command to execute",
  "interactive": true
}
```

### Command Types

- **Interactive Commands** (`"interactive": true`):
    - Open in a new terminal window
    - Allow full user interaction
    - Perfect for SSH connections, text editors, interactive shells
    - Shown with blue buttons and 🖥️ icon

- **Background Commands** (`"interactive": false`):
    - Execute in the background
    - Display results in the application
    - Ideal for status checks, monitoring, quick information gathering
    - Shown with green buttons

### Example Configuration

```json
[
  {
    "title": "SSH to Production Server",
    "command": "ssh admin@prod-server.company.com",
    "interactive": true
  },
  {
    "title": "Deploy to Production",
    "command": "./scripts/deploy-production.sh",
    "interactive": true
  },
  {
    "title": "Interactive MySQL Console",
    "command": "mysql -u root -p company_db",
    "interactive": true
  },
  {
    "title": "Check Server Status",
    "command": "systemctl status nginx && systemctl status mysql",
    "interactive": false
  },
  {
    "title": "View Disk Usage",
    "command": "df -h",
    "interactive": false
  },
  {
    "title": "Memory Usage",
    "command": "free -h",
    "interactive": false
  }
]
```

## 🎨 User Interface

### Command Buttons

- **Blue Buttons with 🖥️**: Interactive commands that open in terminal
- **Green Buttons**: Background commands that show results in-app
- **Responsive Grid**: Automatically adjusts to screen size
- **Hover Effects**: Visual feedback on mouse over
- **Loading States**: Shows "Starting..." while commands launch

### Output Panel

- **Real-time Feedback**: See command execution status
- **Color-coded Messages**:
    - 🔵 Blue: Loading/Info messages
    - 🟢 Green: Success messages
    - 🔴 Red: Error messages
- **Scrollable History**: Keep track of all executed commands
- **Timestamps**: Each message includes execution time

## 🔧 Advanced Usage

### Custom Scripts Integration

You can integrate your existing bash scripts by adding them to the config:

```json
{
  "title": "Backup Database",
  "command": "./scripts/backup-db.sh production",
  "interactive": true
}
```

### SSH Key Management

For password-less SSH connections, set up your SSH keys:

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your_email@company.com"
# Copy public key to server
ssh-copy-id admin@your-server.com
```

Then add to config:

```json
{
  "title": "SSH to Server",
  "command": "ssh admin@your-server.com",
  "interactive": true
}
```

### Environment-Specific Configurations

Create different config files for different environments:

```bash
# Development
cp resources/config.json resources/config-dev.json
# Production
cp resources/config.json resources/config-prod.json
# Switch between them
cp resources/config-prod.json resources/config.json
```

## 🐛 Troubleshooting

### Config File Not Found

If you see "CONFIG FILE NOT FOUND", the application couldn't locate your `config.json` file.

**Solution**: Create `resources/config.json` with your commands. The app will show you exactly where it's looking for
the file.

### Commands Not Executing

1. **Check Permissions**: Make sure your scripts are executable:
   ```bash
   chmod +x ./scripts/your-script.sh
   ```

2. **Verify Paths**: Use absolute paths for scripts and commands when possible

3. **Test Manually**: Try running the command in a terminal first

### Terminal Not Opening (Linux)

If interactive commands don't open terminals, install a terminal emulator:

```bash
# Ubuntu/Debian
sudo apt install gnome-terminal
# Fedora/RHEL
sudo dnf install gnome-terminal
# Arch Linux
sudo pacman -S gnome-terminal
```

## 🔒 Security Considerations

- **Review Commands**: Always verify commands before adding them to your config
- **File Permissions**: Keep your config file secure and restrict access if needed
- **SSH Keys**: Use SSH keys instead of passwords for server connections
- **Script Validation**: Test scripts in a safe environment before adding to production config

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Neutralino.js](https://neutralino.js.org/) - Lightweight cross-platform desktop app framework
- Icons and design inspiration from modern terminal applications
- Thanks to the open-source community for tools and libraries

---

**Made with ❤️ for system administrators and developers who value efficiency**