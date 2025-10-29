// theme-toggle.js
const applyTheme = (t) => {
    if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.setAttribute('data-theme','light');
  };
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
  
  document.querySelectorAll('.theme-toggle').forEach(btn=>{
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nxt = cur === 'dark' ? 'light' : 'dark';
      applyTheme(nxt);
      localStorage.setItem('theme', nxt);
    });
  });
  