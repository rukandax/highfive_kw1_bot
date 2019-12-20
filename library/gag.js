const puppeteer = require("puppeteer");

async function kpop(ctx) {
  var type = "video";

  if (ctx.message.text.includes("/kpop@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/kpop@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/kpop", "").trim();
  }

  ctx
    .reply("Sebentar ya bos..", {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      console.log(err);
    });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();
    await page.goto("https://9gag.com/kpop", {
      timeout: 3000000
    });

    await page.waitForSelector(".list-stream");

    let previousHeight;
    let items = [];

    while (items.length < 10) {
      if (type === "image") {
        items = await page.evaluate(() => {
          const image = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container img"
          );

          imageElements.forEach(imageElement => {
            image.push(imageElement.getAttribute("src"));
          });

          return image;
        });
      } else {
        items = await page.evaluate(() => {
          const video = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container video source:nth-child(2)"
          );

          imageElements.forEach(imageElement => {
            if (imageElement.getAttribute("src").includes("mp4")) {
              video.push(imageElement.getAttribute("src"));
            }
          });

          return video;
        });
      }

      previousHeight = await page.evaluate("document.body.scrollHeight");

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    ctx
      .replyWithVideo(items[randomizedIndex], {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);

    ctx
      .reply("Fiturnya lagi rusak nih..", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }
}

async function nsfw(ctx) {
  var type = "video";

  if (ctx.message.text.includes("/kpop@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/kpop@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/kpop", "").trim();
  }

  ctx
    .reply("Sebentar ya bos..", {
      reply_to_message_id: ctx.message.message_id
    })
    .catch(err => {
      console.log(err);
    });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false
    });

    const page = await browser.newPage();
    await page.goto("https://9gag.com/nsfw", {
      timeout: 3000000
    });

    await page.waitForSelector("#jsid-login-button");
    await page.click("#jsid-login-button");

    await page.waitForSelector("#login-email-name");
    await page.type("#login-email-name", process.env.GAG_EMAIL);

    await page.waitForSelector("#login-email-password");
    await page.type("#login-email-password", process.env.GAG_PASS);

    await page.click("#login-email .btn");
    await page.waitForNavigation();

    let previousHeight;
    let items = [];

    while (items.length < 10) {
      if (type === "image") {
        items = await page.evaluate(() => {
          const image = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container img"
          );

          imageElements.forEach(imageElement => {
            image.push(imageElement.getAttribute("src"));
          });

          return image;
        });
      } else {
        items = await page.evaluate(() => {
          const video = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container video source:nth-child(2)"
          );

          imageElements.forEach(imageElement => {
            if (imageElement.getAttribute("src").includes("mp4")) {
              video.push(imageElement.getAttribute("src"));
            }
          });

          return video;
        });
      }

      previousHeight = await page.evaluate("document.body.scrollHeight");

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    ctx
      .replyWithVideo(items[randomizedIndex], {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);

    ctx
      .reply("Fiturnya lagi rusak nih..", {
        reply_to_message_id: ctx.message.message_id
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
