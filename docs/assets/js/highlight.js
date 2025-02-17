document.addEventListener('DOMContentLoaded', function() {
    function getIdFromHash() {
      const hash = window.location.hash;
      const url = new URLSearchParams(hash.split('?')[1]);
      return url.get('id');
    }
  
    function highlightElementById(id) {
      if (!id) return;
      console.log(decodeURIComponent(id));
      const targetElement = document.getElementById(decodeURIComponent(id));
      console.log(targetElement);
      if (targetElement) {
        targetElement.classList.add('highlight');
        setTimeout(() => {
          targetElement.classList.remove('highlight');
        }, 1000);
      }
    }
  
    const initialId = getIdFromHash();
    if (initialId) {
      setTimeout(() => {
        highlightElementById(initialId);
      }, 200);
    }
  
    window.addEventListener('hashchange', function() {
      const newId = getIdFromHash();
      setTimeout(() => {
        highlightElementById(newId);
      }, 200);
    });
  });

  