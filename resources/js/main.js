let commands = [];

// Initialize Company Commander
Neutralino.init();

// Load commands when the app starts
Neutralino.events.on("ready", async () => {
    await loadCommands();
    createButtons();
});

// Load commands from JSON file or show instructions
async function loadCommands() {
    try {
        let configPath = '';
        let appPath = 'unknown';
        let pathInfo = '';

        // Try to get current directory info
        try {
            const currentDir = await Neutralino.os.execCommand('pwd');
            appPath = currentDir.stdOut.trim();
            pathInfo = `Current working directory: ${appPath}`;
        } catch (e) {
            pathInfo = 'Could not determine current directory';
        }

        // List of paths to try for config.json
        const pathsToTry = [
            './resources/config.json',
            'resources/config.json',
            'config.json',
            './config.json',
            `${appPath}/resources/config.json`,
            `${appPath}/config.json`
        ];

        showOutput(pathInfo, 'loading');

        let configFound = false;
        let lastError = '';

        for (const path of pathsToTry) {
            try {
                showOutput(`Trying: ${path}`, 'loading');
                const data = await Neutralino.filesystem.readFile(path);
                commands = JSON.parse(data);
                configPath = path;
                console.log(`✓ Successfully loaded config from: ${path}`);
                showOutput(`✓ Configuration loaded from: ${path}`, 'success');
                showOutput(`Found ${commands.length} commands in config`, 'success');
                configFound = true;
                break;
            } catch (error) {
                lastError = error.message;
                console.log(`✗ Failed to read ${path}:`, error.message);
            }
        }

        if (!configFound) {
            throw new Error(`Config file not found in any location. Last error: ${lastError}. Searched paths: ${pathsToTry.join(', ')}`);
        }

    } catch (error) {
        console.log('Config file not found:', error.message);

        // Get the actual paths that were searched
        let appPath = 'unknown';
        try {
            const currentDir = await Neutralino.os.execCommand('pwd');
            appPath = currentDir.stdOut.trim();
        } catch (e) {
            // Keep appPath as 'unknown'
        }

        // Recreate the same paths list that was actually used
        const searchedPaths = [
            './resources/config.json',
            'resources/config.json',
            'config.json',
            './config.json',
            `${appPath}/resources/config.json`,
            `${appPath}/config.json`
        ];

        // Show detailed instructions for creating config.json
        let instructions = `
CONFIG FILE NOT FOUND!

Company Commander requires a config.json file to define your commands.

LOCATIONS SEARCHED:`;

        // Add each searched path to the instructions
        searchedPaths.forEach(path => {
            instructions += `\n• ${path}`;
        });

        instructions += `

CURRENT WORKING DIRECTORY: ${appPath}

RECOMMENDED ACTION:
Create a config.json file in one of the above locations with the following format:

[
  {
    "title": "SSH to Production Server",
    "command": "ssh admin@prod-server.com",
    "interactive": true
  },
  {
    "title": "SSH to Staging Server", 
    "command": "ssh admin@staging-server.com",
    "interactive": true
  },
  {
    "title": "Interactive MySQL Console",
    "command": "mysql -u root -p",
    "interactive": true
  },
  {
    "title": "Deploy Production",
    "command": "./scripts/deploy-prod.sh",
    "interactive": true
  },
  {
    "title": "Check Server Status",
    "command": "systemctl status nginx",
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

FIELD DESCRIPTIONS:
• title: Display name for the button
• command: Shell command to execute
• interactive: true = opens in terminal, false = runs in background

QUICKEST FIX:
Most likely location: ${appPath}/resources/config.json

ERROR DETAILS: ${error.message}
`;

        showOutput(instructions, 'error');

        // Set empty commands array so no buttons are created
        commands = [];
    }
}

// Detect the operating system
async function getOperatingSystem() {
    try {
        const result = await Neutralino.os.execCommand('uname -s');
        const osName = result.stdOut.trim().toLowerCase();

        if (osName.includes('darwin')) return 'macos';
        if (osName.includes('linux')) return 'linux';
        return 'unknown';
    } catch (e) {
        try {
            await Neutralino.os.execCommand('where cmd');
            return 'windows';
        } catch (e2) {
            return 'unknown';
        }
    }
}

