Set Shell = CreateObject("Shell.Application")
Set WShell = WScript.CreateObject("WScript.Shell")
Set ProcEnv = WShell.Environment("PROCESS")

cmd = ProcEnv("CMD")

If (cmd <> "") Then
  Shell.ShellExecute "cmd.exe", "/c " & cmd, "", "runas", 0
Else
  WScript.Quit
End If