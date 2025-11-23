export const nanoid = (size = 8) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < size; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};
