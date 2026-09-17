@echo off
setlocal
cd /d "%~dp0"
set "OBLIGA_NODE="
for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined OBLIGA_NODE set "OBLIGA_NODE=%%N"
if not defined OBLIGA_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "OBLIGA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined OBLIGA_NODE (
  echo Para abrir la app localmente, instala Node.js 22 o superior desde nodejs.org.
  pause
  exit /b 1
)
echo Deja esta ventana abierta y visita http://127.0.0.1:4173 en tu navegador.
echo Para detener la app, presiona Ctrl+C.
"%OBLIGA_NODE%" server.mjs
pause
