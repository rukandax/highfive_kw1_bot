require('dotenv').config();

const Telegraf = require('telegraf');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const user = db.get('id')
                .find({ id: ctx.message.from.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.from.id, username: ctx.message.from.username })
      .write();
  }

  return ctx.reply('Gunakan format highfive seperti biasa tanpa kode kategori.');
});

bot.on('new_chat_members', (ctx) => {
  const user = db.get('id')
                .find({ id: ctx.message.new_chat_members.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.new_chat_members.id, username: ctx.message.new_chat_members.username })
      .write();
  }

  return ctx;
});

bot.command('myid', (ctx) => {
  return ctx.reply(`ID Telegram kamu adalah = ${ctx.message.from.id}`, { reply_to_message_id: ctx.message.message_id });
});

bot.command('help', (ctx) => {
  return ctx.reply('Gunakan format highfive seperti biasa tanpa kode kategori.');
});

bot.command('highfive', (ctx) => {
  if (ctx.message.from.username === 'highfive_kw1_bot') {
    return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id });
  }

  const user = db.get('id')
                .find({ id: ctx.message.from.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.from.id, username: ctx.message.from.username })
      .write();
  }

  let pushToUser = true;
  const users = [];

  let poin = null;
  let message = '';

  let text = ctx.message.text.replace('/highfive', '').trim();
  let textArray = text.split(' ');

  for (textContent of textArray) {
    textContent = textContent.trim();

    if (textContent.includes('@') && textContent.length > 1 && pushToUser) {
      users.push(textContent);
    } else if (poin === null && !isNaN(parseInt(textContent))) {
      pushToUser = false;
      poin = parseInt(textContent);
    } else {
      pushToUser = false;
      message += textContent + ' ';
    }
  }

  if (poin === null || message.length <= 0 || users.length <= 0) {
    return ctx.reply('Format salah, gunakan format highfive seperti biasa tanpa kode kategori.', { reply_to_message_id: ctx.message.message_id });
  }

  let type = 'Nice';

  if (poin < 0) {
    type = 'Hehehe';
  }
  
  if (poin >= 5) {
    type = 'Cool';
  }

  if (poin >= 10) {
    type = 'Great';
  }

  if (poin >= 15) {
    type = 'Fantastic';
  }

  if (poin > 20) {
    type = 'Uwoww';
  }

  if (poin > 5000) {
    type = 'Wadaww';
  }

  if (poin > 1000) {
    type = 'Wadidaww';
  }

  const output = `${type} highfive! @${ctx.message.from.username} berbagi ${users.length > 1 ? 'masing-masing ' : ''}<b>${poin}</b> poin untuk:\n${users.join('\n')}\nkarena <b>${message.trim()}</b>`;
  return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
    .catch(() => {
      return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id });
    });
});

bot.hears(/./gi, (ctx) => {
  const user = db.get('id')
                .find({ id: ctx.message.from.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.from.id, username: ctx.message.from.username })
      .write();
  }

  return ctx;
});

bot.launch();