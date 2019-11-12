function greeting(ctx) {
  if (
    ctx.message.from.username === '@wibisonoajii'
      ||
    ctx.message.from.username === 'wibisonoajii'
  ) {
    return;
  }

  return ctx.reply('Join our new group https://t.me/joinchat/E_Aj-BMgIPNkx42JuGTi3g')
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  greeting,
}