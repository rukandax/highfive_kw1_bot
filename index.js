process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

require('dotenv').config()

const fs = require('fs')
const Telegraf = require('telegraf')
const Schedule = require('node-schedule')
const axios = require('axios')
const puppeteer = require('puppeteer')
const { encode, decode } = require('jwt-simple')

const {
  greeting
} = require('./library/general')

const {
  findInstagram
} = require('./library/instagram')

const {
  getMostLikedIgPost
} = require('./library/mostlikedigpost')

const CORE_HOUR_END = '📢 Teet teet teet~ core hour udah berakhir~'

const bot = new Telegraf(process.env.BOT_TOKEN)

Schedule.scheduleJob('payday', '0 11 * * 1-5', () => {
  const today = new Date()

  const dayBeforePayday = new Date()
  dayBeforePayday.setDate(26)

  const payday = new Date()
  payday.setDate(27)
  
  if(payday.getDay() == 0) {
    dayBeforePayday.setDate(payday.getDate() - 3)
  } else if (payday.getDay() == 6) {
    dayBeforePayday.setDate(payday.getDate() - 2)
  }

  if (today.getDate() === dayBeforePayday.getDate()) {
    const message = '📢 Besok gajian gaesss~~'
    
    bot.telegram.sendMessage(-1001430743348, message).catch((err) => {
      console.log(err)
    })
  }
})

Schedule.scheduleJob('endCoreHour', '0 17 * * 1-5', () => {
  bot.telegram.sendMessage(-1001430743348, CORE_HOUR_END).catch((err) => {
    console.log(err)
  })
})

// let isWebDown = false
// Schedule.scheduleJob('upMonitor', '*/5 * * * *', () => {
//   const message = 'Bukalapak down ya ?'

//   axios.get('https://www.bukalapak.com/version.txt')
//     .then(({ data }) => {
//       if (data.trim().length === 40) {
//         isWebDown = false
//       } else {
//         if (!isWebDown) {
//           isWebDown = true
  
//           bot.telegram.sendMessage(-1001430743348, message).catch((err) => {
//             console.log(err)
//           })
//         }
//       }
//     })
//     .catch(() => {
//       if (!isWebDown) {
//         isWebDown = true

//         bot.telegram.sendMessage(-1001430743348, message).catch((err) => {
//           console.log(err)
//         })
//       }
//     })
// })

bot.start(greeting)
bot.command('help', greeting)
bot.command('instagram', findInstagram)
bot.command('mostlikedigpost', getMostLikedIgPost)

bot.command('beautymeter', (ctx) => {
  ctx.reply('Mana nih foto nya bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err)
  })
})

bot.command('shout', (ctx) => {
  ctx.replyWithHTML('Mau ngirim apa bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err)
  })
})

bot.command('deleteshout', (ctx) => {
  let text = ''

  if (ctx.message.text.includes('/deleteshout@highfive_kw1_bot')) {
    text = ctx.message.text.replace('/deleteshout@highfive_kw1_bot', '').trim()
  } else {
    text = ctx.message.text.replace('/deleteshout', '').trim()
  }

  if (!text.length) {
    return ctx.reply('Pesan yang mau dihapus tidak ditemukan. JWT masih kosong.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }

  let decoded = ''
  try {
    decoded = decode(text, process.env.BOT_TOKEN)
  } catch (_) {
    ctx.reply('Pesan yang mau dihapus tidak ditemukan. JWT tidak valid.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }

  if (decoded > 0) {
    return bot.telegram.deleteMessage(-1001430743348, parseInt(decoded)).catch(() => {
      ctx.reply('Pesan yang mau dihapus tidak ditemukan.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err)
      })
    })
  } else {
    console.log(decoded)
  }
})

bot.on('voice', async (ctx) => {
  if (ctx.message.voice && ctx.message.chat.type === 'private') {
    ctx.reply('Sebentar ya..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })

    const voiceLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

    let voiceExt = voiceLink.split('.')
    voiceExt = voiceExt[voiceExt.length - 1]
  
    const voicePath = await axios({
      url: voiceLink,
      method: 'GET',
      responseType: 'arraybuffer',
    }).then(({ data }) => {
      const outputFilename = `/tmp/highfive_kw1_bot_voice-${Date.now()}.${voiceExt}`
      fs.writeFileSync(outputFilename, data)
  
      return outputFilename
    })

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
    })
    const page = await browser.newPage()
  
    await page.setRequestInterception(true)
  
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().endsWith('.jpeg') || interceptedRequest.url().endsWith('.css'))
        interceptedRequest.abort()
      else
        interceptedRequest.continue()
    })

    await page.goto('https://www.audiospeedchanger.com/', {
      timeout: 6000000
    })
  
    const inputVoice = await page.$('#localfile')
    await inputVoice.uploadFile(voicePath)

    await page.$eval('#pitch', el => el.value = 8)
    await page.select('#audiomethod', '2')
    await page.$eval('#btnUpload', el => el.click())

    await page.waitForFunction(
      'document.querySelector(".alert.alert-success a") !== null',
    )

    const link = await page.evaluate(() => {
      return document.querySelector(".alert.alert-success a").getAttribute('href')
    })

    await browser.close()

    ctx.replyWithAudio(link, { chat_id: -1001430743348 })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })

        bot.telegram.sendAudio(process.env.CONTROL_AREA, link)
          .then(() => {
            bot.telegram.sendMessage(process.env.CONTROL_AREA, `Remove Command : /deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}`).catch((err) => {
              console.log(err)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })

    return ctx.reply('Suara mu lagi diupload, nanti dikabarin lagi kalo udah selesai', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    }).catch((err) => {
      console.log(err)
    })
  }
})

