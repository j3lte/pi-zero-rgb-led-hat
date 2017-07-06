(function($) {
  var RadiusRange = 150;
  var RadiusPicker = 15;

  var colorRange = $('#colorRange')[0];
  var colorPicker = $('#picker')[0];
  var $myCanvas = $('#mycanvas');

  //var windowWidth = window.screen.width;
  var windowWidth = $(window).innerWidth();
  var offsetX = windowWidth / 2 - RadiusRange;
  var offsetY = $myCanvas.offset().top;
  var centerX = offsetX + RadiusRange;
  var centerY = offsetY + RadiusRange;

  var myCanvas = $myCanvas[0];
  var myImg = $('#myimg')[0];
  var ctx = myCanvas.getContext('2d');

  myImg.onload = function() {
    ctx.drawImage(myImg, 0, 0);
  }

  myImg.src = "color_range.png";

  var DEBOUNCE = null;

  function debounce(func, timeout) {
    if (DEBOUNCE) {
      clearTimeout(DEBOUNCE);
    }
    DEBOUNCE = setTimeout(function() {
      func();
      DEBOUNCE = null;
    }, timeout);
  }

  function setRGB(red, green, blue) {
    debounce(function () {
      $.post('/rgb', {
        red: red,
        green: green,
        blue: blue
      });
    }, 200);
  }

  function setBrightness(brightness) {
    debounce(function () {
      $.post('/brightness', {
        brightness: brightness
      });
    }, 500);
  }

  function move(X, Y) {
    var x = X - centerX;
    var y = Y - centerY;
    if (Math.sqrt(x * x + y * y) < RadiusRange - 5) {
      console.log('====> YES');
      colorPicker.style.left = X - offsetX - RadiusPicker + 'px';
      colorPicker.style.top = Y - offsetY - RadiusPicker + 'px';

      var rgba = ctx.getImageData(X - offsetX, Y - offsetY, 1, 1).data;
      var red = rgba['0'];
      var green = rgba['1'];
      var blue = rgba['2'];
      setRGB(red, green, blue);
    }
  }

  colorRange.addEventListener('touchstart', touch, false);
  colorRange.addEventListener('touchmove', touch, false);
  function touch(e) {
    var X = e.touches[0].clientX;
    var Y = e.touches[0].clientY;
    move(X, Y);
    event.preventDefault();
  }

  colorRange.addEventListener('dragstart', drag, false);
  colorRange.addEventListener('drag', drag, false);
  colorRange.addEventListener('dragend', drag, false);
  function drag(e) {
    var X = e.clientX;
    var Y = e.clientY;
    move(X, Y);
  }

  $('input').click(function() {
    var type = this.value;
    $.post('/lightType', {type: type});;
  });

  $("#slider").slider({tooltip: 'always'});
  $("#slider").on("slide", function(slideEvt) {
  	setBrightness(slideEvt.value);
  });
}(jQuery));
