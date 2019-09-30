process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();

const fs = require('fs');
const Telegraf = require('telegraf');
const Schedule = require('node-schedule')
const axios = require('axios');
const ping = require('web-pingjs');
const puppeteer = require('puppeteer');

const {
  greeting
} = require('./library/general');

const {
  findInstagram
} = require('./library/instagram');

const bot = new Telegraf(process.env.BOT_TOKEN);

Schedule.scheduleJob('payday', '0 11 * * 1-5', () => {
  const today = new Date();

  const dayBeforePayday = new Date();
  dayBeforePayday.setDate(26);

  const payday = new Date();
  payday.setDate(27);
  
  if(payday.getDay() == 0) {
    dayBeforePayday.setDate(payday.getDate() - 3);
  } else if (payday.getDay() == 6) {
    dayBeforePayday.setDate(payday.getDate() - 2);
  }

  if (today.getDate() === dayBeforePayday.getDate()) {
    const message = '📢 Besok gajian gaesss~~';
    
    bot.telegram.sendMessage(-1001113266099, message).catch((err) => {
      console.log(err);
    });
  }
});

Schedule.scheduleJob('endCoreHour', '0 17 * * 1-5', () => {
  const message = '📢 Teet teet teet~ core hour udah berakhir~'

  bot.telegram.sendMessage(-1001113266099, message).catch((err) => {
    console.log(err);
  });
})

let isWebDown = false;
Schedule.scheduleJob('upMonitor', '*/5 * * * *', () => {
  const message = 'Bukalapak down ya ?'

  ping('https://www.bukalapak.com/version.txt')
    .then(() => {
      isWebDown = false;
    })
    .catch(() => {
      if (!isWebDown) {
        isWebDown = true;

        bot.telegram.sendMessage(-1001113266099, message).catch((err) => {
          console.log(err);
        });
      }
    });
})

bot.start(greeting);
bot.command('help', greeting);

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
    return ctx.replyWithHTML('Format salah, gunakan format highfive seperti biasa tanpa kode kategori.\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
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

  ctx.replyWithHTML('<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });

  const output = `${type} highfive! @${ctx.message.from.username} berbagi ${users.length > 1 ? 'masing-masing ' : ''}<b>${poin}</b> poin untuk:\n${users.join('\n')}\nkarena <b>${message.trim()}</b>\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>`;

  return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
    .catch(() => {
      return ctx.replyWithHTML('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    });
});

bot.command('givepoint', (ctx) => {
  let message = '';
  let text = '';

  if (ctx.message.text.includes('/givepoint@highfive_kw1_bot')) {
    text = ctx.message.text.replace('/givepoint@highfive_kw1_bot', '').trim();
  } else {
    text = ctx.message.text.replace('/givepoint', '').trim();
  }

  let textArray = text.split(' ');

  if (!textArray[0].includes('@')) {
    return ctx.replyWithHTML('User tidak ditemukan, gunakan format givepoint seperti biasa tanpa kode kategori.\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  message = textArray.slice(1).join(' ');

  if (message.length < 2) {
    return ctx.replyWithHTML('Pesan tidak boleh kosong, gunakan format givepoint seperti biasa tanpa kode kategori.\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
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

  const output = `${ctx.message.from.first_name ? ctx.message.from.first_name : ''} ${ctx.message.from.last_name ? ctx.message.from.last_name : ''} (@${ctx.message.from.username}) abis cerita sama Anak Ibu Susi kalau ${textArray[0]} udah ${message}. ${endTexts[endTextsIndex]}\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>`;

  ctx.replyWithHTML('<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });

  return ctx.replyWithHTML(output, { chat_id: -1001113266099 })
    .catch((err) => {
      console.log(err);
    });
});

bot.command('instagram', (ctx) => {
  findInstagram(ctx);
});

bot.command('beautymeter', (ctx) => {
  ctx.reply('Sip, kirimin aja foto nya bosque..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
})

bot.on('photo', async (ctx) => {
  if (
    !ctx.message.reply_to_message
      ||
    ctx.message.reply_to_message.from.username !== 'highfive_kw1_bot'
  ) return;

  ctx.reply('Sebentar ya, aku perhatiin baik-baik dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });

  const photo = ctx.message.photo[2] || ctx.message.photo[1]

  if (!photo) {
    return ctx.reply('Duh mataku kelilipan 😷 coba kirimin lagi gambarnya', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  const photoLink = await ctx.telegram.getFileLink(photo.file_id)

  let photoExt = photoLink.split('.');
  photoExt = photoExt[photoExt.length - 1];

  const photoPath = await axios({
    url: photoLink,
    method: 'GET',
    responseType: 'arraybuffer',
  }).then(({ data }) => {
    const outputFilename = `/tmp/highfive_kw1_bot_image.${photoExt}`;
    fs.writeFileSync(outputFilename, data);

    return outputFilename;
  });

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().endsWith('.jpeg') || interceptedRequest.url().endsWith('.css'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  });

  await page.goto('https://hotness.ai/', {
    timeout: 3000000
  });

  const input = await page.$('#imgFile')
  let score = 0;

  if (input) {
    await input.uploadFile(photoPath)
    
    await page.waitForFunction(
      'document.querySelector("#hotText").innerText.includes("Your Attractiveness Score is") || document.querySelector("#hotText").innerText.includes("Error")',
    );
  
    score = await page.evaluate(() => {
      return document.querySelector("#hotText").innerText.replace('Your Attractiveness Score is ', '').replace(' out of 10', '');
    });
  } else {
    const selector = '.onp-sl-social-button-twitter-tweet';

    await page.$(selector)
    await page.evaluate((selector) => {
      const button = document.querySelector(selector)

      if (button) {
        button.click()
      }
    }, selector); 

    ctx.reply('Duh mataku kelilipan 😷 coba kirimin lagi gambarnya', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  await browser.close();

  let response = 'Mukanya yang sebelah mana sih ? Gak jelas.. 😒';

  if (score >= 0) {
    response = '😨 Ihh.. Jelek.. 😨';
  }

  if (score >= 5) {
    response = 'Hmmm, biasa aja sih 😌 yang kayak gini mah pasaran';
  }

  if (score >= 7) {
    response = 'Lumayan lah.. Masih cocok dibawa-bawa ketemu mantan 😄';
  }

  if (score >= 9) {
    response = 'Kiw.. Kiw.. Bisa kali~~ 😎😍';
  }

  if (!isNaN(parseInt(score))) {
    response = `${response} .. ${parseInt(score)} ini`
  }

  return ctx.reply(response, { reply_to_message_id: ctx.message.message_id })
})

bot.hears(/./gi, (ctx) => {
  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mau cari instagram siapa ?'
  ) {
    findInstagram(ctx, ctx.message.text);
  }
});

bot.launch();
