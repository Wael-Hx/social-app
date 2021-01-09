export const formatString = (s) => {
  if (s.length > 15)
    return `${s.substring(0, 10)}...${s.substring(s.length, s.length - 4)}`;
  else return s;
};

export const relativeTime = (unixTime) => {
  let currentTime = Math.round(new Date());
  currentTime = Math.round(currentTime / 1000);
  let relativeTime = currentTime - unixTime;
  if (relativeTime < 3600) {
    return `${Math.round(relativeTime / 60)} min ago`;
  } else if (relativeTime < 86400) {
    return `${Math.round(relativeTime / 60 / 60)} hours ago `;
  } else if (relativeTime > 86400) {
    return `${Math.round(relativeTime / 60 / 60 / 24)} days ago `;
  } else {
    return "unknown date format";
  }
};
