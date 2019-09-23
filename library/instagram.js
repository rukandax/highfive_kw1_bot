const axios = require('axios');
const cheerio = require('cheerio');

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
        return ctx.replyWithHTML('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
          console.log(err);
        });
      }
    
      if (ctx.message.reply_to_message.forward_from) {
        name = ctx.message.reply_to_message.forward_from.first_name;

        if (ctx.message.reply_to_message.forward_from.last_name) {
          name += ` ${ctx.message.reply_to_message.forward_from.last_name}`;
        }

        if (ctx.message.reply_to_message.forward_from.is_bot) {
          return ctx.replyWithHTML('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
            console.log(err);
          });
        }
      }
    }
  }

  if (name.length <= 0) {
    return ctx.replyWithHTML('Mau cari instagram siapa ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  ctx.replyWithHTML(`Bentar dicari dulu <b>${name}</b>`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    return ctx.replyWithHTML('Nice try.', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  });

  const links = await axios.get(`https://gramusers.com/search/${name}`)
    .then(({ data }) => {
      const users = [];

      const $ = cheerio.load(data);
      const usersEl = $('.timg');

      usersEl.each((_, el) => {
        const username = $(el).attr('href').replace('http://gramusers.com/user/', '');

        const suffixes = ["", "k", "m", "b","t"];

        let followers = $(el).html().match(/([0-9.kmbt]+) follower/)[1];

        suffixes.forEach((abbr) => {
          if (typeof followers === 'string' && followers.includes(abbr)) {
            if (abbr === 'k') {
              followers = followers.replace(abbr, '');
              followers = parseInt(followers) * 1000;
            }

            if (abbr === 'm') {
              followers = followers.replace(abbr, '');
              followers = parseInt(followers) * 1000000;
            }

            if (abbr === 'b') {
              followers = followers.replace(abbr, '');
              followers = parseInt(followers) * 1000000000;
            }

            if (abbr === 't') {
              followers = followers.replace(abbr, '');
              followers = parseInt(followers) * 1000000000000;
            }
          }
        })

        users.push({
          username,
          followers: parseInt(followers),
        });
      });

      return users;
    }).catch((err) => {
      console.log(err);

      return ctx.replyWithHTML('Service Down', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
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

    return ctx.replyWithHTML(`Nemu nih ${users.length} akun\n\n${users.join("\n")}`, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  return ctx.replyWithHTML('Sorry gak nemu', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  findInstagram,
}