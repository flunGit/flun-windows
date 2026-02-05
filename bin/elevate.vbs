Set shell = CreateObject("Shell.Application")
Set fso = CreateObject("Scripting.FileSystemObject")

tempDir = fso.GetSpecialFolder(2)  ' 获取系统临时目录
outputFile = fso.BuildPath(tempDir, "flun_el_output.txt")
exitFile = fso.BuildPath(tempDir, "flun_el_exit.txt")
tempBatch = fso.BuildPath(tempDir, "flun_el.bat")
tempCmdFile = fso.BuildPath(tempDir, "flun_el.cmd")

' 创建临时批处理文件
Set batchFile = fso.CreateTextFile(tempBatch, True)
batchFile.WriteLine "@echo off"
batchFile.WriteLine "chcp 65001 > nul"

' 创建中间命令文件
Set cmdFile = fso.CreateTextFile(tempCmdFile, True)
cmdFile.WriteLine "@echo off"
cmdFile.WriteLine "{command}"
cmdFile.Close

' 在批处理文件中调用命令文件并重定向所有输出
batchFile.WriteLine "call """ & tempCmdFile & """ > """ & outputFile & """ 2>&1"
batchFile.WriteLine "echo %ERRORLEVEL% > """ & exitFile & """"
batchFile.Close

shell.ShellExecute "cmd.exe", "/c """ & tempBatch & """", "", "runas", 0
For i = 1 To 150
    If fso.FileExists(exitFile) Then Exit For
    WScript.Sleep 100
Next

On Error Resume Next
fso.DeleteFile tempBatch, True
fso.DeleteFile tempCmdFile, True
On Error GoTo 0