const puppeteer = require('puppeteer')

async function getMostLikedIgPost(ctx) {
  let username = ''

  if (ctx.message.text.includes('/mostlikedigpost@highfive_kw1_bot')) {
    username = ctx.message.text.replace('/mostlikedigpost@highfive_kw1_bot', '').trim()
  } else {
    username = ctx.message.text.replace('/mostlikedigpost', '').trim()
  }

  username = username.replace('@', '')

  if (username.length <= 0) {
    return ctx.replyWithHTML('Username instagram nya siapa ?', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }

  ctx.reply('Sebentar ya, aku liat-liat dulu..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
    console.log(err)
  })

  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: true,
    })
  
    const page = await browser.newPage()
    await page.goto(`https://analisa.io/profile/${username}`, {
      timeout: 3000000
    })
  
    await page.waitForFunction(
      'document.querySelector(".post-01 .card-img-top") && document.querySelector(".post-01 .card-img-top").getAttribute("src")',
    )
  
    const payload = await page.evaluate(() => {
      const image = []
      const caption = []

      const imageElements = document.querySelectorAll(".post-01 .card-img-top")
      const captionElements = document.querySelectorAll(".post-01 .post-content p")

      const max_rank = 3
  
      imageElements.forEach((imageElement) => {
        if (image.length < max_rank) {
          image.push(imageElement.getAttribute('src'))
        }
      })

      captionElements.forEach((captionElement) => {
        if (caption.length < max_rank) {
          caption.push(captionElement.textContent)
        }
      })
  
      const randomizedIndex = parseInt(Math.random() * image.length)
      let selectedCaption = caption[randomizedIndex]

      if (selectedCaption.length > 1024) {
        selectedCaption = selectedCaption.substr(0, 1001) + ' ... (caption too long)'
      }

      return {
        image: image[randomizedIndex],
        caption: selectedCaption,
      }
    })
  
    await browser.close()

    ctx.replyWithPhoto(payload.image, {
      reply_to_message_id: ctx.message.message_id,
      caption: payload.caption,
    }).catch((err) => {
      console.log(err)
    })
  } catch (err) {
    ctx.reply('Gak ketemu nih, mungkin akun nya di private atau service lagi down..', { reply_to_message_id: ctx.message.message_id }).catch((err) => {
      console.log(err)
    })
  }
}

module.exports = {
  getMostLikedIgPost,
}