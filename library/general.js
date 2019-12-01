function greeting(ctx) {
  return ctx.reply('Hi,')
    .catch((err) => {
      console.log(err)
    })
}

module.exports = {
  greeting,
}