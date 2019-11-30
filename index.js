process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

require('dotenv').config()

const Telegraf = require('telegraf')
const Schedule = require('node-schedule')
const axios = require('axios')
const jwt = require('jsonwebtoken')

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
    
    bot.telegram.sendMessage(process.env.TELEGRAM_GROUP, message).catch((err) => {
      console.log(err)
    })
  }
})

Schedule.scheduleJob('endCoreHour', '0 17 * * 1-5', () => {
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP, CORE_HOUR_END).catch((err) => {
    console.log(err)
  })
})

let isWebDown = false
Schedule.scheduleJob('upMonitor', '*/5 * * * *', () => {
  const message = 'Bukalapak down ya ?'

  axios.get('https://www.bukalapak.com/version.txt')
    .then(({ data }) => {
      if (data.trim().length === 40) {
        isWebDown = false
      } else {
        if (!isWebDown) {
          isWebDown = true
  
          bot.telegram.sendMessage(process.env.TELEGRAM_GROUP, message).catch((err) => {
            console.log(err)
          })
        }
      }
    })
    .catch(() => {
      if (!isWebDown) {
        isWebDown = true

        bot.telegram.sendMessage(process.env.TELEGRAM_GROUP, message).catch((err) => {
          console.log(err)
        })
      }
    })
})

bot.start(greeting)
bot.command('help', greeting)
bot.command('instagram', findInstagram)
bot.command('mostlikedigpost', getMostLikedIgPost)

bot.command('shout', (ctx) => {
  ctx.replyWithHTML('Mau ngirim apa bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err)
  })
})

bot.command('deleteshout', async (ctx) => {
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
    decoded = await jwt.verify(text, process.env.BOT_TOKEN, (_, payload) => payload)
  } catch (err) {
    ctx.reply('Pesan yang mau dihapus tidak ditemukan. JWT tidak valid.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }

  if (decoded.length) {
    return bot.telegram.deleteMessage(process.env.TELEGRAM_GROUP, parseInt(decoded))
      .then(() => {
        ctx.reply('Berhasil menghapus pesan.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })
      })
      .catch(() => {
        ctx.reply('Pesan yang mau dihapus tidak ditemukan.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })
      })
  }
})

bot.on('message', (ctx) => {
  if (ctx.message.text) {
    ctx.message.text.trim()
    
    while (ctx.message.text.includes('  ')) {
      ctx.message.text = ctx.message.text.replace('  ', ' ')
    }
  }

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
      return ctx.reply('Dilarang shout kalimat ini !!!', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err)
      })
    }

    if (ctx.message.animation) {
      return ctx.replyWithAnimation(ctx.message.animation.file_id, { chat_id: process.env.TELEGRAM_GROUP })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })

          ctx.replyWithAnimation(ctx.message.animation.file_id, { chat_id: process.env.CONTROL_AREA })
            .then(() => {
              ctx.replyWithHTML(`Payload : <code>${jwt.sign(ctx.message, process.env.BOT_TOKEN)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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
      return ctx.replyWithSticker(ctx.message.sticker.file_id, { chat_id: process.env.TELEGRAM_GROUP })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })

          bot.telegram.sendSticker(process.env.CONTROL_AREA, ctx.message.sticker.file_id)
            .then(() => {
              ctx.replyWithHTML(`Payload : <code>${jwt.sign(ctx.message, process.env.BOT_TOKEN)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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
      return ctx.reply(`${ctx.message.text}`, { chat_id: process.env.TELEGRAM_GROUP })
        .then((res) => {
          ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err)
          })

          ctx.replyWithHTML(`Payload : <code>${jwt.sign(ctx.message, process.env.BOT_TOKEN)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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
