;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-lock" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M820.851719 939.594635 200.779328 939.594635c-22.339798 0-40.440038-18.10024-40.440038-40.441061L160.33929 548.678364c0-22.319331 18.10024-40.420595 40.440038-40.420595l67.400063 0 0-188.718129c0-133.995807 108.629069-242.638179 242.635109-242.638179 134.00911 0 242.639203 108.642372 242.639203 242.638179l0 188.718129 67.398016 0c22.339798 0 40.441061 18.102287 40.441061 40.420595l0 350.477256C861.292779 921.494395 843.191516 939.594635 820.851719 939.594635M470.380602 739.660046l0 78.614475c0 22.338774 18.105357 40.441061 40.433898 40.441061 22.339798 0 40.440038-18.101263 40.440038-40.441061l0-78.614475c24.076348-14.020318 40.441061-39.806611 40.441061-69.662593 0-44.667316-36.201503-80.880075-80.880075-80.880075-44.675502 0-80.877005 36.21276-80.877005 80.880075C429.937494 699.852412 446.302207 725.639728 470.380602 739.660046M672.573627 319.537594c0-89.330538-72.427566-161.759127-161.759127-161.759127-89.342818 0-161.756057 72.428589-161.756057 161.759127l0 188.719152 323.515185 0L672.573627 319.537594z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-3" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M506.930693 0C638.732673 0 745.188119 106.455446 745.188119 238.257426c0 131.80198-106.455446 238.257426-238.257426 238.257426-131.80198 0-238.257426-106.455446-238.257426-238.257426C268.673267 106.455446 375.128713 0 506.930693 0"  ></path>' +
    '' +
    '<path d="M937.821782 937.821782c-268.673267 106.455446-552.554455 111.524752-851.643564 0 0-248.39604 116.594059-400.475248 268.673267-461.306931l157.148515 258.534653 162.217822-253.465347C821.227723 552.554455 932.752475 699.564356 937.821782 937.821782"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)