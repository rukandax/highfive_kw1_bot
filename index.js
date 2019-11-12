process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();

const fs = require('fs');
const Telegraf = require('telegraf');
const Schedule = require('node-schedule')
const axios = require('axios');
const puppeteer = require('puppeteer');
const { encode, decode } = require('jwt-simple');

const {
  greeting
} = require('./library/general');

const {
  findInstagram
} = require('./library/instagram');

const {
  getMostLikedIgPost
} = require('./library/mostlikedigpost');

const CORE_HOUR_END = '📢 Teet teet teet~ core hour udah berakhir~';

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
    
    bot.telegram.sendMessage(-320872691, message).catch((err) => {
      console.log(err);
    });
  }
});

Schedule.scheduleJob('endCoreHour', '0 17 * * 1-5', () => {
  bot.telegram.sendMessage(-320872691, CORE_HOUR_END).catch((err) => {
    console.log(err);
  });
})

let isWebDown = false;
Schedule.scheduleJob('upMonitor', '*/5 * * * *', () => {
  const message = 'Bukalapak down ya ?'

  axios.get('https://www.bukalapak.com/version.txt')
    .then(({ data }) => {
      if (data.trim().length === 40) {
        isWebDown = false;
      } else {
        if (!isWebDown) {
          isWebDown = true;
  
          bot.telegram.sendMessage(-320872691, message).catch((err) => {
            console.log(err);
          });
        }
      }
    })
    .catch(() => {
      if (!isWebDown) {
        isWebDown = true;

        bot.telegram.sendMessage(-320872691, message).catch((err) => {
          console.log(err);
        });
      }
    });
})

bot.start(greeting);
bot.command('help', greeting);
bot.command('instagram', findInstagram);
bot.command('mostlikedigpost', getMostLikedIgPost);

bot.command('givedanakaget', (ctx) => {
  let link = '';

  if (ctx.message.text.includes('/givedanakaget@highfive_kw1_bot')) {
    link = ctx.message.text.replace('/givedanakaget@highfive_kw1_bot', '').trim();
  } else {
    link = ctx.message.text.replace('/givedanakaget', '').trim();
  }

  if (!link.length) {
    return ctx.reply('Mana nih link nya ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  axios.post(`${process.env.API_URL}/savedanakaget`, { link })
    .then(({ data }) => {
      ctx.replyWithHTML(`Berhasil menambah DANA KAGET\n\nGunakan perintah <code>/deletedanakaget ${encode(data.id, process.env.BOT_TOKEN)}</code> untuk menghapus link DANA KAGET yang telah dikirim.`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    })
    .catch(() => {
      ctx.reply('Gagal menyimpan DANA KAGET, mungkin link yang sama sudah tersimpan atau service sedang down.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    });
});

bot.command('deletedanakaget', (ctx) => {
  let id = '';

  if (ctx.message.text.includes('/deletedanakaget@highfive_kw1_bot')) {
    id = ctx.message.text.replace('/deletedanakaget@highfive_kw1_bot', '').trim();
  } else {
    id = ctx.message.text.replace('/deletedanakaget', '').trim();
  }

  if (!id.length) {
    return ctx.reply('Mana nih ID nya ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  let decoded = '';

  try {
    decoded = decode(id, process.env.BOT_TOKEN);
  } catch (_) {
    ctx.reply('Gagal menghapus DANA KAGET, ID tidak valid.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  axios.get(`${process.env.API_URL}/removedanakaget`, { params: { id: decoded } })
    .then((res) => {
      ctx.replyWithHTML(`Berhasil menghapus DANA KAGET.`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    })
    .catch(() => {
      ctx.reply('Gagal menghapus DANA KAGET, mungkin data sudah terhapus atau service sedang down.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    });
});

bot.command('beautymeter', (ctx) => {
  ctx.reply('Mana nih foto nya bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
})

bot.command('shout', (ctx) => {
  ctx.replyWithHTML('Mau ngirim apa bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
})

bot.command('deleteshout', (ctx) => {
  let text = '';

  if (ctx.message.text.includes('/deleteshout@highfive_kw1_bot')) {
    text = ctx.message.text.replace('/deleteshout@highfive_kw1_bot', '').trim();
  } else {
    text = ctx.message.text.replace('/deleteshout', '').trim();
  }

  if (!text.length) {
    return ctx.reply('Mau hapus yang mana bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  let decoded = '';
  try {
    decoded = decode(text, process.env.BOT_TOKEN);
  } catch (_) {
    ctx.reply('Pesan yang mau dihapus tidak ditemukan. JWT tidak valid.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  if (decoded > 0) {
    return bot.telegram.deleteMessage(-320872691, parseInt(decoded)).catch((err) => {
      ctx.reply('Pesan yang mau dihapus tidak ditemukan.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    });
  } else {
    console.log(decoded);
  }
})

bot.on('message', (ctx) => {
  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === CORE_HOUR_END
  ) {
    axios.get(`${process.env.API_URL}/getdanakaget`)
      .then(({ data }) => {
        ctx.replyWithHTML(`Selamat Anda terpilih menjadi replier tercepat. Hadiah dikirim via japri.`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err);
        });

        ctx.replyWithHTML(`Selamat Anda terpilih menjadi replier tercepat, silahkan klaim hadiah Anda disini ${data.link} \n\nJangan bagikan link ini ke orang lain.`, { chat_id: ctx.message.from.id });
      })
      .catch(() => {});
  }
});

bot.on('photo', async (ctx) => {
  const photo = ctx.message.photo[2] || ctx.message.photo[1]
  
  if (!photo) {
    return ctx.reply('Duh mataku kelilipan 😷 coba kirimin lagi gambarnya', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mana nih foto nya bosque ??'
  ) {
    ctx.reply('Sebentar ya, aku perhatiin baik-baik dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  
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
  }
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

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Username instagram nya siapa ?'
  ) {
    getMostLikedIgPost(ctx, ctx.message.text);
  }

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mau ngirim apa bosque ??'
  ) {
    if (ctx.message.text === CORE_HOUR_END) {
      return ctx.reply('Dilarang shout core hour berakhir !!!', { reply_to_message_id: ctx.message.message_id })
    }

    return ctx.reply(`${ctx.message.text}`, { chat_id: 0 })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err);
        });

        bot.telegram.sendMessage(process.env.CONTROL_AREA, `${res.text}\n\nRemove Command : /deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}`).catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mau hapus yang mana bosque ??'
  ) {
    let decoded = '';
    try {
      decoded = decode(ctx.message.text, process.env.BOT_TOKEN);
    } catch (_) {
      ctx.reply('Pesan yang mau dihapus tidak ditemukan. JWT tidak valid.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err);
      });
    }

    if (decoded > 0) {
      return bot.telegram.deleteMessage(-320872691, parseInt(decoded)).catch((err) => {
        ctx.reply('Pesan yang mau dihapus tidak ditemukan.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err);
        });
      });
    } else {
      console.log(decoded);
    }
  }
});

bot.launch();
