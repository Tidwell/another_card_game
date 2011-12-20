$(document).ready(function() {
  var socket = io.connect('http://www.tcgdev.info');
  
  $('#create').click(function() {
    $('#create').hide();
    $('ul').hide();
    $('#waiting').show();
    socket.emit('create game');  
  });
  
  $('ul').on('click', 'a', function(e) {
    var el = $(this);
    socket.emit('join game', {id: el.attr('rel')});
    e.preventDefault();
  });
  
  $('#forfit').click(function(e) {
    socket.emit('forfit game');
    e.preventDefault();
  });
  
  socket.on('game created', function (data) {
    $('body ul').append('<li>'+data.name+' - <a href="" rel="'+data.id+'">join</a></li>');
  });
  socket.on('game full', function (data) {
    $('body ul li a[rel="'+data.id+'"]').parent().remove();
  });
  socket.on('already in game', function (data) {
    alert('Cannot join game, already in a game');
  });
  socket.on('game ended', function (data) {
    alert('Game Ended');
    $('#forfit').hide();
    $('#create').show();
    $('#log').hide();
    $('ul').show();
  });
  socket.on('game started', function (data) {
    $('#waiting').hide();
    $('#log').html('BEGIN');
    $('#create').hide();
    $('ul').hide();
    $('#forfit').show();
  });
});