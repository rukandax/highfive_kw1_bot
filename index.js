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
  } else if (payday.getDay() == 6) {
    dayBeforePayday.setDate(payday.getDate() - 2);
  } else {
    dayBeforePayday = null;
  }

  if (
    dayBeforePayday
    &&
    today.getDate() === dayBeforePayday.getDate()
  ) {
    bot.telegram.sendMessage(-1001113266099, 'Besok gajian gaesss~~').catch((err) => {
      console.log(err);
    });

    bot.telegram.sendMessage(-1001270555525, 'Besok gajian gaesss~~').catch((err) => {
      console.log(err);
    });
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

  return ctx.replyWithMarkdown('*Halo, ada yang bisa Anak Ibu Susi bantu hari ini?*\n\n1. Kalau kamu mau givepoint, cerita dulu sama Anak Ibu Susi seperti ini ya:\n`/givepoint [@usernameteman] [alasan]`\n2. Kalau kamu mau highfive, kirim perintah highfive ke Anak Ibu Susi seperti ini ya:\n`/highfive [@usernameteman] [@usernametemanlain] [poin] [alasan]`\n3. Gak perlu pakai kode kategori.\n\n*Bot ini adalah versi parody dari @ibususi_bot setiap pesan yang masuk tidak akan dimoderasi, disimpan ataupun diproses dalam bentuk apapun.\n\nSo please use it wisely.*')
    .catch((err) => {
      console.log(err);
    });
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

  return ctx.replyWithMarkdown('*Halo, ada yang bisa Anak Ibu Susi bantu hari ini?*\n\n1. Kalau kamu mau givepoint, cerita dulu sama Anak Ibu Susi seperti ini ya:\n`/givepoint [@usernameteman] [alasan]`\n2. Kalau kamu mau highfive, kirim perintah highfive ke Anak Ibu Susi seperti ini ya:\n`/highfive [@usernameteman] [@usernametemanlain] [poin] [alasan]`\n3. Gak perlu pakai kode kategori.\n\n*Bot ini adalah versi parody dari @ibususi_bot setiap pesan yang masuk tidak akan dimoderasi, disimpan ataupun diproses dalam bentuk apapun.\n\nSo please use it wisely.*')
    .catch((err) => {
      console.log(err);
    });
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

  return ctx.reply(`ID Telegram kamu adalah = ${ctx.message.from.id}`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
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
    return ctx.reply('Format salah, gunakan format highfive seperti biasa tanpa kode kategori.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
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

  if (poin > 10000) {
    type = 'Wadidaww';
  }

  const output = `${type} highfive! @${ctx.message.from.username} berbagi ${users.length > 1 ? 'masing-masing ' : ''}<b>${poin}</b> poin untuk:\n${users.join('\n')}\nkarena <b>${message.trim()}</b>`;

  // return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
  //   .catch(() => {
  //     return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
  //       console.log(err);
  //     });
  //   });
});

bot.command('givepoint', (ctx) => {
  const user = db.get('id')
                .find({ id: ctx.message.from.id })
                .value();

  if (!user) {
    db.get('id')
      .push({ id: ctx.message.from.id, username: ctx.message.from.username })
      .write();
  }

  let message = '';
  let text = '';

  if (ctx.message.text.includes('/givepoint@highfive_kw1_bot')) {
    text = ctx.message.text.replace('/givepoint@highfive_kw1_bot', '').trim();
  } else {
    text = ctx.message.text.replace('/givepoint', '').trim();
  }

  let textArray = text.split(' ');

  if (!textArray[0].includes('@')) {
    return ctx.reply('User tidak ditemukan, gunakan format givepoint seperti biasa tanpa kode kategori.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  message = textArray.slice(1).join(' ');

  if (message.length < 2) {
    return ctx.reply('Pesan tidak boleh kosong, gunakan format givepoint seperti biasa tanpa kode kategori.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  const endTexts = [
    'Aku sih bodo amat!',
    'Aku gak sabar mau cerita ini waktu ngumpul sama temen-temen toxic aku nanti.',
    'Salamin sama pacar-pacar mu juga ya.',
    'Temen-temen pada nanyain tuh. Kapan bayar hutang ?',
  ];

  const endTextsIndex = parseInt(Math.random() * endTexts.length);

  const output = `${ctx.message.from.first_name ? ctx.message.from.first_name : ''} ${ctx.message.from.last_name ? ctx.message.from.last_name : ''} (@${ctx.message.from.username}) abis cerita sama Anak Ibu Susi kalau ${textArray[0]} udah ${message}. ${endTexts[endTextsIndex]}`;

  // return ctx.reply(output, { chat_id: -1001113266099 })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

const findInstagram = async (ctx, target = '') => {
  let name = target;

  if (ctx.message.text.includes('/instagram@highfive_kw1_bot')) {
    name = ctx.message.text.replace('/instagram@highfive_kw1_bot', '').trim();
  } else {
    name = ctx.message.text.replace('/instagram', '').trim();
  }

  if (name.length <= 0) {
    if (ctx.message.reply_to_message) {
      name = ctx.message.reply_to_message.from.first_name;

      if (ctx.message.reply_to_message.from.last_name) {
        name += ` ${ctx.message.reply_to_message.from.last_name}`;
      }

      if (ctx.message.reply_to_message.from.is_bot) {
        return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err);
        });
      }
    
      if (ctx.message.reply_to_message.forward_from) {
        name = ctx.message.reply_to_message.forward_from.first_name;

        if (ctx.message.reply_to_message.forward_from.last_name) {
          name += ` ${ctx.message.reply_to_message.forward_from.last_name}`;
        }

        if (ctx.message.reply_to_message.forward_from.is_bot) {
          return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err);
          });
        }
      }
    }
  }

  if (name.length <= 0) {
    return ctx.reply('Mau cari instagram siapa ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  ctx.replyWithHTML(`Bentar dicari dulu <b>${name}</b>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    return ctx.reply('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  });

  const links = await axios.get(`https://gramuser.com/search/${name}`)
    .then(({ data }) => {
      const users = [];

      const $ = cheerio.load(data);
      const usersEl = $('.timg');

      usersEl.each((_, el) => {
        const username = $(el).attr('href').replace('http://gramuser.com/user/', '');
        const followers = $(el).html().replace(/,/gi, '').match(/([0-9,]+) followers/)[1];

        users.push({
          username,
          followers: parseInt(followers),
        });
      });

      return users;
    }).catch(() => {
      return ctx.reply('Service Down', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    })

  if (links.length > 0) {
    for (let u = 0;u < links.length; u += 1) {
      for (let i = 0;i < links.length; i += 1) {
        if (links[i + 1] && links[i].followers < links[i + 1].followers) {
          const a = links[i];
          links[i] = links[i + 1];
          links[i + 1] = a;
        }
      }
    }

    let users = [];

    for (let i = 0;i < links.length; i += 1) {
      users.push(`https://www.instagram.com/${links[i].username}`);
    }

    users = users.slice(0, 20);

    return ctx.reply(`Nemu nih ${users.length} akun\n\n${users.join("\n")}`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  return ctx.reply('Sorry gak nemu', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
};

bot.command('instagram', (ctx) => {
  findInstagram(ctx);
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

  if (ctx.message.reply_to_message && ctx.message.reply_to_message.from.username === 'highfive_kw1_bot' && ctx.message.reply_to_message.text === 'Mau cari instagram siapa ?') {
    findInstagram(ctx, ctx.message.text);
  }
});

bot.launch();