document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Scroll Progress Bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[data-section]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav a[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Scroll Reveal ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, Number(delay));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(item => revealObserver.observe(item));

  /* ---------- Animated Counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setError(name, msg) {
    const input = form[name];
    const field = input.closest('.field');
    const err = form.querySelector(`.error[data-for="${name}"]`);
    if (msg) {
      field.classList.add('invalid');
      err.textContent = msg;
    } else {
      field.classList.remove('invalid');
      err.textContent = '';
    }
  }

  function validate() {
    let ok = true;
    const name = form.name.value.trim();
    if (!name) {
      setError('name', 'Please enter your name.');
      ok = false;
    } else {
      setError('name', '');
    }

    const email = form.email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', 'Please enter your email.');
      ok = false;
    } else if (!emailRe.test(email)) {
      setError('email', 'Please enter a valid email.');
      ok = false;
    } else {
      setError('email', '');
    }

    const message = form.message.value.trim();
    if (!message) {
      setError('message', 'Please enter a message.');
      ok = false;
    } else if (message.length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      ok = false;
    } else {
      setError('message', '');
    }
    return ok;
  }

  ['name', 'email', 'message'].forEach(n => {
    form[n].addEventListener('blur', validate);
  });

  form.addEventListener('submit', (e) => {
    formStatus.textContent = '';
    formStatus.style.color = '';

    if (!validate()) {
      e.preventDefault();
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // Valid — allow form to submit to FormSubmit
    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    formStatus.style.color = '#0d9488';
    formStatus.textContent = 'Sending your message...';
    // Form will POST to formsubmit.co and redirect/show success
  });
});
