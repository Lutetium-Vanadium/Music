const randOrder = (array: any[], cur: number): any[] => {
  let currentIndex = array.length - 1;
  let randomIndex: number;

  console.log({ currentIndex, randomIndex, cur, array });

  if (cur >= 0) [array[0], array[cur]] = [array[cur], array[0]];
  // While there remain elements to shuffle...
  while (currentIndex > 0) {
    // Pick a remaining element...
    randomIndex = Math.ceil(Math.random() * currentIndex);
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
    currentIndex--;
  }

  console.log({ array });
  return array;
};

export default randOrder;

/*

const randOrder = (array, cur) => {
  let currentIndex = array.length - 1;
  let randomIndex;
  [array[0], array[cur]] = [array[cur], array[0]];
  // While there remain elements to shuffle...
  while (currentIndex > 0) {
    // Pick a remaining element...
    randomIndex = Math.ceil(Math.random() * currentIndex);
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
    currentIndex--;
  }

  console.log({ array });
  return array;
};

*/
