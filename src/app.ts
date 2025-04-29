require("dotenv").config();

import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { google } from "googleapis";

const spreadSheetId = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  keyFile: "secrets.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user?.tag}`);
});

async function saveExpenseToGoogleSheets(
  message: any,
  {
    cost,
    label,
    desc,
  }: {
    cost: number;
    label: string;
    desc: string;
  }
) {
  const googleClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: googleClient as any });
  const now = new Date();
  const date = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}/${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${now.getFullYear()}`;
  const values = [[date, label, cost, desc]];
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadSheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
  message.react("✅");
}

async function handleSaveExpense(message) {
  const expense = message.content.trim().toLowerCase();
  // CASE 1: <cost> | '122.11'
  if (/^\d+(\.\d+)?$/.test(expense)) {
    saveExpenseToGoogleSheets(message, {
      cost: expense,
      label: "OTHER",
      desc: "",
    });
  }

  // CASE 2: <label> <cost> | 'food 122.11'
  else if (/^\w+\s\d+(\.\d+)?$/.test(expense)) {
    const [label, cost] = expense.split(" ");
    saveExpenseToGoogleSheets(message, {
      cost: cost,
      label: label,
      desc: "",
    });
  }

  // CASE 3: <label> <cost> <description> | 'food 122.11 mexican pizza'
  else if (/^\w+\s\d+(\.\d+)?\s.+$/.test(expense)) {
    const [label, cost, ...description] = expense.split(" ");
    saveExpenseToGoogleSheets(message, {
      cost: cost,
      label: label,
      desc: description.join(" "),
    });
  }

  // CASE 4: <cost> <description> | '122.11 mexican pizza'
  else if (/^\d+(\.\d+)?\s.+$/.test(expense)) {
    const [cost, ...description] = expense.split(" ");
    saveExpenseToGoogleSheets(message, {
      cost: cost,
      label: "OTHER",
      desc: description.join(" "),
    });
  }

  // CASE 5: invalid format
  else {
    message.react("❌");
    message.reply(
      "Invalid format. Please use one of the following formats:\n1. `<amount>`\n2. `<label> <amount>`\n3. `<label> <amount> <description>`\n4. `<amount> <description>`"
    );
    return false;
  }
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  try {
    await handleSaveExpense(message);
  } catch (err) {
    console.error(err);
    message.react("❌");
  }
});

client.login(process.env.DISCORD_TOKEN);
