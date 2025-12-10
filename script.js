// Inisialisasi Terminal
const term = new Terminal({
    cursorBlink: true,
    macOptionIsMeta: true,
    scrollback: 1000,
    fontSize: 14,
    fontFamily: '"Courier New", "Courier", monospace',
    theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff'
    }
});

// Fit Addon supaya terminal full screen
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();

// Resize listener
window.addEventListener('resize', () => fitAddon.fit());

// Welcome Message ala Termux
term.writeln('\x1b[1;32mWelcome to Termux Web!\x1b[0m');
term.writeln('');
term.writeln('Wiki:      https://wiki.termux.com');
term.writeln('Community: https://termux.com/community');
term.writeln('IRC:       #termux on freenode');
term.writeln('');
term.writeln('Working with packages:');
term.writeln(' * Search packages:   pkg search <query>');
term.writeln(' * Install a package: pkg install <package>');
term.writeln(' * Upgrade packages:  pkg upgrade');
term.writeln('');
term.writeln('NOTE: This is a simulation running on Vercel.');
term.writeln('');

// State Awal
let currLine = '';
let commandHistory = [];
let historyIndex = -1;
const prompt = '\x1b[1;32m~\x1b[0m$ ';

// Fake Filesystem sederhana
const fileSystem = {
    'readme.txt': 'Halo! Ini adalah simulasi Termux di web.',
    'secret.log': 'Admin password: admin123 (just kidding)',
    'projects': '[DIR] projects'
};

term.write(prompt);

// Handle Input
term.onData(e => {
    switch (e) {
        case '\r': // Enter
            term.write('\r\n');
            runCommand(currLine);
            if(currLine.trim().length > 0) {
                commandHistory.push(currLine);
                historyIndex = commandHistory.length;
            }
            currLine = '';
            term.write(prompt);
            break;
        case '\u007F': // Backspace
            if (currLine.length > 0) {
                term.write('\b \b');
                currLine = currLine.slice(0, -1);
            }
            break;
        default: // Typing characters
            if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e) || e >= '\u00a0') {
                currLine += e;
                term.write(e);
            }
    }
});

// Logika Command
function runCommand(cmd) {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case '':
            break;
        case 'help':
            term.writeln('Available commands: help, clear, ls, cat, echo, date, whoami, pkg');
            break;
        case 'clear':
            term.clear();
            break;
        case 'ls':
            term.writeln(Object.keys(fileSystem).join('  '));
            break;
        case 'cat':
            if(args[0] && fileSystem[args[0]]) {
                term.writeln(fileSystem[args[0]]);
            } else {
                term.writeln(`cat: ${args[0]}: No such file or directory`);
            }
            break;
        case 'echo':
            term.writeln(args.join(' '));
            break;
        case 'date':
            term.writeln(new Date().toString());
            break;
        case 'whoami':
            term.writeln('vercel-user');
            break;
        case 'pkg':
        case 'apt':
            term.writeln('\x1b[1;31mPermission denied.\x1b[0m This is a static demo. No real package manager.');
            break;
        default:
            term.writeln(`\x1b[1;31m${command}: command not found\x1b[0m`);
    }
}
