// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
let targetUrl = "http://localhost:5000/problem";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "planimation" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("planimation.changeUrl", function (uri) {
      //  create webview
      const url = vscode.window
        .showInputBox({
          placeHolder: "Please input the target url you want to open",
          title: "Planimation URL",
        })
        .then((val) => {
          if (val) {
            targetUrl = val;
          }
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("planimation.openWebview", function (uri) {
      //  create webview
      const panel = vscode.window.createWebviewPanel(
        "testWebview", // viewType
        "Planimation", // webview title
        vscode.ViewColumn.One, // where to show in the screen
        {
          enableScripts: true,
          retainContextWhenHidden: true, // webview stay states when hidden
        }
      );
      panel.webview.html = getHtmlForWebView();
      // panel.webview.onDidReceiveMessage((msg) => {
      //   console.log("clientHeight", msg);
      // });
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
				  <div id="placeholder"></div>

					<script id="iframeTemplate" type="text/html">
						<iframe id="iframe"
								src="${targetUrl}" 
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
