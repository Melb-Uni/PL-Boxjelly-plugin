// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const FormData = require("form-data");
const Path = require("path");
let localPddlPath = `D:\\Study\\2021S2\\project\\qqq`;
const targetUrl = "http://localhost:5000/problem";

// let localPddlList = [];
let selectedFiles = [];

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
      if (selectedFiles && selectedFiles.length === 3) {
        // sendData(localPddlList);
      } else {
        vscode.window.showWarningMessage("3 pddl files are required");
      }
    }
  );

  context.subscriptions.push(disposable);

  const op = vscode.commands.registerCommand("openSelectedPddl", (args) => {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.file(args.path));
  });

  const provider = new Provider();
  const dis = vscode.window.registerTreeDataProvider("mypddl-list", provider);
  context.subscriptions.push(dis);
  context.subscriptions.push(op);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "planimation.openFiles",
      async function (uri) {
        // vscode.window.showWorkspaceFolderPick();
        console.log("clicked");
        const uris = await vscode.window.showOpenDialog({
          canSelectFolders: false, // 是否可以选择文件夹
          canSelectMany: true, // 是否可以选择多个文件
          filters: {
            pddl: ["pddl"], // 文件类型过滤
          },
        });

        if (!uris || !uris.length) {
          return;
        }
        selectedFiles = uris;
        provider.refresh();
        handleFiles(uris);
        console.log("clicked1");
      }
    )
  );
  // context.subscriptions.push(
  //   vscode.commands.registerCommand('planimation.refreshEntry', () =>
  //   provider.refresh()
  //   )
  // )
  context.subscriptions.push(
    vscode.commands.registerCommand("planimation.openWebview", function (uri) {
      if (!selectedFiles) {
        vscode.window.showInformationMessage(
          "Please run 'Open Files' and select files first "
        );
        return;
      }
      if (selectedFiles.length < 3) {
        vscode.window.showErrorMessage("3 pddl files are required");
        return;
      }
      if (selectedFiles.length === 3) {
        // sendData(localPddlList);
        const panel = vscode.window.createWebviewPanel(
          "testWebview", // viewType
          "WebView demo", // webview title
          vscode.ViewColumn.One, // where to show in the screen
          {
            enableScripts: true,
            retainContextWhenHidden: true, // webview stay states when hidden
          }
        );
        let files = [];
        selectedFiles.forEach((file) => {
          try {
            const f = fs.readFileSync(vscode.Uri.parse(file).fsPath);
            files.push(   );
            console.log("ffff", f);
          } catch (error) {
            vscode.window.showErrorMessage("Error when reading file", error.message);
          }
        });
        console.log("localPddlList", selectedFiles);
        const formData = new FormData();
        // let files = selectedFiles;
        for (const name in files) {
          formData.append(name, files[name]);
        }
        console.log("file333", formData);
        panel.webview.postMessage({
          formData: formData
        });
        panel.webview.html = getHtmlForWebView();

        panel.webview.onDidReceiveMessage((msg) => {
          console.log("clientHeight", msg);
        });
      } else {
        vscode.window.showErrorMessage("3 pddl files are required");
      }
      // 创建webview
      //   const panel = vscode.window.createWebviewPanel(
      //     "testWebview", // viewType
      //     "WebView demo", // webview title
      //     vscode.ViewColumn.One, // where to show in the screen
      //     {
      //       enableScripts: true,
      //       retainContextWhenHidden: true, // webview stay states when hidden
      //     }
      //   );
      //   panel.webview.html = getHtmlForWebView();
      //   panel.webview.onDidReceiveMessage((msg) => {
      //     console.log("clientHeight", msg);
      //   });
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

function handleFiles(uris) {
  console.log("uris", uris);
  let localPddlList = [];
  uris.forEach((uri) => {
    const name = Path.basename(uri.path, ".pddl");
    // const path = Path.join(localPddlPath, uri.path);
    localPddlList.push({
      path: uri.path,
      name,
    });
  });
  console.log("localPddlList22", localPddlList);
}

function getLocalFiles() {
  let localPddlList = [];
  selectedFiles.forEach((uri) => {
    const name = Path.basename(uri.path, ".pddl");
    // const path = Path.join(localPddlPath, uri.path);
    localPddlList.push({
      path: uri.path,
      name,
    });
  });
  return Promise.resolve(localPddlList);
}

class Provider {
  _onDidChangeTreeData = new vscode.EventEmitter();

  onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh() {
    // console.log('refresh....');
    this._onDidChangeTreeData.fire(undefined);
  }
  getTreeItem(info) {
    return new PDDLFileTreeItem(info);
  }
  getChildren() {
    return getLocalFiles();
  }
}

// interface NovelItem {
// 	name: string;
// 	path: string;
// }

class PDDLFileTreeItem extends vscode.TreeItem {
  constructor(info) {
    super(`${info.name}`);

    const tips = [`${info.name}`];
    this.tooltip = tips.join("\r\n");
    this.description = `pddl files`;
    this.command = {
      command: "openSelectedPddl",
      title: "Open the file",
      arguments: [{ name: info.name, path: info.path }],
    };
  }
}

// async function sendData(data) {
// 	// const formData = new FormData();
// 	// for (const name in files) {
// 	//   formData.append(name, files[name]);
// 	// }
// 	try {
// 	  const resp = await window.fetch(
// 		"https://planimation.planning.domains/upload/pddl",
// 		{
// 		  //"http://127.0.0.1:8000/upload/pddl" On local server
// 		  method: "POST", //DO NOT use headers
// 		  body: data, // Dataformat
// 		}
// 	  );

// 	  const jsonData = await resp.json();
// 	  const txt = JSON.stringify(jsonData);
// 	  //   onStore(txt);
// 	} catch (error) {
// 	  vscode.window.showErrorMessage("Try again:", error);
// 	}
//   }

{
  /* <script id="iframeTemplate" type="text/html">
						<iframe id="iframe"
								src=${targetUrl} 
								onload="adjustIframe()"
								frameborder="0"
								scrolling="auto">
							<!-- replace this line with alternate content -->
						</iframe>
					</script> */
}
{
  /* <script>
					async function sendData() {
						const formData = new window.FormData();
						let files = fileslist
						for (const name in files) {
							formData.append(name, files[name]);
						}
						try {
						  const resp = await window.fetch(
							"https://planimation.planning.domains/upload/pddl",
							{
							  //"http://127.0.0.1:8000/upload/pddl" On local server
							  method: "POST", //DO NOT use headers
							  body: formData, // Dataformat
							}
						  );
					  
						  const jsonData = await resp.json();
						  const txt = JSON.stringify(jsonData);
						  console.log("file",txt)
						  vscode.postMessage({
							file: txt
						})
						//   localStorage.setItem('fileContent', content);
						} catch (error) {
						  vscode.window.showErrorMessage("Try again:", error);
						}
					  }
					  sendData()
					</script> */
}

async function sendData() {
  let files = [];
  selectedFiles.forEach((file) => {
    try {
      const f = fs.readFileSync(vscode.Uri.parse(file).fsPath);
      files.push(f);
      console.log("ffff", f);
    } catch (error) {
      vscode.window.showErrorMessage("Error when reading file", error.message);
    }
  });
  console.log("localPddlList", selectedFiles);
  const formData = new FormData();
  // let files = selectedFiles;
  for (const name in files) {
    formData.append(name, files[name]);
  }
  console.log("file", formData);
  // try {
  //   const resp = await window.fetch(
  //     "https://planimation.planning.domains/upload/pddl",
  //     {
  //       //"http://127.0.0.1:8000/upload/pddl" On local server
  //       method: "POST", //DO NOT use headers
  //       body: formData, // Dataformat
  //     }
  //   );

  //   const jsonData = await resp.json();
  //   const txt = JSON.stringify(jsonData);
  //   // vscode.postMessage({
  //   //   file: txt,
  //   // });
  //   //   localStorage.setItem('fileContent', content);
  // } catch (error) {
  //   vscode.window.showErrorMessage("Try again:", error);
  // }
}
function getHtmlForWebView() {
  console.log("success");
  //   const formData = new FormData();
  //   for (const name in localPddlList) {
  //     formData.append(name, localPddlList[name]);
  //   }
  //   console.log("d", formData);
  //   const formData = "";
  // let filelist = localPddlList;

  // sendData();
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
						  src=${targetUrl} 
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

              window.frames[0].postMessage(JSON.stringify({key:'testval',value:'33'}),"${targetUrl}")

							vscode.postMessage({
								height: ifrm.height,
								width: ifrm.width
							})
						}
					</script>
          <script>
          function getData(){
            window.addEventListener('message', async (event) => {
                  const message = event.data;
                  if (message.formData == undefined || !message.formData) {
                    console.log('---------------------------message：aaaa');
                    return;
                  }
                  console.log('---------------------------message：' + message.formData);
                  courseId = message.command;
                  //下面可以作自己的处理
                  try {
                      const resp = await fetch(
                        "https://planimation.planning.domains/upload/pddl",
                        {
                          // "http://127.0.0.1:8000/upload/pddl" On local server
                          method: "POST", //DO NOT use headers
                          body: message.formData, // Dataformat
                        }
                      );
                  
                      const jsonData = await resp.json();
                      const txt = JSON.stringify(jsonData);
                      console.log('txt', txt)
                      vscode.postMessage({
                        file: txt,
                      });
                        localStorage.setItem('fileContent', content);
                    } catch (error) {
                      vscode.postMessage("Try again:", error.message);
                    }
            });
            // 
          }
          getData()
          </script>
				  </body>
				</html>`;
  return html;
}

module.exports = {
  activate,
  deactivate,
};
