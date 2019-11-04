const puppeteer = require('puppeteer');

async function getMostLikedIgPost(ctx, target = '') {
  let username = target;
  
  if (ctx.message.text.includes('/mostlikedigpost@highfive_kw1_bot')) {
    username = ctx.message.text.replace('/mostlikedigpost@highfive_kw1_bot', '').trim();
  } else {
    username = ctx.message.text.replace('/mostlikedigpost', '').trim();
  }

  username = username.replace('@', '');

  if (name.length <= 0) {
    return ctx.replyWithHTML('Username instagram nya siapa ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  ctx.reply('Sebentar ya, aku liat-liat dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: true,
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg') || interceptedRequest.url().endsWith('.jpeg') || interceptedRequest.url().endsWith('.css'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  });

  await page.goto(`https://analisa.io/profile/${username}`, {
    timeout: 3000000
  });

  await page.waitForSelector('.bio-name');
  await page.waitForFunction(
    'document.querySelector(".card-img-top").getAttribute("src")',
  );

  const mostlikedigpost = await page.evaluate(() => {
    return document.querySelector(".card-img-top").getAttribute('src');
  });

  await browser.close();

  ctx.replyWithPhoto(mostlikedigpost);
}

module.exports = {
  getMostLikedIgPost,
}