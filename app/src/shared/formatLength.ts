const formatLength = (length: number, total?: number) => {
  const onlyOne = total === undefined;

  if (onlyOne) {
    total = length;
  }

  let total_secs = (total % 60).toString();
  let total_mins = Math.floor(total / 60).toString();

  if (total_secs.length === 1) {
    total_secs = "0" + total_secs;
  }

  if (onlyOne) {
    return `${total_mins}:${total_secs}`;
  }

  let secs = (length % 60).toString();
  let mins = Math.floor(length / 60).toString();
  while (mins.length < total_mins.length) {
    mins = "0" + mins;
  }
  if (secs.length === 1) {
    secs = "0" + secs;
  }
  return [`${mins}:${secs}`, `${total_mins}:${total_secs}`];
};

export default formatLength;
