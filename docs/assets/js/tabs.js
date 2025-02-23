$(document).ready(function() {
  $(document).on('click', '.tab-button', function() {
    const $tabContainer = $(this).closest('.tab-container'); // Trouve le conteneur parent
    const tabId = $(this).data('tab');

    $tabContainer.find('.tab-button').removeClass('active');
    $tabContainer.find('.tab-content').removeClass('active');

    $(this).addClass('active');
    $tabContainer.find(`#${tabId}`).addClass('active');

    // Gérer les iframes dans ce conteneur uniquement
    $tabContainer.find('.tab-content iframe[data-src]').each(function() {
      if (!$tabContainer.find(`#${tabId}`).is($(this).closest('.tab-content'))) {
        $(this).attr('src', '');
      } else {
        const src = $(this).data('src');
        if (!$(this).attr('src')) {
          $(this).attr('src', src);
        }
      }
    });
  });
});
