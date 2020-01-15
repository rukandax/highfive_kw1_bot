process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();

const Telegraf = require("telegraf");
const Schedule = require("node-schedule");

const { shout } = require("./library/shout");
const { greeting } = require("./library/general");
const { findInstagram } = require("./library/instagram");
const { getMostLikedIgPost } = require("./library/mostlikedigpost");
const { kpop, nsfw } = require("./library/gag");
const { pap } = require("./library/pap");

const CORE_HOUR_END = "📢 Teet teet teet~ core hour udah berakhir~";

const bot = new Telegraf(process.env.BOT_TOKEN);

Schedule.scheduleJob("payday", "0 11 * * 1-5", () => {
  const today = new Date();

  const dayBeforePayday = new Date();
  dayBeforePayday.setDate(26);

  const payday = new Date();
  payday.setDate(27);

  if (payday.getDay() == 0) {
    dayBeforePayday.setDate(payday.getDate() - 3);
  } else if (payday.getDay() == 6) {
    dayBeforePayday.setDate(payday.getDate() - 2);
  }

  if (today.getDate() === dayBeforePayday.getDate()) {
    const message = "📢 Besok gajian gaesss~~";

    bot.telegram.sendMessage(process.env.TELEGRAM_GROUP, message).catch(err => {
      console.log(err);
    });
  }
});

Schedule.scheduleJob("endCoreHour", "0 17 * * 1-5", () => {
  bot.telegram
    .sendMessage(process.env.TELEGRAM_GROUP, CORE_HOUR_END)
    .catch(err => {
      console.log(err);
    });
});

bot.start(greeting);
bot.command("help", greeting);

bot.command("instagram", ctx => {
  findInstagram(ctx);
});

bot.command("mostlikedigpost", ctx => {
  getMostLikedIgPost(ctx);
});

bot.command("kpop", ctx => {
  kpop(ctx);
});

bot.command("nsfw", ctx => {
  nsfw(ctx);
});

bot.command("paptt", ctx => {
  pap(ctx);
});

bot.command("shout", shout);

bot.command("deleteshout", async ctx => {
  let text = "";

  if (ctx.message.text.includes("/deleteshout@highfive_kw1_bot")) {
    text = ctx.message.text.replace("/deleteshout@highfive_kw1_bot", "").trim();
  } else {
    text = ctx.message.text.replace("/deleteshout", "").trim();
  }

  if (!text.length) {
    return ctx
      .reply("Pesan yang mau dihapus tidak ditemukan. JWT masih kosong.", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  let decoded = "";
  try {
    decoded = await jwt.verify(
      text,
      process.env.BOT_TOKEN,
      (_, payload) => payload
    );
  } catch (err) {
    ctx
      .reply("Pesan yang mau dihapus tidak ditemukan. JWT tidak valid.", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (decoded.length) {
    return bot.telegram
      .deleteMessage(process.env.TELEGRAM_GROUP, parseInt(decoded))
      .then(() => {
        ctx
          .reply("Berhasil menghapus pesan.", {
            reply_to_message_id: ctx.message.message_id
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(() => {
        ctx
          .reply("Pesan yang mau dihapus tidak ditemukan.", {
            reply_to_message_id: ctx.message.message_id
          })
          .catch(err => {
            console.log(err);
          });
      });
  }
});

bot.command("paymentsuccess", ctx => {
  let messageId = "";

  if (ctx.message.text.includes("/paymentsuccess@highfive_kw1_bot")) {
    messageId = ctx.message.text
      .replace("/paymentsuccess@highfive_kw1_bot", "")
      .trim();
  } else {
    messageId = ctx.message.text.replace("/paymentsuccess", "").trim();
  }

  if (messageId.length <= 0) {
    return ctx
      .replyWithHTML("Message ID tidak boleh kosong", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  return ctx
    .replyWithHTML(
      `@${ctx.message.from.username} (${ctx.message.chat.id}) melakukan konfirmasi pembayaran dengan message_id <code>${messageId}</code>`,
      { chat_id: process.env.CONTROL_PERSON }
    )
    .catch(err => {
      console.log(err);
    });
});

bot.command("directshout", ctx => {
  if (ctx.message.from.id.toString() !== process.env.CONTROL_PERSON) {
    return ctx
      .reply("Anda tidak di izinkan menggunakan perintah ini !!!", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  let text = "";

  if (ctx.message.text.includes("/directshout@highfive_kw1_bot")) {
    text = ctx.message.text.replace("/directshout@highfive_kw1_bot", "").trim();
  } else {
    text = ctx.message.text.replace("/directshout", "").trim();
  }

  if (text.length <= 0) {
    return ctx
      .replyWithHTML("Text tidak boleh kosong", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  const chatId = text.split(" ")[0];
  text = text.slice(1).join(" ");

  if (chatId && text) {
    ctx.reply(`${text}`, { chat_id: chatId }).catch(err => {
      console.log(err);
    });

    return ctx
      .reply("Berhasil !!", { reply_to_message_id: ctx.message.message_id })
      .catch(err => {
        console.log(err);
      });
  } else {
    return ctx
      .reply("Gagal !!", { reply_to_message_id: ctx.message.message_id })
      .catch(err => {
        console.log(err);
      });
  }
});

bot.on("message", ctx => {
  if (ctx.message.text) {
    ctx.message.text.trim();

    while (ctx.message.text.includes("  ")) {
      ctx.message.text = ctx.message.text.replace("  ", " ");
    }
  }

  if (
    ctx.message.chat.type === "private" &&
    ctx.message.text &&
    ctx.message.forward_from &&
    ctx.message.forward_from.username === "highfive_kw1_bot"
  ) {
    ctx
      .replyWithHTML(
        `<b>Apa anda ingin mengetahui siapa pengirim pesan ini ?</b>\n\nLakukan pembayaran senilai <b>Rp 50.${ctx.message.message_id
          .toString()
          .substr(
            ctx.message.message_id.toString().length - 3
          )}</b> ke:\n\nCIMB Niaga : <code>230950000000001610</code>\nBCA : <code>103005000000001610</code>\nBank Permata : <code>8330500000001610</code>\nBNI : <code>8255500000001609</code>\nBRI : <code>100535000000001609</code>\nBank Mandiri : <code>8932550000001609</code>\n\n----\n\nLalu kirim perintah <code>/paymentsuccess ${
          ctx.message.message_id
        }</code> setelah melakukan pembayaran`,
        { reply_to_message_id: ctx.message.message_id }
      )
      .catch(err => {
        console.log(err);
      });

    ctx
      .replyWithHTML(
        `@${ctx.message.from.username} (${ctx.message.chat.id}) mencoba membuka pesan dengan teks <code>${ctx.message.text}</code> dan message_id <code>${ctx.message.message_id}</code>`,
        { chat_id: process.env.CONTROL_PERSON }
      )
      .catch(err => {
        console.log(err);
      });
  }

  if (
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.from.username === "highfive_kw1_bot" &&
    ctx.message.reply_to_message.text === "Mau cari instagram siapa ?"
  ) {
    findInstagram(ctx);
  }

  if (
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.from.username === "highfive_kw1_bot" &&
    ctx.message.reply_to_message.text === "Username instagram nya siapa ?"
  ) {
    getMostLikedIgPost(ctx);
  }

  if (
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.from.username === "highfive_kw1_bot" &&
    ctx.message.reply_to_message.text === "Mau ngirim apa bosque ??"
  ) {
    shout(ctx);
  }
});

bot.launch();
