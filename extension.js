// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "planimation" is now active!');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "planimation.pddl",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from planimation!");
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("planimation.openWebview", function (uri) {
      // 创建webview
      const panel = vscode.window.createWebviewPanel(
        "testWebview", // viewType
        "WebView demo", // webview title
        vscode.ViewColumn.One, // where to show in the screen
        {
          enableScripts: true,
          retainContextWhenHidden: true, // webview stay states when hidden
        }
      );
      panel.webview.html = getHtmlForWebView();
	  panel.webview.onDidReceiveMessage(msg=>{
		console.log("clientHeight", msg)

	  })
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

function getHtmlForWebView() {
  let html = `<!DOCTYPE html>
  				<html lang="en">
				  <head>
				  	<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Planimation</title>
				  </head>
				  <body>
				  <a href="http://localhost:5000">click me please</a>
				  <div id="placeholder"></div>

					<script id="iframeTemplate" type="text/html">
						<iframe id="iframe"
								src="http://localhost:5000" 
								onload="adjustIframe()"
								frameborder="0"
								scrolling="auto">
							<!-- replace this line with alternate content -->
						</iframe>
					</script>

					<script type="text/javascript">
					var element,
						html,
						template;
					
					const vscode = acquireVsCodeApi();

					element = document.getElementById("placeholder");
					template = document.getElementById("iframeTemplate");
					
					
					html = template.innerHTML;

					element.innerHTML = html;
					</script>
					<script>
						function adjustIframe(){
							var ifrm = document.getElementById("iframe");
							ifrm.height = document.documentElement.clientHeight;
					
							ifrm.width = document.documentElement.clientWidth;
							vscode.postMessage({
								height: ifrm.height,
								width: ifrm.width
							})
						}
					</script>
				  </body>
				</html>`;
  return html;
}

module.exports = {
  activate,
  deactivate,
};
