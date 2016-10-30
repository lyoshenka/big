window.onload = function() {

  function resize() {
    var w = window.innerWidth,
        h = window.innerHeight,
        currentSlide = slides[big.current];

    currentSlide.style.fontSize = h + 'px';

    for (i = h - 2; i > 0 && (currentSlide.offsetWidth > w || currentSlide.offsetHeight > h); i -= 4) {
      currentSlide.style.fontSize = i + 'px';
    }

    currentSlide.style.marginTop = (h - currentSlide.offsetHeight) / 2 + 'px';
  }

  function go(n) {
    var slide = slides[n],
        timeToNext = parseInt(slide.dataset.timeToNext || 0, 10),
        notes = slide.getElementsByTagName('notes');

    big.current = n;

    document.body.className = slide.dataset.bodyclass || '';

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    slide.style.display = 'inline';
    slide.focus();

    for (i = 0; typeof console === 'object' && i < notes.length; i++) {
      console.log('%c%s: %s', 'padding:5px;font-family:serif;font-size:18px;line-height:150%;', n, notes[i].innerHTML.trim());
    }

    if (slide.firstChild && slide.firstChild.nodeName === 'IMG') {
      document.body.style.background = 'url("' + slide.firstChild.src + '") center center / ' + (slide.dataset.stretch ? 'cover' : 'contain') + ' no-repeat fixed';
      slide.firstChild.style.display = 'none';
      if ('classList' in slide) {
        slide.classList.add('imageText');
      }
    }
    else {
      document.body.style.background = '';
      document.body.style.backgroundColor = slide.style.backgroundColor;
    }

    if (timeout !== undefined) {
      window.clearInterval(timeout);
    }

    if (timeToNext > 0) {
      timeout = window.setTimeout(fwd, timeToNext * 1000);
    }

    resize();

    if (window.location.hash !== n) {
      // window.location.hash = n;
      window.history.replaceState({},'','#'+n); // edit hash without killing back button
    }

    document.title = slide.textContent;
  }

  function fwd() {
    go(Math.min(slides.length - 1, ++big.current));
  }

  function rev() {
    go(Math.max(0, --big.current));
  }

  function parseHash() {
    return Math.max(Math.min(slides.length - 1, parseInt(window.location.hash.substring(1), 10)), 0);
  }


  var timeout, i, slides, big;

  if (document.body.dataset.md) {
    console.log('yay');
    s = document.body.innerHTML.split('---');
    document.body.innerHTML = '';
    for (i = 0; i < s.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = marked(s[i].trim());
      document.body.appendChild(div);
    }
  }

  slides = document.getElementsByTagName('div');
  big = {
    current: 0,
    forward: fwd,
    reverse: rev,
    go: go,
    length: slides.length
  };

  if (!slides) {
    return;
  }

  window.big = big;

  for (i = 0; i < slides.length; i++) {
    slides[i].setAttribute('tabindex', 0);
  }

  document.onclick = function() {
    go(++big.current % slides.length);
  };

  document.onkeydown = function(e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    else if (e.which === 39 || e.which === 34 || e.which === 40) {
      fwd();
    }
    else if (e.which === 37 || e.which === 33 || e.which === 38) {
      rev();
    }
  };

  document.ontouchstart = function(e) {
    var x0 = e.changedTouches[0].pageX;
    document.ontouchend = function(e2) {
      var x1 = e2.changedTouches[0].pageX;
      if (x1 - x0 < 0) {
        fwd();
      }
      if (x1 - x0 > 0) {
        rev();
      }
    };
  };

  if (window.location.hash) {
    big.current = parseHash() || big.current;
  }

  window.onhashchange = function() {
    var slideNum = parseHash();
    if (slideNum !== big.current) {
      go(slideNum);
    }
  };

  window.onresize = resize;

  go(big.current);
};
