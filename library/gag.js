const { union } = require("lodash");
const { PendingXHR } = require("pending-xhr-puppeteer");

const fs = require("fs").promises;
const puppeteer = require("puppeteer");

let instanceRunning = false;

async function nsfw(ctx) {
  if (instanceRunning) {
    return ctx
      .replyWithHTML(
        "Masih ada proses lain yang belum selesai, coba lagi nanti..",
        {
          reply_to_message_id: ctx.message.message_id
        }
      )
      .catch(err => {
        console.log(err);
      });
  } else {
    instanceRunning = true;
  }

  let type;

  if (ctx.message.text.includes("/nsfw@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/nsfw@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/nsfw", "").trim();
  }

  if (type !== "video") {
    type = "image";
  }

  ctx
    .replyWithHTML("Sebentar ya bos.. Bisa juga <code>/nsfw video</code>", {
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
    const pendingXHR = new PendingXHR(page);

    await page.setViewport({
      width: 1080,
      height: 2280
    });

    let cookiesString = await fs.readFile("./cg");
    let cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    await page.goto("https://9gag.com/nsfw/fresh");

    const isLogin = await page.evaluate(() => {
      const userFunction = document.querySelector("#jsid-user-function");
      return !userFunction.classList.contains("hide");
    });

    if (!isLogin) {
      await page.waitForSelector("#jsid-login-button");
      await page.click("#jsid-login-button");

      await page.waitForSelector("#login-email-name");
      await page.type("#login-email-name", process.env.GAG_EMAIL);

      await page.waitForSelector("#login-email-password");
      await page.type("#login-email-password", process.env.GAG_PASS);

      await page.click("#login-email .btn");
      await page.waitForSelector(".list-stream");
    }

    cookies = await page.cookies();
    await fs.writeFile("./cg", JSON.stringify(cookies, null, 2));

    let items = [];

    while (items.length < 25) {
      if (type === "image") {
        const collected = await page.evaluate(() => {
          const image = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container img"
          );

          imageElements.forEach(imageElement => {
            image.push(imageElement.getAttribute("src"));
          });

          return image;
        });

        items = union(items, collected);
      }

      if (type === "video") {
        const collected = await page.evaluate(() => {
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

        items = union(items, collected);
      }

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await pendingXHR.waitForAllXhrFinished();
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    if (type === "image") {
      ctx
        .replyWithPhoto(items[randomizedIndex], {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (type === "video") {
      ctx
        .replyWithVideo(items[randomizedIndex], {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    }
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

async function kpop(ctx) {
  if (instanceRunning) {
    return ctx
      .replyWithHTML(
        "Masih ada proses lain yang belum selesai, coba lagi nanti..",
        {
          reply_to_message_id: ctx.message.message_id
        }
      )
      .catch(err => {
        console.log(err);
      });
  } else {
    instanceRunning = true;
  }

  let type;

  if (ctx.message.text.includes("/kpop@highfive_kw1_bot")) {
    type = ctx.message.text.replace("/kpop@highfive_kw1_bot", "").trim();
  } else {
    type = ctx.message.text.replace("/kpop", "").trim();
  }

  if (type !== "video") {
    type = "image";
  }

  ctx
    .replyWithHTML("Sebentar ya bos.. Bisa juga <code>/kpop video</code>", {
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
    const pendingXHR = new PendingXHR(page);

    await page.setViewport({
      width: 1080,
      height: 2280
    });

    let cookiesString = await fs.readFile("./cg");
    let cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    await page.goto("https://9gag.com/kpop/fresh");

    const isLogin = await page.evaluate(() => {
      const userFunction = document.querySelector("#jsid-user-function");
      return !userFunction.classList.contains("hide");
    });

    if (!isLogin) {
      await page.waitForSelector("#jsid-login-button");
      await page.click("#jsid-login-button");

      await page.waitForSelector("#login-email-name");
      await page.type("#login-email-name", process.env.GAG_EMAIL);

      await page.waitForSelector("#login-email-password");
      await page.type("#login-email-password", process.env.GAG_PASS);

      await page.click("#login-email .btn");
      await page.waitForSelector(".list-stream");
    }

    cookies = await page.cookies();
    await fs.writeFile("./cg", JSON.stringify(cookies, null, 2));

    let items = [];

    while (items.length < 25) {
      if (type === "image") {
        const collected = await page.evaluate(() => {
          const image = [];
          const imageElements = document.querySelectorAll(
            ".list-stream .post-container img"
          );

          imageElements.forEach(imageElement => {
            image.push(imageElement.getAttribute("src"));
          });

          return image;
        });

        items = union(items, collected);
      }

      if (type === "video") {
        const collected = await page.evaluate(() => {
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

        items = union(items, collected);
      }

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await pendingXHR.waitForAllXhrFinished();
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    if (type === "image") {
      ctx
        .replyWithPhoto(items[randomizedIndex], {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (type === "video") {
      ctx
        .replyWithVideo(items[randomizedIndex], {
          reply_to_message_id: ctx.message.message_id
        })
        .catch(err => {
          console.log(err);
        });
    }
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
  nsfw,
  kpop
};
