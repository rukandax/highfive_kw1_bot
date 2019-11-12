const puppeteer = require('puppeteer');

async function getMostLikedIgPost(ctx, target = '') {
  let username = target;

  if (ctx.message.text.includes('/mostlikedigpost@highfive_kw1_bot')) {
    username = ctx.message.text.replace('/mostlikedigpost@highfive_kw1_bot', '').trim();
  } else {
    username = ctx.message.text.replace('/mostlikedigpost', '').trim();
  }

  username = username.replace('@', '');

  if (username.length <= 0) {
    return ctx.replyWithHTML('Username instagram nya siapa ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }

  ctx.reply('Sebentar ya, aku liat-liat dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err);
  });

  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
    });
  
    const page = await browser.newPage();
    await page.goto(`https://analisa.io/profile/${username}`, {
      timeout: 3000000
    });
  
    await page.waitForFunction(
      'document.querySelector(".post-01 .card-img-top") && document.querySelector(".post-01 .card-img-top").getAttribute("src")',
    );
  
    const mostlikedigpost = await page.evaluate(() => {
      const image = [];
      const itemElements = document.querySelectorAll(".post-01 .card-img-top");

      const max_rank = 3;
  
      itemElements.forEach((itemElement) => {
        if (image.length < max_rank) {
          image.push(itemElement.getAttribute('src'));
        }
      });
  
      return image[parseInt(Math.random() * image.length)];
    });
  
    await browser.close();

    ctx.replyWithPhoto(mostlikedigpost, { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  } catch (err) {
    ctx.reply('Gak ketemu nih, mungkin akun nya di private..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err);
    });
  }
}

module.exports = {
  getMostLikedIgPost,
}