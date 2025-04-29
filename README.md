# Expense Tracker Bot

Track your day to day expenses through messages on discord, and save them directly into google sheets!

![Group 5](https://github.com/user-attachments/assets/1600949b-6296-470b-a639-b68197415e31)


# Message formats:

![Screenshot (83)](https://github.com/user-attachments/assets/16bee645-7452-4270-b876-5dfa0f7d9b73)


```
<amount>
<label>      <amount>
<amount>     <description>
<label>      <amount>         <description>
```

# Setup

We need to setup both Discord Bot and a Google Cloud Project to push the expenses data into Google sheets

## Project Setup

Clone the project into desired location:
```typescript
git clone https://github.com/Mano-08/expense-tracker.git
```

Install the necessary packages:
```typescript
pnpm install
```

## Discord Bot Setup

- Create a Discord Bot at [Discord for Developers](https://discord.com/developers/applications)
- Generate a token ID and save it in .env file at the root of the project.
- Go to Installations on the side-panel, then find Guild install permissions. Add 'bot' under Scopes. Also add 'Add reactions', 'Read Message History', 'Send Messages' under Permissions.
- Go to Bot on the side-panel, then find and enable 'Message Content Intent'.
- Now head to Installations on the side-panel to find 'Install Link', open it on your browser and select a server you want your bot to run on.

## Google Cloud Project Setup

- Create a new project on google cloud.
- Enable Google Sheets API.
- Create a Service account and download the credentials.
- Paste the credentials.json into the root of the project and name the file as secrets.json (make sure it is present in .gitignore file!)
- Create a new blank google sheets (or type sheets.new on browser)
- Add Service account email address as an editor to that google sheets
- Copy the GoogleSheetId and save it in .env file (for example, <u>nfewbiu-fnfeeoWw</u> is the GoogleSheetsId for docs.google.com/spreadsheets/d/nfewbiu-fnfeeoWw/)

## Run the app!

- After saving DISCORD_TOKEN, GOOGLE_SHEET_ID and secrets.json, run the command:
```typescript
npm run spin
```
