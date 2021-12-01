export const textColorByBG = (bgColor: String) => {
  if (!bgColor) {
    return "";
  }
  return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
    ? "#000"
    : "#fff";
};
