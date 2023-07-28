function displayTime(time) {
  var hours = Math.floor(time / 3600);
  time = time - hours * 3600;
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time - minutes * 60);
  var text = "";
  if (hours > 0) {
    text = hours + "h ";
  }
  if (minutes > 0) {
    text = text + minutes + "m ";
  }
  if (seconds > 0) {
    text = text + seconds + "s";
  }
  return text;
}

// Translate a point (north, east) to latlng given a certain reference position
function offsetLatLng(lat, lng, north, east) {
  // World radius
  var WGS84_R = 6367444.5;

  // Coordinate offsets in radians
  var dLat = north/WGS84_R;
  var dLng = east/(WGS84_R*Math.cos(Math.PI*lat/180.0));

  // OffsetPosition, decimal degrees
  var fLat = lat + dLat * 180.0/Math.PI;
  var fLng = lng + dLng * 180.0/Math.PI;

  return [fLat, fLng];
}

// Disable the survey events
function clearListeners() {
  // Map listeners
  map.off('click');
  map.off('rightclick');
  map.off('mousemove');

  // Enable click over the robot
  if (vehiclePose) {
    vehiclePose.off('click');
    vehiclePose.off('rightclick');
  }
}

function measure(pointA, pointB) {
  return pointA.distanceTo(pointB);
}

// Sets the logger height as a function of the available space
function setLoggerHeight() {

  var totalHeight = $("#controls").outerHeight(true);
  var controls = $("#main-controls").outerHeight(true);
  var bottom = $("#bottom").outerHeight(true);

  // Calculate the available height and set it
  var availableHeight = totalHeight - (controls + bottom) - 100;
  if (availableHeight > 480) availableHeight = 480;
  if (availableHeight < 30) {
    $("#logger").hide();
  } else {
    $("#logger").show();
    $("#logger-console").animate({height: availableHeight+"px"}, 50);
  }
}

// Get the scroll to top
function getScroll() {
  var y = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    // Netscape
    y = window.pageYOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    // DOM
    y = document.body.scrollTop;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    // IE6 standards compliant mode
    y = document.documentElement.scrollTop;
  }
  return y;
}

// Mean of an array
function mean(array) {
  var sum = 0;
  for(var i=0; i<array.length; i++)
      sum += array[i];

  return sum/array.length;
}

// Catch the console.log and show the messages into the custom logger
(function() {
  var oldLog = console.log;
  console.log = function (message) {
    $("#logger-console").val( $("#logger-console").val() + message + "\n");
    document.getElementById("logger-console").scrollTop = document.getElementById("logger-console").scrollHeight;
    oldLog.apply(console, arguments);
  };
})();

// When windows resizes
$( window ).resize(function() {
  setLoggerHeight();
});

function getDateStr() {
  var d = new Date();
  var year = d.getFullYear().toString().substr(2,2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  var hour = ("0" + d.getHours()).slice(-2);
  var minute = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return year + month + day + "_" + hour + minute;
}

function getMissionName(missionName, mode='auv') {

  if (missionName.length <= 1) {
    var datePrefix = getDateStr();
    missionName = datePrefix + "_" + mode + "_" + missionName
  }

  // Force a valid prefix
  var prefix = missionName.substring(0, 16);
  var datePrefix = getDateStr();
  var valid_Prefix = datePrefix + "_" + mode + "_";
  if (prefix != valid_Prefix) {
    missionName = valid_Prefix + missionName.substring(17, missionName.length);
  }

  // Remove bad characters and make lowercase
  var cleanMissionName = missionName.replace(/[ |&;$%@"<>()+,^*çñ·`´{}¨:.]/g, "");
  cleanMissionName = cleanMissionName.toLowerCase();
  cleanMissionName = cleanMissionName.replace("yaml", "");

  return cleanMissionName;
}
