void async function() {
  let i = 0;
  while(true) {
    await sleep(1000);
    console.log(i);
    i = (i + 1) % 7;
  }
}();
function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  })
}