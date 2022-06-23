(function($){
  $(function(){
    $('select').formSelect();
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.carousel').carousel();
    $('.scrollspy').scrollSpy({
      scrollOffset:100
    });
    $('.dropdown-trigger').dropdown();
    $('.stats_dropdown-trigger').dropdown({
      hover:true,
      closeOnClick:false,
    });
    
    $('.tooltipped').tooltip();
    $('.tabs').tabs();
        // Swipeable Tabs Demo Init
        if ($('#tabs-swipe-demo').length) {
          $('#tabs-swipe-demo').tabs({ swipeable: true });
        }
    $('.collapsible').collapsible();
    $('.collapsible.expandable').collapsible({
      accordion: false
    });

    $('.collapsible-header').click(function() {
      let parent_child = $(this);
      parent_child.toggleClass('collapsed');
      if(parent_child.hasClass('collapsed')){
        parent_child.children('i.icon-change').text('remove');
      }else{
        parent_child.children('i.icon-change').text('add');
      }
    });    
  }); // end of document ready
})(jQuery); // end of jQuery name space

AOS.init({
  duration: 1200, // values from 0 to 3000, with step 50ms
  easing: 'ease',
  offset: 20,
  // mirror: true,
});


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// $(document).ready(function(){
//   $('.button-collapse').sideNav({
//       menuWidth: 500, // Default is 300
//       edge: 'left', // Choose the horizontal origin
//       closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
//       draggable: true // Choose whether you can drag to open on touch screens
//     }
//   );
//   // START OPEN
//   $('.button-collapse').sideNav('show');

// });









