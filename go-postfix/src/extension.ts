import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const goSelector = { scheme: 'file', language: 'go' };

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      goSelector,
      {
        provideCompletionItems(document, position, token, context) {
          let line = document.lineAt(position.line);
          let dotIdx = line.text.lastIndexOf('.', position.character);
          if (dotIdx === -1) {
            return [];
          }

          let commentIndex = line.text.indexOf('//');
          if (commentIndex >= 0 && position.character > commentIndex) {
            return [];
          }

          let code = line.text.substring(line.firstNonWhitespaceCharacterIndex, dotIdx);
          let escapedCode = code.replace(/"/g, '\\"');

          // printf
          let printfSnippet = new vscode.CompletionItem('printf');
          printfSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          printfSnippet.insertText = new vscode.SnippetString(`fmt.Printf("${escapedCode}: %v\\n", ${code})`);
          printfSnippet.kind = vscode.CompletionItemKind.Snippet;
          printfSnippet.sortText = '\u0000';
          printfSnippet.preselect = true;


          // len
          let lengthSnippet = new vscode.CompletionItem('len');
          lengthSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          lengthSnippet.insertText = new vscode.SnippetString(`len(${code})`);
          lengthSnippet.kind = vscode.CompletionItemKind.Snippet;
          lengthSnippet.sortText = '\u0000';
          lengthSnippet.preselect = true;

          // append
          let appendSnippet = new vscode.CompletionItem('append');
          appendSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          appendSnippet.insertText = new vscode.SnippetString(`${code} = append(${code}, \${0})`);
          appendSnippet.kind = vscode.CompletionItemKind.Snippet;
          appendSnippet.sortText = '\u0000';
          appendSnippet.preselect = true;

          // range
          let rangeSnippet = new vscode.CompletionItem('range');
          rangeSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          rangeSnippet.insertText = new vscode.SnippetString(`for _, v\${0} := range ${code} {\n\n}`);
          rangeSnippet.kind = vscode.CompletionItemKind.Snippet;
          rangeSnippet.sortText = '\u0000';
          rangeSnippet.preselect = true;

          // if
          let ifSnippet = new vscode.CompletionItem('if');
          ifSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          ifSnippet.insertText = new vscode.SnippetString(`if ${code}\${0} {\n\n}`);
          ifSnippet.kind = vscode.CompletionItemKind.Snippet;
          ifSnippet.sortText = '\u0000';
          ifSnippet.preselect = true;

          // iferr
          let iferrSnippet = new vscode.CompletionItem('iferr');
          iferrSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          iferrSnippet.insertText = new vscode.SnippetString(`if err := ${code}; err != nil {\n\${0}\n}`);
          iferrSnippet.kind = vscode.CompletionItemKind.Snippet;
          iferrSnippet.sortText = '\u0000';
          iferrSnippet.preselect = true;

          // switch
          let switchSnippet = new vscode.CompletionItem('switch');
          switchSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          switchSnippet.insertText = new vscode.SnippetString(`switch ${code} {\ncase \${0}:\n}`);
          switchSnippet.kind = vscode.CompletionItemKind.Snippet;
          switchSnippet.sortText = '\u0000';
          switchSnippet.preselect = true;

          // var
          let varSnippet = new vscode.CompletionItem('var');
          varSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          varSnippet.insertText = new vscode.SnippetString(`v\${0} := ${code}`);
          varSnippet.kind = vscode.CompletionItemKind.Snippet;
          varSnippet.sortText = '\u0000';
          varSnippet.preselect = true;

          // errors
          let errorSnippet = new vscode.CompletionItem('errors');
          errorSnippet.additionalTextEdits = [vscode.TextEdit.delete(new vscode.Range(position.translate(0, -(escapedCode.length + 1)), position))];
          errorSnippet.insertText = new vscode.SnippetString(`errors.New(${code})`);
          errorSnippet.kind = vscode.CompletionItemKind.Snippet;
          errorSnippet.sortText = '\u0000';
          errorSnippet.preselect = true;

          return [
            printfSnippet,
            lengthSnippet,
            appendSnippet,
            rangeSnippet,
            ifSnippet,
            iferrSnippet,
            switchSnippet,
            varSnippet,
            errorSnippet,
          ];
        },
      },
      '.'
    ),
    vscode.languages.registerCompletionItemProvider(
      goSelector,
      {
        provideCompletionItems(document, position, token, context) {
          // main
          let mainCompletion = new vscode.CompletionItem('main');
          mainCompletion.insertText = new vscode.SnippetString('package main\n\nfunc main() {\n\t${0}\n}');
          mainCompletion.kind = vscode.CompletionItemKind.Snippet;
          mainCompletion.sortText = '\u0000';
          mainCompletion.preselect = true;

          // for
          let forCompletion = new vscode.CompletionItem('for');
          forCompletion.insertText = new vscode.SnippetString('for i := 0; i < \${1:length}; i++ {\n\t\${2}\n}');
          forCompletion.kind = vscode.CompletionItemKind.Snippet;
          forCompletion.sortText = '\u0000';
          forCompletion.preselect = true;

          // if err != nil
          let iferrCompletion = new vscode.CompletionItem('if err != nil');
          iferrCompletion.insertText = new vscode.SnippetString('if err != nil {\nreturn fmt.Errorf("\${1:wrap message: }%w", ${2:err})\n}');
          iferrCompletion.kind = vscode.CompletionItemKind.Snippet;
          iferrCompletion.sortText = '\u0000';
          iferrCompletion.preselect = true;

          return [
            mainCompletion,
            forCompletion,
            iferrCompletion,
          ];
        },
      },
    )
  );
}
