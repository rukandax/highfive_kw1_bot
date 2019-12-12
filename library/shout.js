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
    return ctx.replyWithPhoto(ctx.message.photo[ctx.message.photo.length - 1].file_id, { chat_id: process.env.TELEGRAM_GROUP })
      .then((res) => {
        ctx.replyWithHTML(`Berhasil mengirim pesan, gunakan perintah <code>/deleteshout ${jwt.sign(res.message_id, process.env.BOT_TOKEN)}</code> untuk menghapus pesan yang telah dikirim.\n\n<i>Hanya bisa menghapus pesan dengan durasi dibawah 48 jam.</i>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err)
        })

        ctx.replyWithPhoto(ctx.message.photo[ctx.message.photo.length - 1].file_id, { chat_id: process.env.CONTROL_AREA })
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

        ctx.replyWithSticker(ctx.message.sticker.file_id, { chat_id: process.env.CONTROL_AREA })
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

module.exports = {
  shout,
}