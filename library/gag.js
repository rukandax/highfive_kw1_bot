const { union } = require("lodash");

const fs = require("fs").promises;
const axios = require("axios");

async function kpop(ctx) {
  let type = "image";
  let contentType = "Photo";

  if (ctx.message.text.includes("/kpop@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/kpop@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/kpop", "").trim();
  }

  if (type === "video") {
    contentType = "Animated";
  }

  ctx
    .replyWithHTML("Sebentar ya bos.. Bisa juga <code>/kpop video</code>", {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      console.log(err);
    });

  let next = "";
  let items = [];

  while (items.length < 50) {
    const collected = await axios
      .get(`https://9gag.com/v1/group-posts/group/kpop/type/hot?${next}`)
      .then(({ data }) => {
        next = data.data.nextCursor;
        return data.data.posts.filter(post => post.type === contentType);
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

    items = union(items, collected);
  }

  let lastItemPersist = await fs.readFile("./gg");
  let lastItem = JSON.parse(lastItemPersist);

  randomizedIndex = parseInt(Math.random() * items.length);

  while (lastItem.includes(items[randomizedIndex].id)) {
    randomizedIndex = parseInt(Math.random() * items.length);
  }

  lastItem.push(items[randomizedIndex].id);

  if (lastItem.length >= 49) {
    lastItem.shift();
  }

  await fs.writeFile("./gg", JSON.stringify(lastItem, null, 2));

  if (contentType === "Photo") {
    ctx
      .replyWithPhoto(items[randomizedIndex].images.image700.url, {
        caption: items[randomizedIndex].title
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (contentType === "Animated") {
    ctx
      .replyWithVideo(items[randomizedIndex].images.image460sv.url, {
        caption: items[randomizedIndex].title
      })
      .catch(err => {
        console.log(err);
      });
  }
}

async function nsfw(ctx) {
  let type = "image";
  let contentType = "Photo";

  if (ctx.message.text.includes("/nsfw@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/nsfw@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/nsfw", "").trim();
  }

  if (type === "video") {
    contentType = "Animated";
  }

  ctx
    .replyWithHTML("Sebentar ya bos.. Bisa juga <code>/nsfw video</code>", {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      console.log(err);
    });

  let next = "";
  let items = [];

  while (items.length < 50) {
    const collected = await axios
      .get(`https://9gag.com/v1/group-posts/group/nsfw/type/hot?${next}`)
      .then(({ data }) => {
        next = data.data.nextCursor;
        return data.data.posts.filter(post => post.type === contentType);
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

    items = union(items, collected);
  }

  let lastItemPersist = await fs.readFile("./gg");
  let lastItem = JSON.parse(lastItemPersist);

  randomizedIndex = parseInt(Math.random() * items.length);

  while (lastItem.includes(items[randomizedIndex].id)) {
    randomizedIndex = parseInt(Math.random() * items.length);
  }

  lastItem.push(items[randomizedIndex].id);

  if (lastItem.length >= 49) {
    lastItem.shift();
  }

  await fs.writeFile("./gg", JSON.stringify(lastItem, null, 2));

  if (contentType === "Photo") {
    ctx
      .replyWithPhoto(items[randomizedIndex].images.image700.url, {
        caption: items[randomizedIndex].title
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (contentType === "Animated") {
    ctx
      .replyWithVideo(items[randomizedIndex].images.image460sv.url, {
        caption: items[randomizedIndex].title
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = {
  kpop,
  nsfw
};
