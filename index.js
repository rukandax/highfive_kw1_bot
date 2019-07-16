require('dotenv').config();

const Telegraf = require('telegraf');
const Loki = require('lokijs');

const db = new Loki('loki.json', {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true, 
  autosaveInterval: 4000,
});

let config = null;

function databaseInitialize() {
  config = db.getCollection('config');

  if (config === null) {
    config = db.addCollection('config');
  }

  init();
}

function init() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start((ctx) => {
    return ctx.reply('Gunakan format highfive seperti biasa tanpa kode kategori.');
  });
  
  bot.command('getchatid', (ctx) => {
    if (ctx.message.from.username !== 'rukandax') {
      return ctx.reply('Anda bukan admin.');
    }

    const group = config.find({ chat_id: config.get(1).chat_id });
    group.chat_id = ctx.message.chat.id;

    config.update(group);
    return ctx.reply(`Berhasil menyimpan chat_id ${ctx.message.chat.id}`);
  });

  bot.command('showchatid', (ctx) => {
    if (ctx.message.from.username !== 'rukandax') {
      return ctx.reply('Anda bukan admin.');
    }

    return ctx.reply(`chat_id ${config.get(1).chat_id}`);
  });
  
  bot.command('highfive', (ctx) => {
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
      return ctx.reply('Format salah, gunakan format highfive seperti biasa tanpa kode kategori.');
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

    if (poin > 50) {
      type = 'Wadaww';
    }

    if (poin > 50) {
      type = 'Wadidaww';
    }
  
    const output = `${type} highfive! @${ctx.message.from.username} berbagi ${users.length > 1 ? 'masing-masing ' : ''}<b>${poin}</b> poin untuk:\n${users.join('\n')}\nkarena <b>${message.trim()}</b>`;
    return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
      .catch((e) => console.log(e));
  });
  
  bot.launch()
}