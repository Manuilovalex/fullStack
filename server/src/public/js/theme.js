document.addEventListener('DOMContentLoaded', function () {
  const themeSelect = document.getElementById('theme')

  themeSelect.addEventListener('change', function () {
    const selectedTheme = themeSelect.value
    document.body.className = selectedTheme
    document.cookie = 'theme=' + selectedTheme + '; path=/'
  })

  const themeCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('theme='))
  if (themeCookie) {
    const theme = themeCookie.split('=')[1]
    document.body.className = theme
    themeSelect.value = theme
  }
})
