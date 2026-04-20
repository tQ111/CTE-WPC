var pythonIndex = 1;
var javaIndex = 1;

showDivs(pythonIndex, "pythonSlides");
showDivs(javaIndex, "javaSlides");

function plusDivs(n, type) {
  if (type === "pythonSlides") {
    showDivs(pythonIndex += n, type);
  } else {
    showDivs(javaIndex += n, type);
  }
}

function showDivs(n, type) {
  var i;
  var x = document.getElementsByClassName(type);

  if (n > x.length) {
    if (type === "pythonSlides") pythonIndex = 1;
    else javaIndex = 1;
  }

  if (n < 1) {
    if (type === "pythonSlides") pythonIndex = x.length;
    else javaIndex = x.length;
  }

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  if (type === "pythonSlides") {
    x[pythonIndex - 1].style.display = "block";
  } else {
    x[javaIndex - 1].style.display = "block";
  }
}