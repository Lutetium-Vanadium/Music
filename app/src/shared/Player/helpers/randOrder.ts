const randOrder = (array: any[], cur: number): any[] => {
  let currentIndex = array.length - 1;
  let randomIndex: number;
  [array[0], array[cur]] = [array[cur], array[0]];
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.ceil(Math.random() * currentIndex);
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
    currentIndex--;
  }
  return array;
};

export default randOrder;
