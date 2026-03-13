import * as vscode from 'vscode';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

let isEnabled = true;
let activeProcess: ChildProcess | null = null;
let debounceTimer: NodeJS.Timeout | null = null;
const errorMap = new Map<string, number>();

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('panicOnError');
    isEnabled = config.get('enabled', true);

    const toggleCommand = vscode.commands.registerCommand('panic-on-error.toggle', () => {
        isEnabled = !isEnabled;
        if (!isEnabled) stopSound();
        vscode.window.showInformationMessage(`Panic on Error: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    });

    const diagnosticListener = vscode.languages.onDidChangeDiagnostics((e) => {
        if (!isEnabled) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let hasErrors = false;

            for (const uri of e.uris) {
                const diagnostics = vscode.languages.getDiagnostics(uri);
                const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
                const uriKey = uri.toString();
                const previousCount = errorMap.get(uriKey) || 0;
                
                if (errors.length > 0) {
                    hasErrors = true;
                    if (errors.length > previousCount) {
                        playPanicSound(context);
                    }
                }
                
                errorMap.set(uriKey, errors.length);
            }

            if (!hasErrors) stopSound();
        }, 100);
    });

    context.subscriptions.push(toggleCommand, diagnosticListener);
}

function playPanicSound(context: vscode.ExtensionContext) {
    stopSound();
    
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const soundPath = path.join(context.extensionPath, 'sounds', `sound${randomNum}.mp3`);
    const platform = process.platform;

    if (platform === 'linux') {
        activeProcess = spawn('sh', ['-c', `paplay "${soundPath}" 2>/dev/null || ffplay -nodisp -autoexit "${soundPath}" 2>/dev/null || mpg123 "${soundPath}" 2>/dev/null`]);
    } else if (platform === 'darwin') {
        activeProcess = spawn('afplay', [soundPath]);
    } else if (platform === 'win32') {
        activeProcess = spawn('powershell', ['-c', `(New-Object Media.SoundPlayer "${soundPath}").PlaySync()`]);
    }

    if (activeProcess) {
        activeProcess.on('exit', () => { activeProcess = null; });
    }
}

function stopSound() {
    if (activeProcess) {
        activeProcess.kill();
        activeProcess = null;
    }
}

export function deactivate() {
    stopSound();
    if (debounceTimer) clearTimeout(debounceTimer);
}
