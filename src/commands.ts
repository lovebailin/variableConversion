import * as vscode from 'vscode'
import { converter } from './utils'
import { TranslateType } from './types'
interface IEditor {
  activeTextEditor: vscode.TextEditor
  selection: vscode.Selection
  selectText: string
}

function getSelection(): Promise<IEditor> {
  return new Promise((resolve, reject) => {
    const activeTextEditor = vscode.window.activeTextEditor

    if (!activeTextEditor) {
      reject()
      return
    }
    const selection = activeTextEditor.selection

    const selectText = activeTextEditor.document.getText(selection)

    resolve({ activeTextEditor, selection, selectText })
  })
}

function registerCommand(command: string, type: TranslateType) {
  return vscode.commands.registerCommand(command, async () => {
    try {
      const { activeTextEditor, selection, selectText } = await getSelection()
      activeTextEditor.edit(editBuilder =>
        editBuilder.replace(selection, converter(type, selectText))
      )
    } catch (error) {
      vscode.window.showWarningMessage('Error' + error)
    }
  })
}

const constantTurnHump = registerCommand(
  'variableConversion.constantTurnHump',
  'CONST2HUMP'
)
const humpRotationConstant = registerCommand(
  'variableConversion.humpRotationConstant',
  'HUMP2CONST'
)

const humpTransconnector = registerCommand(
  'variableConversion.humpTransconnector',
  'HUMP2CONNECTOR'
)

const connectorTurnHump = registerCommand(
  'variableConversion.connectorTurnHump',
  'CONNECTOR2HUMP'
)

export default [
  humpRotationConstant,
  constantTurnHump,
  humpTransconnector,
  connectorTurnHump,
]
