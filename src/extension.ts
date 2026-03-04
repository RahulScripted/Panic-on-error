import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

let isEnabled = true;
const errorMap = new Map<string, number>();

export function activate(context: vscode.ExtensionContext) {
    console.log('Panic on Error is now active!');

    const config = vscode.workspace.getConfiguration('panicOnError');
    isEnabled = config.get('enabled', true);

    const toggleCommand = vscode.commands.registerCommand('panic-on-error.toggle', () => {
        isEnabled = !isEnabled;
        vscode.window.showInformationMessage(`Panic on Error: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    });

    const diagnosticListener = vscode.languages.onDidChangeDiagnostics((e) => {
        if (!isEnabled) return;

        for (const uri of e.uris) {
            const diagnostics = vscode.languages.getDiagnostics(uri);
            const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
            const uriKey = uri.toString();
            const previousCount = errorMap.get(uriKey) || 0;
            
            if (errors.length > 0 && errors.length > previousCount) {
                console.log('🔊 PANIC! Playing sound for', errors.length, 'errors');
                playPanicSound(context);
            }
            
            errorMap.set(uriKey, errors.length);
        }
    });

    context.subscriptions.push(toggleCommand, diagnosticListener);
}

function playPanicSound(context: vscode.ExtensionContext) {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const soundPath = path.join(context.extensionPath, 'sounds', `sound${randomNum}.mp3`);
    
    const platform = process.platform;
    let command = '';

    if (platform === 'linux') {
        command = `paplay "${soundPath}" 2>/dev/null || ffplay -nodisp -autoexit "${soundPath}" 2>/dev/null || mpg123 "${soundPath}" 2>/dev/null`;
    } else if (platform === 'darwin') {
        command = `afplay "${soundPath}"`;
    } else if (platform === 'win32') {
        command = `powershell -c (New-Object Media.SoundPlayer "${soundPath}").PlaySync()`;
    }

    if (command) {
        exec(command, (error) => {
            if (error) {
                vscode.window.showWarningMessage('🔊 PANIC! Error detected but audio player not found. Install: paplay, ffplay, or mpg123');
            }
        });
    }
}

export function deactivate() {}
