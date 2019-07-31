require('dotenv').config();

const Telegraf = require('telegraf');
const Schedule = require('node-schedule')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const axios = require('axios');
const cheerio = require('cheerio');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const adapter = new FileSync('db.json');
const db = low(adapter);

const bot = new Telegraf(process.env.BOT_TOKEN);

Schedule.scheduleJob('payday', '00 13 * * *', () => {
  let dayBeforePayday = new Date();
  const today = new Date();

  const payday = new Date();
  payday.setDate(27);
  
  if(payday.getDay() == 0) {
    dayBeforePayday.setDate(payday.getDate() - 3);
  }

  if (payday.getDay() == 6) {
    dayBeforePayday.setDate(payday.getDate() - 2);
  }

  if (
    today.getDay() === dayBeforePayday.getDay()
  ) {
    return bot.telegram.sendMessage(-1001113266099, 'Besok gajian gaesss~~');
  }
});

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
});

bot.command('myid', (ctx) => {
  const user = db.get('id')
                .find({ id: ctx.message.from.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.from.id, username: ctx.message.from.username })
      .write();
  }

  return ctx.reply(`ID Telegram kamu adalah = ${ctx.message.from.id}`, { reply_to_message_id: ctx.message.message_id });
});

bot.command('help', (ctx) => {
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

bot.command('highfive', (ctx) => {
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

  let applyFee = false;
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
    applyFee = true;
  }

  if (poin > 10000) {
    type = 'Wadidaww';
    applyFee = true;
  }

  if (applyFee) {
    ctx.reply('Per 30 Juli 2019, setiap highfive dengan nilai diatas 5000 dikenakan fee sebesar 2%.\n\n-- TTD Revenue Tribe --', { reply_to_message_id: ctx.message.message_id });
    poin = poin - (poin * 2 / 100);
  }

  const output = `${type} highfive! @${ctx.message.from.username} berbagi ${users.length > 1 ? 'masing-masing ' : ''}<b>${poin}</b> poin untuk:\n${users.join('\n')}\nkarena <b>${message.trim()}</b>`;

  return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
    .catch(() => {
      return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id });
    });
});

bot.command('instagram', async (ctx) => {
  ctx.reply('Bentar dicari dulu', { reply_to_message_id: ctx.message.message_id });  
  
  let name = '';

  if (ctx.message.text.includes('/instagram@highfive_kw1_bot')) {
    name = ctx.message.text.replace('/instagram@highfive_kw1_bot', '').trim();
  } else {
    name = ctx.message.text.replace('/instagram', '').trim();
  }

  // const links = await axios.get(`https://api.social-searcher.com/v2/search?q=${name}&network=web&key=${process.env.SOCIAL_SEARCHER_KEY}`)
  //   .then(({ data }) => {
  //     const users = []
  //     const { posts } = data;

  //     for (post of posts) {
  //       if (post.type === 'link' && post.user && post.user.name === 'www.instagram.com') {
  //         if (!post.url.includes('/explore/')) {
  //           users.push(post.url);
  //         }
  //       }
  //     }

  //     return users;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  const links = await axios.get(`https://gramuser.com/search/${name}`)
    .then(({ data }) => {
      const users = [];

      const $ = cheerio.load(data);
      const usersEl = $('.timg');

      usersEl.each((_, el) => {
        const user = $(el).attr('href').replace('http://gramuser.com/user/', 'https://www.instagram.com/');
        
        if (!users.includes(user)) {
          users.push(user);
        }
      });

      return users;
    });

  if (links.length > 0) {
    return ctx.reply(`Nemu nih ${links.length} akun\n\n${links.join("\n")}`, { reply_to_message_id: ctx.message.message_id });  
  }

  return ctx.reply('Sorry gak nemu', { reply_to_message_id: ctx.message.message_id });  
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
});

bot.launch();