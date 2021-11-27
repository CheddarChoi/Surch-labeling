const toTimeString = (second: number) => {
  const date = new Date(second * 1000);

  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getSeconds();

  const formattedHour = hh + ":";
  const formattedMinute = mm + ":";
  const formattedSecond = (ss < 10 ? "0" : "") + ss;

  return formattedHour + formattedMinute + formattedSecond;
};

export default toTimeString;
