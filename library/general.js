function greeting(ctx) {
  return ctx.replyWithHTML('<b>Halo, ada yang bisa Anak Ibu Susi bantu hari ini?</b>\n\n1. Kalau kamu mau givepoint, cerita dulu sama Anak Ibu Susi seperti ini ya:\n<code>/givepoint [@usernameteman] [alasan]</code>\n2. Kalau kamu mau highfive, kirim perintah highfive ke Anak Ibu Susi seperti ini ya:\n<code>/highfive [@usernameteman] [@usernametemanlain] [poin] [alasan]</code>\n3. Gak perlu pakai kode kategori.\n\n<i>Bot ini adalah versi parody dari "Ibu Susi", setiap pesan yang masuk tidak akan dimoderasi ataupun disimpan.</i>\n\nJika anda berniat menggunakan bot highfive yang sebenarnya, gunakan @ibususi_bot')
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  greeting,
}