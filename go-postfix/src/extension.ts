import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			{ scheme: 'file', language: 'go' },
			{
				provideCompletionItems(document, position, token, context) {

					const wordRange = document.getWordRangeAtPosition(position, /[\w.]+/);
					if (!wordRange) {
						return undefined;
					};
					const word = document.getText(wordRange);

					if (word.includes('.')) {
						const variableName = word.split('.')[0];
						const snippet = new vscode.CompletionItem('printf');
						snippet.documentation = new vscode.MarkdownString(`Inserts fmt.Print(${variableName})`);
						snippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -word.length), position))];
						snippet.insertText = new vscode.SnippetString(`fmt.Printf("${variableName}: %v\\n", ${variableName})`);

						return [snippet];
					}

					return undefined;
				},
			},
			'.'
		)
	);
}
