(function(window, document) {
  function WwLogin(data) {
    var frame = document.createElement('iframe')
    var url = 'http://103.160.52.66:13082/wwopen/sso/qrConnect?appid=' + data.appid + '&agentid=' + data.agentid + '&redirect_uri=' + data.redirect_uri + '&state=' + data.state + '&login_type=jssdk'
    url += data.style ? ('&style=' + data.style) : ''
    url += data.href ? ('&href=' + data.href) : ''
    frame.src = url
    frame.frameBorder = '0'
    frame.allowTransparency = 'true'
    frame.scrolling = 'no'
    frame.width = '300px'
    frame.height = '400px'
    var el = document.getElementById(data.id)
    el.innerHTML = ''
    el.appendChild(frame)

    frame.onload = function() {
      if (frame.contentWindow.postMessage && window.addEventListener) {
        window.addEventListener('message', function(event) {
          var host = '103.160.52.66:13082'
          var hostArr = host.split(':')
          if (hostArr[1] === 80) host = hostArr[0]
          if (event.data && event.origin.indexOf(host) > -1) {
            window.location.href = event.data
          }
        })
        frame.contentWindow.postMessage('ask_usePostMessage', '*')
      }
    }
  }

  window.WwLogin = WwLogin
})(window, document)
