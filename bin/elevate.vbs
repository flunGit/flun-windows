Set sh = CreateObject("Shell.Application")
Set fso = CreateObject("Scripting.FileSystemObject")

tmp = fso.GetSpecialFolder(2) ' 获取系统临时目录
outFile = fso.BuildPath(tmp, "flun_el_output.txt")
batFile = fso.BuildPath(tmp, "flun_el.bat")
cmdFile = fso.BuildPath(tmp, "flun_el.cmd")

' 创建文件
With fso.CreateTextFile(cmdFile, True)
    .WriteLine "@echo off"
    .WriteLine "{command}"  ' 实际命令
    .Close
End With

With fso.CreateTextFile(batFile, True)
    .WriteLine "@echo off"
    .WriteLine "chcp 65001 > nul"
    .WriteLine "call """ & cmdFile & """ > """ & outFile & """ 2>&1"
    .Close
End With

' 执行并清理
sh.ShellExecute "cmd.exe", "/c """ & batFile & """", "", "runas", 0

' 等待执行
Do Until fso.FileExists(outFile)
    WScript.Sleep 100
Loop

fso.DeleteFile batFile, True
fso.DeleteFile cmdFile, True