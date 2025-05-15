@echo off
SET BASEDIR=client-management-saas

REM Create folders
mkdir %BASEDIR%\components
mkdir %BASEDIR%\pages\api
mkdir %BASEDIR%\lib
mkdir %BASEDIR%\services
mkdir %BASEDIR%\types
mkdir %BASEDIR%\constants
mkdir %BASEDIR%\public
mkdir %BASEDIR%\styles

REM Create files in /components
type nul > %BASEDIR%\components\ClientCard.tsx
type nul > %BASEDIR%\components\AlertForm.tsx
type nul > %BASEDIR%\components\SearchInput.tsx
type nul > %BASEDIR%\components\NotificationLog.tsx

REM Create files in /pages and /pages/api
type nul > %BASEDIR%\pages\index.tsx
type nul > %BASEDIR%\pages\clients.tsx
type nul > %BASEDIR%\pages\alerts.tsx
type nul > %BASEDIR%\pages\notifications.tsx
type nul > %BASEDIR%\pages\api\clients.ts
type nul > %BASEDIR%\pages\api\alerts.ts
type nul > %BASEDIR%\pages\api\notifications.ts

REM Create files in /lib
type nul > %BASEDIR%\lib\gmailClient.ts
type nul > %BASEDIR%\lib\voipmsClient.ts
type nul > %BASEDIR%\lib\database.ts

REM Create files in /services
type nul > %BASEDIR%\services\ClientService.ts
type nul > %BASEDIR%\services\AlertService.ts
type nul > %BASEDIR%\services\NotificationService.ts

REM Create file in /types
type nul > %BASEDIR%\types\index.ts

REM Create file in /constants
type nul > %BASEDIR%\constants\index.ts

REM Create file in /public
type nul > %BASEDIR%\public\favicon.ico

REM Create file in /styles
type nul > %BASEDIR%\styles\globals.css

REM Create root-level files
type nul > %BASEDIR%\.env.example
type nul > %BASEDIR%\README.md
type nul > %BASEDIR%\schema.sql
type nul > %BASEDIR%\tailwind.config.js
type nul > %BASEDIR%\tsconfig.json
type nul > %BASEDIR%\next.config.js
type nul > %BASEDIR%\package.json
type nul > %BASEDIR%\.eslintrc.json
type nul > %BASEDIR%\.prettierrc
type nul > %BASEDIR%\cron.ts

echo Folder structure created successfully.