// Create the appropriate terminal command based on OS
async function createTerminalCommand(command) {
    const os = await getOperatingSystem();

    switch (os) {
        case 'linux':
            const linuxTerminals = [
                `gnome-terminal -- bash -c "${command}; echo 'Press Enter to close...'; read"`,
                `konsole -e bash -c "${command}; echo 'Press Enter to close...'; read"`,
                `xterm -e bash -c "${command}; echo 'Press Enter to close...'; read"`,
                `x-terminal-emulator -e bash -c "${command}; echo 'Press Enter to close...'; read"`
            ];

            for (const termCmd of linuxTerminals) {
                try {
                    await Neutralino.os.execCommand(`which ${termCmd.split(' ')[0]}`);
                    return termCmd;
                } catch (e) {
                    continue;
                }
            }
            return `xterm -e bash -c "${command}; echo 'Press Enter to close...'; read"`;

        case 'macos':
            return `osascript -e 'tell application "Terminal" to do script "${command}"'`;

        case 'windows':
            return `start cmd /k "${command}"`;

        default:
            return `gnome-terminal -- bash -c "${command}; echo 'Press Enter to close...'; read"`;
    }
}

// Create buttons dynamically from the commands array
function createButtons() {
    const container = document.getElementById('button-container');
    if (!container) {
        console.error('button-container not found!');
        return;
    }

    container.innerHTML = '';

    if (commands.length === 0) {
        // Show error message when no commands are loaded
        const message = document.createElement('div');
        message.className = 'warning-message';
        message.innerHTML = `
            <strong>⚠️ No Commands Available</strong><br><br>
            Config file not found or empty.<br>
            Please check the output below for detailed setup instructions.
        `;
        container.appendChild(message);
        return;
    }

    commands.forEach((cmd, index) => {
        const button = document.createElement('button');
        button.className = 'command-button';

        // Set data attribute for styling based on interactive/non-interactive
        const isInteractive = cmd.interactive !== false;
        if (!isInteractive) {
            button.setAttribute('data-non-interactive', 'true');
        }

        // Create button content
        const textSpan = document.createElement('span');
        textSpan.textContent = cmd.title;
        button.appendChild(textSpan);

        // Add icon for interactive commands
        if (isInteractive) {
            const icon = document.createElement('span');
            icon.className = 'terminal-icon';
            icon.textContent = '🖥️';
            icon.title = 'Opens in new terminal window';
            button.appendChild(icon);
        }

        button.onclick = () => executeCommand(cmd.command, cmd.title, isInteractive);
        container.appendChild(button);
    });

    console.log(`Created ${commands.length} buttons`);
}

// Execute a command
async function executeCommand(command, title, interactive = true) {
    const button = event.target.closest('.command-button');
    const originalHTML = button.innerHTML;

    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<span>Starting...</span>';

    showOutput(`Executing: ${title}`, 'loading');
    showOutput(`Command: ${command}`, 'loading');
    showOutput(`Mode: ${interactive ? 'Interactive (new terminal)' : 'Background'}`, 'loading');

    try {
        if (interactive) {
            const terminalCommand = await createTerminalCommand(command);
            await Neutralino.os.execCommand(terminalCommand, { background: true });

            showOutput(`✓ Command launched in new terminal window`, 'success');
            showOutput(`The terminal window should open separately for interaction`, 'success');

        } else {
            const result = await Neutralino.os.execCommand(command);
            showOutput(`✓ Command completed successfully:\n\n${result.stdOut}`, 'success');

            if (result.stdErr) {
                showOutput(`\nWarnings/Errors:\n${result.stdErr}`, 'error');
            }
        }
    } catch (error) {
        console.error('Command execution error:', error);
        showOutput(`✗ Command failed:\n${error.message}`, 'error');

        if (interactive) {
            showOutput(`Try running this command manually in a terminal:\n${command}`, 'error');
        }
    } finally {
        // Re-enable button
        button.disabled = false;
        button.innerHTML = originalHTML;
    }
}

// Show output in the output container
function showOutput(text, type = 'normal') {
    const outputEl = document.getElementById('output');
    if (!outputEl) {
        console.error('output element not found!');
        return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const message = `[${timestamp}] ${text}\n${'='.repeat(50)}\n`;

    outputEl.textContent = message + outputEl.textContent;
    outputEl.className = type;
}

// Handle window close
Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
});

console.log('Company Commander main.js loaded');