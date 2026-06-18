var currentLang = localStorage.getItem('lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.lang-sw button').forEach(function(b) {
    b.classList.toggle('on', b.textContent.trim() === (lang === 'zh' ? '中' : 'EN'));
  });
  document.querySelectorAll('[data-' + lang + ']').forEach(function(el) {
    if (el.tagName === 'OPTION') {
      el.text = el.getAttribute('data-' + lang);
    } else if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
      el.innerHTML = el.getAttribute('data-' + lang);
    }
  });
  document.querySelectorAll('[data-' + lang + '-ph]').forEach(function(el) {
    el.placeholder = el.getAttribute('data-' + lang + '-ph');
  });
  var titleEl = document.documentElement;
  var titleAttr = 'data-' + lang + '-title';
  if (titleEl.hasAttribute(titleAttr)) {
    document.title = titleEl.getAttribute(titleAttr);
  }
}

function initPage() {
  setLang(currentLang);

  var hd = document.getElementById('hd');
  if (hd) {
    window.addEventListener('scroll', function() {
      hd.classList.toggle('shd', window.scrollY > 30);
    });
  }

  var mobTog = document.querySelector('.mob-tog');
  var hdNav = document.querySelector('.hd-nav');
  if (mobTog && hdNav) {
    mobTog.addEventListener('click', function() {
      hdNav.classList.toggle('mob-open');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  var hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(function() { hero.classList.add('in-view'); }, 100);
  }

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade,.stat-itm,.prod-section,.solu-section,.case-block,.cat-card,.sol-card,.news-card').forEach(function(el) {
    obs.observe(el);
  });

  var sobs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { animNum(e.target); sobs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-itm .num').forEach(function(el) { sobs.observe(el); });
}

function animNum(el) {
  var t = el.textContent.trim(), m = t.match(/^(\d+)/);
  if (!m) return;
  var target = parseInt(m[1]), suf = t.replace(m[1], ''), dur = 1200, st = performance.now();
  function upd(now) {
    var p = Math.min((now - st) / dur, 1), cur = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.innerHTML = cur.toLocaleString() + suf;
    if (p < 1) requestAnimationFrame(upd);
    else el.innerHTML = target.toLocaleString() + suf;
  }
  requestAnimationFrame(upd);
}

document.addEventListener('DOMContentLoaded', initPage);
