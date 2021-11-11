export function serializeUrl(obj: any, prefix?: string): string {
   var str = [], p;
   for (p in obj) {
      if (obj.hasOwnProperty(p)) {
         var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
         str.push((v !== null && typeof v === "object") ?
            serializeUrl(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
   }
   return str.join("&");
}

export function isValidJson(text: string): boolean {
   if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      return true;
   } else {
      return false;
   }
}