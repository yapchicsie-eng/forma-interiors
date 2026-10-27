/* FORMA INTERIORS — small, dependency-free enhancements */
(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  doc.classList.add('js');

  /* Header: transparent over the hero, solid once scrolled (always solid on inner pages) */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  function updateHeader() {
    if (!header) return;
    var threshold = hero ? Math.max(hero.offsetHeight - 120, 80) : 0;
    header.classList.toggle('is-solid', !hero || window.scrollY > threshold);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* Images settle in as they enter the viewport */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Footer year */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* Contact form: no backend, so it opens the visitor's email app with the message filled in */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var subject = 'Project enquiry: ' + data.get('type') + ' (' + data.get('name') + ')';
      var text = data.get('message') + '\n\n' + data.get('name') + '\n' + data.get('email');
      var href = 'mailto:' + form.getAttribute('data-to') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(text);
      if (status) status.textContent = 'Opening your email app with your message. If nothing opens, write to ' + form.getAttribute('data-to') + '.';
      window.location.href = href;
    });
  }
})();
