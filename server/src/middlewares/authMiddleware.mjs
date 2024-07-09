export function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
