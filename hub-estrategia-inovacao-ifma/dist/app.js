const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('.nav-item')];
const sidebar = document.getElementById('sidebar');
const menuToggle = document.querySelector('.menu-toggle');

function showSection(id) {
  pages.forEach(page => page.classList.toggle('active', page.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.section === id));
  sidebar.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

navItems.forEach(item => item.addEventListener('click', () => showSection(item.dataset.section)));
document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => showSection(button.dataset.goto)));
menuToggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('click', event => {
  if (window.innerWidth <= 760 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== menuToggle) {
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('#actionTable tr').forEach(row => {
    row.hidden = filter !== 'all' && row.dataset.axis !== filter;
  });
}));

const initial = location.hash.slice(1);
if (pages.some(page => page.id === initial)) showSection(initial);
