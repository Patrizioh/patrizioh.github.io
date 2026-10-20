(() => {
  'use strict';
  const content = window.weddingContent;
  const $ = id => document.getElementById(id);
  const setText = (id, text) => { $(id).textContent = text; };
  document.querySelectorAll('[data-monogram]').forEach(el => { el.textContent = content.monogram; });
  document.title = `${content.monogram} — ${content.title}`;
  setText('wedding-title', content.title);
  setText('intro', content.intro);
  setText('wedding-date', content.date);
  setText('footer-date', content.footerDate);
  $('hero-image').src = content.heroImage;

  let currentPhoto = 0;
  let visiblePhotos = Math.min(12, content.photos.length);
  function layoutPhotos() {
    const gallery = $('gallery');
    const width = gallery.clientWidth;
    if (!width) return;
    const cards = Array.from(gallery.children).filter(card => !card.hidden);
    const gap = window.innerWidth <= 800 ? 12 : 16;
    const target = window.innerWidth <= 800 ? 220 : 275;
    const rows = [];
    let row = [], sum = 0;
    cards.forEach(card => {
      const photo = content.photos[Number(card.dataset.photoIndex)];
      const ratio = photo.width / photo.height;
      row.push({ card, ratio }); sum += ratio;
      if (sum * target + (row.length - 1) * gap >= width || row.length === 4) {
        rows.push(row); row = []; sum = 0;
      }
    });
    if (row.length) rows.push(row);
    rows.forEach((items, rowIndex) => {
      const ratioSum = items.reduce((total, item) => total + item.ratio, 0);
      let height = (width - gap * (items.length - 1)) / ratioSum;
      if (rowIndex === rows.length - 1) height = Math.min(height, target * 1.15);
      items.forEach(({ card, ratio }) => {
        if (window.innerWidth <= 520) { card.style.width = '100%'; card.style.height = 'auto'; }
        else { card.style.width = `${Math.max(0, height * ratio - .05)}px`; card.style.height = `${height}px`; }
      });
    });
  }
  const openPhoto = index => {
    currentPhoto = (index + content.photos.length) % content.photos.length;
    const photo = content.photos[currentPhoto];
    $('large-photo').src = photo.src;
    $('large-photo').alt = photo.alt;
    $('download-photo').href = photo.src;
    $('download-photo').download = photo.original || photo.src.split('/').pop();
    $('view-original').href = photo.src;
    setText('photo-caption', photo.caption);
    setText('photo-count', `${currentPhoto + 1} / ${content.photos.length}`);
    if (!$('photo-dialog').open) $('photo-dialog').showModal();
  };
  content.photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.hidden = index >= visiblePhotos;
    button.dataset.photoIndex = index;
    button.className = `photo-card reveal ${photo.shape === 'wide' ? 'wide' : 'tall'}`;
    button.style.setProperty('--delay', `${index % 2 * 90}ms`);
    button.setAttribute('aria-label', `View photo ${index + 1}: ${photo.caption}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const img = document.createElement('img');
    img.src = photo.thumbnail || photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.decoding = 'async';
    if (photo.width && photo.height) { img.width = photo.width; img.height = photo.height; }
    const label = document.createElement('span'); label.className = 'photo-label';
    label.append(document.createTextNode(photo.caption));
    const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    label.append(arrow); button.append(img, label);
    button.addEventListener('click', () => openPhoto(index));
    $('gallery').append(button);
  });
  function updateGalleryProgress() {
    setText('gallery-progress', `${visiblePhotos} of ${content.photos.length} photographs`);
    $('show-more-photos').hidden = visiblePhotos >= content.photos.length;
  }
  updateGalleryProgress();
  $('show-more-photos').addEventListener('click', () => {
    const previousCount = visiblePhotos;
    visiblePhotos = Math.min(visiblePhotos + 12, content.photos.length);
    Array.from($('gallery').children).forEach((card, index) => { card.hidden = index >= visiblePhotos; });
    updateGalleryProgress();
    layoutPhotos();
    $('gallery').children[previousCount]?.focus({ preventScroll: true });
  });
  const uploadUrl = content.guestUploads?.url;
  if (uploadUrl) {
    try {
      const link = new URL(uploadUrl);
      if (link.protocol === 'https:') {
        $('guest-upload').href = link.href;
        $('guest-upload').hidden = false;
        $('upload-coming-soon').hidden = true;
        $('upload-service').hidden = false;
      }
    } catch { /* Keep the coming-soon message for an incomplete upload link. */ }
  }
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(layoutPhotos);
    resize.observe($('gallery'));
    layoutPhotos();
  }
  $('previous-photo').addEventListener('click', () => openPhoto(currentPhoto - 1));
  $('next-photo').addEventListener('click', () => openPhoto(currentPhoto + 1));
  $('photo-dialog').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); openPhoto(currentPhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); openPhoto(currentPhoto + 1); }
  });

  function makePlayer(video) {
    const url = new URL(video.url, document.baseURI);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Use an HTTP(S) video URL or relative file path.');
    if (video.type === 'mp4') {
      const player = document.createElement('video');
      player.controls = true; player.autoplay = false; player.playsInline = true; player.preload = 'metadata'; player.poster = content.filmCover; player.src = url.href;
      player.setAttribute('aria-label', 'Our wedding film');
      player.addEventListener('error', () => setText('video-note', 'This video could not load. Please check the video URL in content.js.'));
      return player;
    }
    let embed;
    if (video.type === 'youtube') {
      if (!/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/.test(url.hostname)) throw new Error('Please use a YouTube URL.');
      const parts = url.pathname.split('/').filter(Boolean);
      const id = url.hostname === 'youtu.be' ? parts[0] : url.searchParams.get('v') || (['embed', 'shorts'].includes(parts[0]) ? parts[1] : '');
      if (!/^[\w-]{11}$/.test(id || '')) throw new Error('Please check the YouTube video link.');
      embed = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    } else if (video.type === 'vimeo') {
      if (!/(^|\.)vimeo\.com$/.test(url.hostname)) throw new Error('Please use a Vimeo URL.');
      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts.find(part => /^\d+$/.test(part));
      if (!id) throw new Error('Please check the Vimeo video link.');
      const hash = url.searchParams.get('h') || parts[parts.indexOf(id) + 1];
      embed = `https://player.vimeo.com/video/${id}${hash ? '?h=' + encodeURIComponent(hash) : ''}`;
    } else throw new Error('Set video.type to mp4, youtube, or vimeo.');
    const player = document.createElement('iframe');
    player.title = 'Our wedding film'; player.src = embed;
    player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    return player;
  }
  try { $('film-player').append(makePlayer(content.video)); }
  catch (error) { setText('video-note', error.message); }
  if (content.video.originalUrl) {
    $('download-film').href = content.video.originalUrl;
    $('download-film').download = content.video.originalFilename || 'wedding-film-original.M4V';
    $('download-film').hidden = false;
  }
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.classList.add('image-failed'); }));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-enabled');
  }
})();
