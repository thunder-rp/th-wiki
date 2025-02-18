$(document).ready(function() {
  $(document).on('click', '.tab-button', function() {
    const tabId = $(this).data('tab');
    $('.tab-button').removeClass('active');
    $('.tab-content').removeClass('active');
  
    $(this).addClass('active');
    $(`#${tabId}`).addClass('active');
  });
});