const jwt = require('jsonwebtoken')

function shout(ctx) {
  if (ctx.message.text) {
    let message = ''

    if (ctx.message.text.includes('/shout@highfive_kw1_bot')) {
      message = ctx.message.text.replace('/shout@highfive_kw1_bot', '').trim()
    } else {
      message = ctx.message.text.replace('/shout', '').trim()
    }

    if (message.length <= 0) {
      return ctx.replyWithHTML('Mau ngirim apa bosque ??', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err)
      })
    }

    if (message === '📢 Teet teet teet~ core hour udah berakhir~') {
      return ctx.reply('Dilarang shout kalimat ini !!!', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
        console.log(err)
      })
    }

    return ctx.reply(`${message}`, { chat_id: process.env.TELEGRAM_GROUP })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })

        ctx.replyWithHTML(`Payload : <code>${JSON.stringify(ctx.message)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (ctx.message.photo) {
    return ctx.replyWithPhoto(ctx.message.photo.file_id, { chat_id: process.env.TELEGRAM_GROUP })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })

        ctx.replyWithPhoto(ctx.message.photo.file_id, { chat_id: process.env.CONTROL_AREA })
          .then(() => {
            ctx.replyWithHTML(`Payload : <code>${JSON.stringify(ctx.message)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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

  if (ctx.message.animation) {
    return ctx.replyWithAnimation(ctx.message.animation.file_id, { chat_id: process.env.TELEGRAM_GROUP })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })

        ctx.replyWithAnimation(ctx.message.animation.file_id, { chat_id: process.env.CONTROL_AREA })
          .then(() => {
            ctx.replyWithHTML(`Payload : <code>${JSON.stringify(ctx.message)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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
            ctx.replyWithHTML(`Payload : <code>${JSON.stringify(ctx.message)}</code>\n\nRemove Command : <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code>`, { chat_id: process.env.CONTROL_AREA }).catch((err) => {
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

  return ctx.reply('Format belum didukung untuk shout', { reply_to_message_id: ctx.message.message_id })
}

async function deleteshout(ctx) {
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
}

module.exports = {
  shout,
  deleteshout,
}