const axios = require("axios");
const cheerio = require("cheerio");

const findInstagram = async ctx => {
  let name = "";

  if (ctx.message.text.includes("/instagram@highfive_kw1_bot")) {
    name = ctx.message.text.replace("/instagram@highfive_kw1_bot", "").trim();
  } else {
    name = ctx.message.text.replace("/instagram", "").trim();
  }

  if (name.length <= 0) {
    if (ctx.message.reply_to_message) {
      name = ctx.message.reply_to_message.from.first_name;

      if (ctx.message.reply_to_message.from.last_name) {
        name += ` ${ctx.message.reply_to_message.from.last_name}`;
      }
    }
  }

  if (name.length <= 0) {
    return ctx
      .replyWithHTML("Mau cari instagram siapa ?", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  ctx
    .replyWithHTML(`Bentar dicari dulu <b>${name}</b>`, {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      return ctx
        .replyWithHTML("Nice try.", {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    });

  const links = await axios
    .get(`https://insta-stalkerr.com/search/?q=${name}`)
    .then(({ data }) => {
      const users = [];

      const $ = cheerio.load(data);
      const usersEl = $(".row:nth-child(3) .col-md-3 a");

      usersEl.each((_, el) => {
        const username = $(el)
          .attr("href")
          .replace("https://insta-stalkerr.com/profile/", "");
        users.push(username);
      });

      return users;
    })
    .catch(err => {
      console.log(err);

      return ctx
        .replyWithHTML("Service Down", {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    });

  if (links.length > 0) {
    let users = [];

    for (let i = 0; i < links.length; i += 1) {
      users.push(`https://www.instagram.com/${links[i]}`);
    }

    users = users.slice(0, 10);

    return ctx
      .replyWithHTML(`Nemu nih..\n\n${users.join("\n")}`, {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }

  return ctx
    .replyWithHTML("Sorry gak nemu", {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  findInstagram
};
