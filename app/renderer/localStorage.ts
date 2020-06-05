export const init = () => {
  if (localStorage.length) return;
  localStorage.setItem("queue", "[]");
  localStorage.setItem("songs", "[]");
  localStorage.setItem("cur", "-1");
};

export const getArr = (key: string): any[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return value ? value : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getNum = (key: string): number => +(localStorage.getItem(key) ?? 0);

export const setArr = (key: string, value: any[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setNum = (key: string, value: number): void => {
  localStorage.setItem(key, value.toString());
};
