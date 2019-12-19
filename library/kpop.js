const puppeteer = require("puppeteer");

async function kpop(ctx) {
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

      previousHeight = await page.evaluate("document.body.scrollHeight");

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    return ctx
      .replyWithVideo(items[randomizedIndex], {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);

    return ctx
      .reply("Fiturnya lagi rusak nih..", {
        reply_to_message_id: ctx.message.message_id
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = {
  kpop
};
