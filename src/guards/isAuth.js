function isAuth() {
  const token = localStorage.getItem("token");
  return !!token;
}

export default isAuth;
