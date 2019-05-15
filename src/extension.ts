// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sdk from 'vscode-iot-device-cube-sdk';
import {volumelistName} from 'volumelist';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iot-device-cube-test" is now active!');
	

	const outputChannel: vscode.OutputChannel =
		vscode.window.createOutputChannel('IoT Device Cube Helper Sample');
	const listVolume = vscode.commands.registerCommand(
		'iotcubesample.listvolume', async () => {
		outputChannel.show();
		const localList = await sdk.FileSystem.listVolume();
		outputChannel.appendLine('Local file system:');
		outputChannel.appendLine(JSON.stringify(localList, null, 2));
		const remoteList = await volumelistName();
		outputChannel.appendLine('');
		outputChannel.appendLine('==========================================');
		outputChannel.appendLine('');
		outputChannel.appendLine('Remote file system:');
		outputChannel.appendLine(JSON.stringify(remoteList, null, 2));
		const ssh = new sdk.SSH();
		await ssh.open('10.172.14.38', 22, 'root', '');
		outputChannel.appendLine('');
		outputChannel.appendLine('==========================================');
		outputChannel.appendLine('');
		outputChannel.appendLine('SSH file system:');
		const command = ssh.spawn('ls -la');
		command.on('data', outputChannel.append);
		command.on('close', () => {
			outputChannel.appendLine('DONE');
			ssh.close();
		});
		command.on('error', outputChannel.appendLine);
	});

	context.subscriptions.push(listVolume);


	// sdk.FileSystem.copyFile('C:\\Users\\zlhe\\Desktop\\hello.txt', 'C:outp\\Users\\zlhe\\Desktop\\test');

	// const ssh = new sdk.SSH();
	// await ssh.open('10.172.14.38', 22, 'root', '');
	// try {
	// 	await ssh.uploadFolder('C:\\Users\\zlhe\\Desktop\\test', 'test2/deep2');
	// } catch(err) {
	// 	console.log(err)
	// }
	// const command = ssh.spawn('ls -la');
	// command.on('data', console.log);
	// command.on('close', async () => {
	// 	await ssh.close();
	// 	console.log('closed');
	// });
	// command.on('error', console.log);
}

// this method is called when your extension is deactivated
export function deactivate() {}
