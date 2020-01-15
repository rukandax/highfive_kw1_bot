const { union } = require("lodash");
const { PendingXHR } = require("pending-xhr-puppeteer");

const fs = require("fs").promises;
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function pap(ctx) {
  if (ctx.message.text.includes("/paptt@highfive_kw1_bot")) {
    username = ctx.message.text.replace("/paptt@highfive_kw1_bot", "").trim();
  } else {
    username = ctx.message.text.replace("/paptt", "").trim();
  }

  ctx
    .reply("Ssttt..", {
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

    await page.setRequestInterception(true);
    page.on("request", request => {
      if (
        [
          "image",
          "media",
          "stylesheet",
          "font",
          "websocket",
          "manifest"
        ].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    let cookiesString = await fs.readFile("./ct");
    let cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    await page.goto("https://mobile.twitter.com/MIRRORSELFIEid", {
      waitLoad: true,
      waitNetworkIdle: true
    });

    await page.waitForFunction(
      "document.querySelector('body').innerHTML.includes('PAP atau kita putus!')"
    );

    const isLogin = await page.evaluate(() => {
      return !document.querySelector("a[data-testid='login']");
    });

    if (!isLogin) {
      await page.$eval("a[data-testid='login']", el => el.click());

      await page.waitFor(2000);

      await page.waitForSelector("input[name='session[username_or_email]']");

      await page.waitFor(2000);

      await page.type(
        "input[name='session[username_or_email]']",
        process.env.TWITTER_USERNAME
      );

      await page.waitFor(2000);

      await page.type(
        "input[name='session[password]']",
        process.env.TWITTER_PASSWORD
      );

      await page.waitFor(2000);

      await page.$eval("div[data-testid='LoginForm_Login_Button']", el =>
        el.click()
      );

      await page.waitForSelector("body");
      await page.waitForFunction(
        "document.querySelector('body').innerHTML.includes('PAP atau kita putus!')"
      );

      cookies = await page.cookies();
      await fs.writeFile("./ct", JSON.stringify(cookies, null, 2));
    }

    await page.goto("https://mobile.twitter.com/MIRRORSELFIEid/media", {
      waitLoad: true,
      waitNetworkIdle: true
    });

    await page.waitForSelector("img[alt=Image]");

    let items = [];

    while (items.length < 50) {
      const collected = await page.evaluate(() => {
        const image = [];
        const imageElements = document.querySelectorAll("article");

        imageElements.forEach(imageElement => {
          const listImages = [];
          const peaceOfShit = imageElement.querySelectorAll("a img[alt=Image]");

          peaceOfShit.forEach(shit => {
            listImages.push(
              shit
                .getAttribute("src")
                .split("&")[0]
                .replace("webp", "jpg")
            );
          });

          if (listImages.length) {
            image.push(listImages);
          }
        });

        return image;
      });

      items = union(items, collected);

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await pendingXHR.waitForAllXhrFinished();
    }

    await browser.close();

    const randomizedIndex = parseInt(Math.random() * items.length);

    items[randomizedIndex].forEach(item => {
      ctx.replyWithPhoto(item).catch(err => {
        console.log(err);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  pap
};