bot.on('photo', async (ctx) => {
  const photo = ctx.message.photo[2] || ctx.message.photo[1]
  
  if (!photo) {
    return ctx.reply('Duh mataku kelilipan 😷 coba kirimin lagi gambarnya', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mana nih foto nya bosque ??'
  ) {
    ctx.reply('Sebentar ya, aku perhatiin baik-baik dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  
    const photoLink = await ctx.telegram.getFileLink(photo.file_id)
  
    let photoExt = photoLink.split('.')
    photoExt = photoExt[photoExt.length - 1]
  
    const photoPath = await axios({
      url: photoLink,
      method: 'GET',
      responseType: 'arraybuffer',
    }).then(({ data }) => {
      const outputFilename = `/tmp/highfive_kw1_bot_image-${Date.now()}.${photoExt}`
      fs.writeFileSync(outputFilename, data)
  
      return outputFilename
    })
  
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
    })
    const page = await browser.newPage()
  
    await page.setRequestInterception(true)
  
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().endsWith('.jpeg') || interceptedRequest.url().endsWith('.css'))
        interceptedRequest.abort()
      else
        interceptedRequest.continue()
    })
  
    await page.goto('https://hotness.ai/', {
      timeout: 3000000
    })
  
    const input = await page.$('#imgFile')
    let score = 0
  
    if (input) {
      await input.uploadFile(photoPath)
      
      await page.waitForFunction(
        'document.querySelector("#hotText").innerText.includes("Your Attractiveness Score is") || document.querySelector("#hotText").innerText.includes("Error")',
      )
    
      score = await page.evaluate(() => {
        return document.querySelector("#hotText").innerText.replace('Your Attractiveness Score is ', '').replace(' out of 10', '')
      })
    } else {
      const selector = '.onp-sl-social-button-twitter-tweet'
  
      await page.$(selector)
      await page.evaluate((selector) => {
        const button = document.querySelector(selector)
  
        if (button) {
          button.click()
        }
      }, selector) 
  
      ctx.reply('Duh mataku kelilipan 😷 coba kirimin lagi gambarnya', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err)
      })
    }
  
    await browser.close()
  
    let response = 'Mukanya yang sebelah mana sih ? Gak jelas.. 😒'
  
    if (score >= 0) {
      response = '😨 Ihh.. Jelek.. 😨'
    }
  
    if (score >= 5) {
      response = 'Hmmm, biasa aja sih 😌 yang kayak gini mah pasaran'
    }
  
    if (score >= 7) {
      response = 'Lumayan lah.. Masih cocok dibawa-bawa ketemu mantan 😄'
    }
  
    if (score >= 9) {
      response = 'Kiw.. Kiw.. Bisa kali~~ 😎😍'
    }
  
    if (!isNaN(parseInt(score))) {
      response = `${response} .. ${parseInt(score)} ini`
    }
  
    return ctx.reply(response, { reply_to_message_id: ctx.message.message_id })
  }
})

bot.on('message', (ctx) => {
  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Mau cari instagram siapa ?'
  ) {
    findInstagram(ctx, ctx.message.text)
  }

  if (
    ctx.message.reply_to_message
      &&
    ctx.message.reply_to_message.from.username === 'highfive_kw1_bot'
      &&
    ctx.message.reply_to_message.text === 'Username instagram nya siapa ?'
  ) {
    getMostLikedIgPost(ctx, ctx.message.text)
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

    if (ctx.message.animation) {
      return ctx.replyWithAnimation(ctx.message.animation.file_id, { chat_id: -1001430743348 })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })

          bot.telegram.sendAnimation(process.env.CONTROL_AREA, ctx.message.animation.file_id)
            .then(() => {
              bot.telegram.sendMessage(process.env.CONTROL_AREA, `Remove Command : /deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}`).catch((err) => {
                console.log(err)
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    if (ctx.message.sticker) {
      return ctx.replyWithSticker(ctx.message.sticker.file_id, { chat_id: -1001430743348 })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })

          bot.telegram.sendSticker(process.env.CONTROL_AREA, ctx.message.sticker.file_id)
            .then(() => {
              bot.telegram.sendMessage(process.env.CONTROL_AREA, `Remove Command : /deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}`).catch((err) => {
                console.log(err)
              })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    if (ctx.message.text) {
      return ctx.reply(`${ctx.message.text}`, { chat_id: -1001430743348 })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })
  
          bot.telegram.sendMessage(process.env.CONTROL_AREA, `${res.text}\n\nRemove Command : /deleteshout ${encode(res.message_id, process.env.BOT_TOKEN)}`).catch((err) => {
            console.log(err)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return ctx.reply('Format belum didukung untuk shout', { reply_to_message_id: ctx.message.message_id })
  }
})

bot.launch()
