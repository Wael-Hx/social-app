export const formatString = (s) => {
  if (s.length > 15)
    return `${s.substring(0, 10)}...${s.substring(s.length, s.length - 4)}`;
  else return s;
};

export const relativeTime = (unixTime) => {
  let currentTime = Math.round(new Date());
  currentTime = Math.round(currentTime / 1000);
  let relativeTime = currentTime - unixTime;
  let min = 60,
    hour = 3600,
    day = 86400,
    month = 2592000,
    rTime = 0;

  if (relativeTime < min) {
    rTime = Math.round(relativeTime / 1);
    return `${rTime} second${rTime > 1 ? "s" : ""} ago`;
  } else if (relativeTime < hour) {
    rTime = Math.round(relativeTime / min);
    return `${rTime} min${rTime > 1 ? "s" : ""} ago`;
  } else if (relativeTime < day) {
    rTime = Math.round(relativeTime / hour);
    return `${rTime} hour${rTime > 1 ? "s" : ""} ago `;
  } else if (relativeTime > day && relativeTime < month) {
    rTime = Math.round(relativeTime / day);
    return `${rTime} day${rTime > 1 ? "s" : ""} ago `;
  } else if (relativeTime > month) {
    rTime = Math.round(relativeTime / month);
    return `${rTime} month${rTime > 1 ? "s" : ""} ago `;
  } else {
    return "unknown date format";
  }
};
