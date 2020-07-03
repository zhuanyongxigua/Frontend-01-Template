function convertNumberToString(number, x) {
  var integer = Math.floor(number);
  var fraction = number - integer;
  var string = '';
  while(integer > 0) {
    string = String(integer % x) + string;
    integer = Math.floor(integer / x);
  }
  if (fraction !== 0) {
    string += '.';
    while (fraction > 3e-11) {
      fraction = fraction * x;
      string += String(Math.floor(fraction));
      fraction = fraction - Math.floor(fraction);
    }
    
  }
  return string
}