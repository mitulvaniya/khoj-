export const setauth = (token, userId) => {
  if (!token) return;
  window.localStorage.setItem('auth-token', token);
  if (userId) {
    window.localStorage.setItem('user_id', userId);
  }
};

export const getauth = () => {
  const token = window.localStorage.getItem('auth-token');
  if (token) return token;
  const userId = window.localStorage.getItem('user_id');
  if (userId) return 'token_' + userId;
  return null;
};

export const clearToken = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_is_merchant');
};
