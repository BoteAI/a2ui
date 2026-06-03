var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// ../../node_modules/mdurl/lib/decode.mjs
function getDecodeCache(exclude) {
  let cache = decodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = decodeCache[exclude] = [];
  for (let i11 = 0; i11 < 128; i11++) {
    const ch = String.fromCharCode(i11);
    cache.push(ch);
  }
  for (let i11 = 0; i11 < exclude.length; i11++) {
    const ch = exclude.charCodeAt(i11);
    cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
  }
  return cache;
}
function decode(string, exclude) {
  if (typeof exclude !== "string") {
    exclude = decode.defaultChars;
  }
  const cache = getDecodeCache(exclude);
  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    let result = "";
    for (let i11 = 0, l5 = seq.length; i11 < l5; i11 += 3) {
      const b1 = parseInt(seq.slice(i11 + 1, i11 + 3), 16);
      if (b1 < 128) {
        result += cache[b1];
        continue;
      }
      if ((b1 & 224) === 192 && i11 + 3 < l5) {
        const b22 = parseInt(seq.slice(i11 + 4, i11 + 6), 16);
        if ((b22 & 192) === 128) {
          const chr = b1 << 6 & 1984 | b22 & 63;
          if (chr < 128) {
            result += "\uFFFD\uFFFD";
          } else {
            result += String.fromCharCode(chr);
          }
          i11 += 3;
          continue;
        }
      }
      if ((b1 & 240) === 224 && i11 + 6 < l5) {
        const b22 = parseInt(seq.slice(i11 + 4, i11 + 6), 16);
        const b3 = parseInt(seq.slice(i11 + 7, i11 + 9), 16);
        if ((b22 & 192) === 128 && (b3 & 192) === 128) {
          const chr = b1 << 12 & 61440 | b22 << 6 & 4032 | b3 & 63;
          if (chr < 2048 || chr >= 55296 && chr <= 57343) {
            result += "\uFFFD\uFFFD\uFFFD";
          } else {
            result += String.fromCharCode(chr);
          }
          i11 += 6;
          continue;
        }
      }
      if ((b1 & 248) === 240 && i11 + 9 < l5) {
        const b22 = parseInt(seq.slice(i11 + 4, i11 + 6), 16);
        const b3 = parseInt(seq.slice(i11 + 7, i11 + 9), 16);
        const b4 = parseInt(seq.slice(i11 + 10, i11 + 12), 16);
        if ((b22 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
          let chr = b1 << 18 & 1835008 | b22 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
          if (chr < 65536 || chr > 1114111) {
            result += "\uFFFD\uFFFD\uFFFD\uFFFD";
          } else {
            chr -= 65536;
            result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
          }
          i11 += 9;
          continue;
        }
      }
      result += "\uFFFD";
    }
    return result;
  });
}
var decodeCache, decode_default;
var init_decode = __esm({
  "../../node_modules/mdurl/lib/decode.mjs"() {
    decodeCache = {};
    decode.defaultChars = ";/?:@&=+$,#";
    decode.componentChars = "";
    decode_default = decode;
  }
});

// ../../node_modules/mdurl/lib/encode.mjs
function getEncodeCache(exclude) {
  let cache = encodeCache[exclude];
  if (cache) {
    return cache;
  }
  cache = encodeCache[exclude] = [];
  for (let i11 = 0; i11 < 128; i11++) {
    const ch = String.fromCharCode(i11);
    if (/^[0-9a-z]$/i.test(ch)) {
      cache.push(ch);
    } else {
      cache.push("%" + ("0" + i11.toString(16).toUpperCase()).slice(-2));
    }
  }
  for (let i11 = 0; i11 < exclude.length; i11++) {
    cache[exclude.charCodeAt(i11)] = exclude[i11];
  }
  return cache;
}
function encode(string, exclude, keepEscaped) {
  if (typeof exclude !== "string") {
    keepEscaped = exclude;
    exclude = encode.defaultChars;
  }
  if (typeof keepEscaped === "undefined") {
    keepEscaped = true;
  }
  const cache = getEncodeCache(exclude);
  let result = "";
  for (let i11 = 0, l5 = string.length; i11 < l5; i11++) {
    const code2 = string.charCodeAt(i11);
    if (keepEscaped && code2 === 37 && i11 + 2 < l5) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i11 + 1, i11 + 3))) {
        result += string.slice(i11, i11 + 3);
        i11 += 2;
        continue;
      }
    }
    if (code2 < 128) {
      result += cache[code2];
      continue;
    }
    if (code2 >= 55296 && code2 <= 57343) {
      if (code2 >= 55296 && code2 <= 56319 && i11 + 1 < l5) {
        const nextCode = string.charCodeAt(i11 + 1);
        if (nextCode >= 56320 && nextCode <= 57343) {
          result += encodeURIComponent(string[i11] + string[i11 + 1]);
          i11++;
          continue;
        }
      }
      result += "%EF%BF%BD";
      continue;
    }
    result += encodeURIComponent(string[i11]);
  }
  return result;
}
var encodeCache, encode_default;
var init_encode = __esm({
  "../../node_modules/mdurl/lib/encode.mjs"() {
    encodeCache = {};
    encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
    encode.componentChars = "-_.!~*'()";
    encode_default = encode;
  }
});

// ../../node_modules/mdurl/lib/format.mjs
function format(url) {
  let result = "";
  result += url.protocol || "";
  result += url.slashes ? "//" : "";
  result += url.auth ? url.auth + "@" : "";
  if (url.hostname && url.hostname.indexOf(":") !== -1) {
    result += "[" + url.hostname + "]";
  } else {
    result += url.hostname || "";
  }
  result += url.port ? ":" + url.port : "";
  result += url.pathname || "";
  result += url.search || "";
  result += url.hash || "";
  return result;
}
var init_format = __esm({
  "../../node_modules/mdurl/lib/format.mjs"() {
  }
});

// ../../node_modules/mdurl/lib/parse.mjs
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}
function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) return url;
  const u5 = new Url();
  u5.parse(url, slashesDenoteHost);
  return u5;
}
var protocolPattern, portPattern, simplePathPattern, delims, unwise, autoEscape, nonHostChars, hostEndingChars, hostnameMaxLen, hostnamePartPattern, hostnamePartStart, hostlessProtocol, slashedProtocol, parse_default;
var init_parse = __esm({
  "../../node_modules/mdurl/lib/parse.mjs"() {
    protocolPattern = /^([a-z0-9.+-]+:)/i;
    portPattern = /:[0-9]*$/;
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    autoEscape = ["'"].concat(unwise);
    nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    hostEndingChars = ["/", "?", "#"];
    hostnameMaxLen = 255;
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    hostlessProtocol = {
      javascript: true,
      "javascript:": true
    };
    slashedProtocol = {
      http: true,
      https: true,
      ftp: true,
      gopher: true,
      file: true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    Url.prototype.parse = function(url, slashesDenoteHost) {
      let lowerProto, hec, slashes;
      let rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        const simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
          }
          return this;
        }
      }
      let proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        lowerProto = proto.toLowerCase();
        this.protocol = proto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        let hostEnd = -1;
        for (let i11 = 0; i11 < hostEndingChars.length; i11++) {
          hec = rest.indexOf(hostEndingChars[i11]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        let auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = auth;
        }
        hostEnd = -1;
        for (let i11 = 0; i11 < nonHostChars.length; i11++) {
          hec = rest.indexOf(nonHostChars[i11]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        if (hostEnd === -1) {
          hostEnd = rest.length;
        }
        if (rest[hostEnd - 1] === ":") {
          hostEnd--;
        }
        const host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost(host);
        this.hostname = this.hostname || "";
        const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          const hostparts = this.hostname.split(/\./);
          for (let i11 = 0, l5 = hostparts.length; i11 < l5; i11++) {
            const part = hostparts[i11];
            if (!part) {
              continue;
            }
            if (!part.match(hostnamePartPattern)) {
              let newpart = "";
              for (let j2 = 0, k2 = part.length; j2 < k2; j2++) {
                if (part.charCodeAt(j2) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j2];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                const validParts = hostparts.slice(0, i11);
                const notHost = hostparts.slice(i11 + 1);
                const bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        }
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        }
      }
      const hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      const qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        rest = rest.slice(0, qm);
      }
      if (rest) {
        this.pathname = rest;
      }
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "";
      }
      return this;
    };
    Url.prototype.parseHost = function(host) {
      let port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) {
        this.hostname = host;
      }
    };
    parse_default = urlParse;
  }
});

// ../../node_modules/mdurl/index.mjs
var mdurl_exports = {};
__export(mdurl_exports, {
  decode: () => decode_default,
  encode: () => encode_default,
  format: () => format,
  parse: () => parse_default
});
var init_mdurl = __esm({
  "../../node_modules/mdurl/index.mjs"() {
    init_decode();
    init_encode();
    init_format();
    init_parse();
  }
});

// ../../node_modules/uc.micro/properties/Any/regex.mjs
var regex_default;
var init_regex = __esm({
  "../../node_modules/uc.micro/properties/Any/regex.mjs"() {
    regex_default = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  }
});

// ../../node_modules/uc.micro/categories/Cc/regex.mjs
var regex_default2;
var init_regex2 = __esm({
  "../../node_modules/uc.micro/categories/Cc/regex.mjs"() {
    regex_default2 = /[\0-\x1F\x7F-\x9F]/;
  }
});

// ../../node_modules/uc.micro/categories/Cf/regex.mjs
var regex_default3;
var init_regex3 = __esm({
  "../../node_modules/uc.micro/categories/Cf/regex.mjs"() {
    regex_default3 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
  }
});

// ../../node_modules/uc.micro/categories/P/regex.mjs
var regex_default4;
var init_regex4 = __esm({
  "../../node_modules/uc.micro/categories/P/regex.mjs"() {
    regex_default4 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
  }
});

// ../../node_modules/uc.micro/categories/S/regex.mjs
var regex_default5;
var init_regex5 = __esm({
  "../../node_modules/uc.micro/categories/S/regex.mjs"() {
    regex_default5 = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
  }
});

// ../../node_modules/uc.micro/categories/Z/regex.mjs
var regex_default6;
var init_regex6 = __esm({
  "../../node_modules/uc.micro/categories/Z/regex.mjs"() {
    regex_default6 = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
  }
});

// ../../node_modules/uc.micro/index.mjs
var uc_exports = {};
__export(uc_exports, {
  Any: () => regex_default,
  Cc: () => regex_default2,
  Cf: () => regex_default3,
  P: () => regex_default4,
  S: () => regex_default5,
  Z: () => regex_default6
});
var init_uc = __esm({
  "../../node_modules/uc.micro/index.mjs"() {
    init_regex();
    init_regex2();
    init_regex3();
    init_regex4();
    init_regex5();
    init_regex6();
  }
});

// ../../node_modules/entities/lib/esm/generated/decode-data-html.js
var decode_data_html_default;
var init_decode_data_html = __esm({
  "../../node_modules/entities/lib/esm/generated/decode-data-html.js"() {
    decode_data_html_default = new Uint16Array(
      // prettier-ignore
      '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'.split("").map((c8) => c8.charCodeAt(0))
    );
  }
});

// ../../node_modules/entities/lib/esm/generated/decode-data-xml.js
var decode_data_xml_default;
var init_decode_data_xml = __esm({
  "../../node_modules/entities/lib/esm/generated/decode-data-xml.js"() {
    decode_data_xml_default = new Uint16Array(
      // prettier-ignore
      "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022".split("").map((c8) => c8.charCodeAt(0))
    );
  }
});

// ../../node_modules/entities/lib/esm/decode_codepoint.js
function replaceCodePoint(codePoint) {
  var _a7;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a7 = decodeMap.get(codePoint)) !== null && _a7 !== void 0 ? _a7 : codePoint;
}
var _a6, decodeMap, fromCodePoint;
var init_decode_codepoint = __esm({
  "../../node_modules/entities/lib/esm/decode_codepoint.js"() {
    decodeMap = /* @__PURE__ */ new Map([
      [0, 65533],
      // C1 Unicode control character reference replacements
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376]
    ]);
    fromCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
    (_a6 = String.fromCodePoint) !== null && _a6 !== void 0 ? _a6 : function(codePoint) {
      let output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += String.fromCharCode(codePoint);
      return output;
    };
  }
});

// ../../node_modules/entities/lib/esm/decode.js
function isNumber(code2) {
  return code2 >= CharCodes.ZERO && code2 <= CharCodes.NINE;
}
function isHexadecimalCharacter(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_F || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code2) {
  return code2 >= CharCodes.UPPER_A && code2 <= CharCodes.UPPER_Z || code2 >= CharCodes.LOWER_A && code2 <= CharCodes.LOWER_Z || isNumber(code2);
}
function isEntityInAttributeInvalidEnd(code2) {
  return code2 === CharCodes.EQUALS || isAsciiAlphaNumeric(code2);
}
function getDecoder(decodeTree) {
  let ret = "";
  const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint(str));
  return function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder.startEntity(decodeMode);
      const len = decoder.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo = nodeIdx;
  let hi = lo + branchCount - 1;
  while (lo <= hi) {
    const mid = lo + hi >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo = mid + 1;
    } else if (midVal > char) {
      hi = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
function decodeHTML(str, mode = DecodingMode.Legacy) {
  return htmlDecoder(str, mode);
}
var CharCodes, TO_LOWER_BIT, BinTrieFlags, EntityDecoderState, DecodingMode, EntityDecoder, htmlDecoder, xmlDecoder;
var init_decode2 = __esm({
  "../../node_modules/entities/lib/esm/decode.js"() {
    init_decode_data_html();
    init_decode_data_xml();
    init_decode_codepoint();
    init_decode_codepoint();
    (function(CharCodes2) {
      CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
      CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
      CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
      CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
      CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
      CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
      CharCodes2[CharCodes2["LOWER_F"] = 102] = "LOWER_F";
      CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
      CharCodes2[CharCodes2["LOWER_Z"] = 122] = "LOWER_Z";
      CharCodes2[CharCodes2["UPPER_A"] = 65] = "UPPER_A";
      CharCodes2[CharCodes2["UPPER_F"] = 70] = "UPPER_F";
      CharCodes2[CharCodes2["UPPER_Z"] = 90] = "UPPER_Z";
    })(CharCodes || (CharCodes = {}));
    TO_LOWER_BIT = 32;
    (function(BinTrieFlags2) {
      BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
      BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
      BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
    })(BinTrieFlags || (BinTrieFlags = {}));
    (function(EntityDecoderState2) {
      EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
      EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
      EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
      EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
      EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
    })(EntityDecoderState || (EntityDecoderState = {}));
    (function(DecodingMode2) {
      DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
      DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
      DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
    })(DecodingMode || (DecodingMode = {}));
    EntityDecoder = class {
      constructor(decodeTree, emitCodePoint, errors2) {
        this.decodeTree = decodeTree;
        this.emitCodePoint = emitCodePoint;
        this.errors = errors2;
        this.state = EntityDecoderState.EntityStart;
        this.consumed = 1;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.decodeMode = DecodingMode.Strict;
      }
      /** Resets the instance to make it reusable. */
      startEntity(decodeMode) {
        this.decodeMode = decodeMode;
        this.state = EntityDecoderState.EntityStart;
        this.result = 0;
        this.treeIndex = 0;
        this.excess = 1;
        this.consumed = 1;
      }
      /**
       * Write an entity to the decoder. This can be called multiple times with partial entities.
       * If the entity is incomplete, the decoder will return -1.
       *
       * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
       * entity is incomplete, and resume when the next string is written.
       *
       * @param string The string containing the entity (or a continuation of the entity).
       * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      write(str, offset) {
        switch (this.state) {
          case EntityDecoderState.EntityStart: {
            if (str.charCodeAt(offset) === CharCodes.NUM) {
              this.state = EntityDecoderState.NumericStart;
              this.consumed += 1;
              return this.stateNumericStart(str, offset + 1);
            }
            this.state = EntityDecoderState.NamedEntity;
            return this.stateNamedEntity(str, offset);
          }
          case EntityDecoderState.NumericStart: {
            return this.stateNumericStart(str, offset);
          }
          case EntityDecoderState.NumericDecimal: {
            return this.stateNumericDecimal(str, offset);
          }
          case EntityDecoderState.NumericHex: {
            return this.stateNumericHex(str, offset);
          }
          case EntityDecoderState.NamedEntity: {
            return this.stateNamedEntity(str, offset);
          }
        }
      }
      /**
       * Switches between the numeric decimal and hexadecimal states.
       *
       * Equivalent to the `Numeric character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericStart(str, offset) {
        if (offset >= str.length) {
          return -1;
        }
        if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
          this.state = EntityDecoderState.NumericHex;
          this.consumed += 1;
          return this.stateNumericHex(str, offset + 1);
        }
        this.state = EntityDecoderState.NumericDecimal;
        return this.stateNumericDecimal(str, offset);
      }
      addToNumericResult(str, start, end, base2) {
        if (start !== end) {
          const digitCount = end - start;
          this.result = this.result * Math.pow(base2, digitCount) + parseInt(str.substr(start, digitCount), base2);
          this.consumed += digitCount;
        }
      }
      /**
       * Parses a hexadecimal numeric entity.
       *
       * Equivalent to the `Hexademical character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericHex(str, offset) {
        const startIdx = offset;
        while (offset < str.length) {
          const char = str.charCodeAt(offset);
          if (isNumber(char) || isHexadecimalCharacter(char)) {
            offset += 1;
          } else {
            this.addToNumericResult(str, startIdx, offset, 16);
            return this.emitNumericEntity(char, 3);
          }
        }
        this.addToNumericResult(str, startIdx, offset, 16);
        return -1;
      }
      /**
       * Parses a decimal numeric entity.
       *
       * Equivalent to the `Decimal character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNumericDecimal(str, offset) {
        const startIdx = offset;
        while (offset < str.length) {
          const char = str.charCodeAt(offset);
          if (isNumber(char)) {
            offset += 1;
          } else {
            this.addToNumericResult(str, startIdx, offset, 10);
            return this.emitNumericEntity(char, 2);
          }
        }
        this.addToNumericResult(str, startIdx, offset, 10);
        return -1;
      }
      /**
       * Validate and emit a numeric entity.
       *
       * Implements the logic from the `Hexademical character reference start
       * state` and `Numeric character reference end state` in the HTML spec.
       *
       * @param lastCp The last code point of the entity. Used to see if the
       *               entity was terminated with a semicolon.
       * @param expectedLength The minimum number of characters that should be
       *                       consumed. Used to validate that at least one digit
       *                       was consumed.
       * @returns The number of characters that were consumed.
       */
      emitNumericEntity(lastCp, expectedLength) {
        var _a7;
        if (this.consumed <= expectedLength) {
          (_a7 = this.errors) === null || _a7 === void 0 ? void 0 : _a7.absenceOfDigitsInNumericCharacterReference(this.consumed);
          return 0;
        }
        if (lastCp === CharCodes.SEMI) {
          this.consumed += 1;
        } else if (this.decodeMode === DecodingMode.Strict) {
          return 0;
        }
        this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
        if (this.errors) {
          if (lastCp !== CharCodes.SEMI) {
            this.errors.missingSemicolonAfterCharacterReference();
          }
          this.errors.validateNumericCharacterReference(this.result);
        }
        return this.consumed;
      }
      /**
       * Parses a named entity.
       *
       * Equivalent to the `Named character reference state` in the HTML spec.
       *
       * @param str The string containing the entity (or a continuation of the entity).
       * @param offset The current offset.
       * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
       */
      stateNamedEntity(str, offset) {
        const { decodeTree } = this;
        let current = decodeTree[this.treeIndex];
        let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
        for (; offset < str.length; offset++, this.excess++) {
          const char = str.charCodeAt(offset);
          this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
          if (this.treeIndex < 0) {
            return this.result === 0 || // If we are parsing an attribute
            this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
            (valueLength === 0 || // And there should be no invalid characters.
            isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
          }
          current = decodeTree[this.treeIndex];
          valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
          if (valueLength !== 0) {
            if (char === CharCodes.SEMI) {
              return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
            }
            if (this.decodeMode !== DecodingMode.Strict) {
              this.result = this.treeIndex;
              this.consumed += this.excess;
              this.excess = 0;
            }
          }
        }
        return -1;
      }
      /**
       * Emit a named entity that was not terminated with a semicolon.
       *
       * @returns The number of characters consumed.
       */
      emitNotTerminatedNamedEntity() {
        var _a7;
        const { result, decodeTree } = this;
        const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
        this.emitNamedEntityData(result, valueLength, this.consumed);
        (_a7 = this.errors) === null || _a7 === void 0 ? void 0 : _a7.missingSemicolonAfterCharacterReference();
        return this.consumed;
      }
      /**
       * Emit a named entity.
       *
       * @param result The index of the entity in the decode tree.
       * @param valueLength The number of bytes in the entity.
       * @param consumed The number of characters consumed.
       *
       * @returns The number of characters consumed.
       */
      emitNamedEntityData(result, valueLength, consumed) {
        const { decodeTree } = this;
        this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
        if (valueLength === 3) {
          this.emitCodePoint(decodeTree[result + 2], consumed);
        }
        return consumed;
      }
      /**
       * Signal to the parser that the end of the input was reached.
       *
       * Remaining data will be emitted and relevant errors will be produced.
       *
       * @returns The number of characters consumed.
       */
      end() {
        var _a7;
        switch (this.state) {
          case EntityDecoderState.NamedEntity: {
            return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
          }
          // Otherwise, emit a numeric entity if we have one.
          case EntityDecoderState.NumericDecimal: {
            return this.emitNumericEntity(0, 2);
          }
          case EntityDecoderState.NumericHex: {
            return this.emitNumericEntity(0, 3);
          }
          case EntityDecoderState.NumericStart: {
            (_a7 = this.errors) === null || _a7 === void 0 ? void 0 : _a7.absenceOfDigitsInNumericCharacterReference(this.consumed);
            return 0;
          }
          case EntityDecoderState.EntityStart: {
            return 0;
          }
        }
      }
    };
    htmlDecoder = getDecoder(decode_data_html_default);
    xmlDecoder = getDecoder(decode_data_xml_default);
  }
});

// ../../node_modules/entities/lib/esm/generated/encode-html.js
function restoreDiff(arr) {
  for (let i11 = 1; i11 < arr.length; i11++) {
    arr[i11][0] += arr[i11 - 1][0] + 1;
  }
  return arr;
}
var encode_html_default;
var init_encode_html = __esm({
  "../../node_modules/entities/lib/esm/generated/encode-html.js"() {
    encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));
  }
});

// ../../node_modules/entities/lib/esm/escape.js
function getEscaper(regex, map2) {
  return function escape3(data) {
    let match2;
    let lastIdx = 0;
    let result = "";
    while (match2 = regex.exec(data)) {
      if (lastIdx !== match2.index) {
        result += data.substring(lastIdx, match2.index);
      }
      result += map2.get(match2[0].charCodeAt(0));
      lastIdx = match2.index + 1;
    }
    return result + data.substring(lastIdx);
  };
}
var xmlCodeMap, getCodePoint, escapeUTF8, escapeAttribute, escapeText;
var init_escape = __esm({
  "../../node_modules/entities/lib/esm/escape.js"() {
    xmlCodeMap = /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [39, "&apos;"],
      [60, "&lt;"],
      [62, "&gt;"]
    ]);
    getCodePoint = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
      // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      (c8, index) => (c8.charCodeAt(index) & 64512) === 55296 ? (c8.charCodeAt(index) - 55296) * 1024 + c8.charCodeAt(index + 1) - 56320 + 65536 : c8.charCodeAt(index)
    );
    escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
    escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
      [34, "&quot;"],
      [38, "&amp;"],
      [160, "&nbsp;"]
    ]));
    escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [160, "&nbsp;"]
    ]));
  }
});

// ../../node_modules/entities/lib/esm/encode.js
var init_encode2 = __esm({
  "../../node_modules/entities/lib/esm/encode.js"() {
    init_encode_html();
    init_escape();
  }
});

// ../../node_modules/entities/lib/esm/index.js
var EntityLevel, EncodingMode;
var init_esm = __esm({
  "../../node_modules/entities/lib/esm/index.js"() {
    init_decode2();
    init_encode2();
    init_escape();
    init_escape();
    init_encode2();
    init_decode2();
    (function(EntityLevel2) {
      EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
      EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
    })(EntityLevel || (EntityLevel = {}));
    (function(EncodingMode2) {
      EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
      EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
      EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
      EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
      EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
    })(EncodingMode || (EncodingMode = {}));
  }
});

// ../../node_modules/markdown-it/lib/common/utils.mjs
var utils_exports2 = {};
__export(utils_exports2, {
  arrayReplaceAt: () => arrayReplaceAt,
  assign: () => assign,
  escapeHtml: () => escapeHtml,
  escapeRE: () => escapeRE,
  fromCodePoint: () => fromCodePoint2,
  has: () => has,
  isMdAsciiPunct: () => isMdAsciiPunct,
  isPunctChar: () => isPunctChar,
  isSpace: () => isSpace,
  isString: () => isString,
  isValidEntityCode: () => isValidEntityCode,
  isWhiteSpace: () => isWhiteSpace,
  lib: () => lib,
  normalizeReference: () => normalizeReference,
  unescapeAll: () => unescapeAll,
  unescapeMd: () => unescapeMd
});
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function isString(obj) {
  return _class(obj) === "[object String]";
}
function has(object, key) {
  return _hasOwnProperty.call(object, key);
}
function assign(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be object");
    }
    Object.keys(source || {}).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
function isValidEntityCode(c8) {
  if (c8 >= 55296 && c8 <= 57343) {
    return false;
  }
  if (c8 >= 64976 && c8 <= 65007) {
    return false;
  }
  if ((c8 & 65535) === 65535 || (c8 & 65535) === 65534) {
    return false;
  }
  if (c8 >= 0 && c8 <= 8) {
    return false;
  }
  if (c8 === 11) {
    return false;
  }
  if (c8 >= 14 && c8 <= 31) {
    return false;
  }
  if (c8 >= 127 && c8 <= 159) {
    return false;
  }
  if (c8 > 1114111) {
    return false;
  }
  return true;
}
function fromCodePoint2(c8) {
  if (c8 > 65535) {
    c8 -= 65536;
    const surrogate1 = 55296 + (c8 >> 10);
    const surrogate2 = 56320 + (c8 & 1023);
    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c8);
}
function replaceEntityPattern(match2, name) {
  if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
    const code2 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    if (isValidEntityCode(code2)) {
      return fromCodePoint2(code2);
    }
    return match2;
  }
  const decoded = decodeHTML(match2);
  if (decoded !== match2) {
    return decoded;
  }
  return match2;
}
function unescapeMd(str) {
  if (str.indexOf("\\") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_MD_RE, "$1");
}
function unescapeAll(str) {
  if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
    return str;
  }
  return str.replace(UNESCAPE_ALL_RE, function(match2, escaped, entity2) {
    if (escaped) {
      return escaped;
    }
    return replaceEntityPattern(match2, entity2);
  });
}
function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}
function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
function escapeRE(str) {
  return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
function isSpace(code2) {
  switch (code2) {
    case 9:
    case 32:
      return true;
  }
  return false;
}
function isWhiteSpace(code2) {
  if (code2 >= 8192 && code2 <= 8202) {
    return true;
  }
  switch (code2) {
    case 9:
    // \t
    case 10:
    // \n
    case 11:
    // \v
    case 12:
    // \f
    case 13:
    // \r
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return true;
  }
  return false;
}
function isPunctChar(ch) {
  return regex_default4.test(ch) || regex_default5.test(ch);
}
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function normalizeReference(str) {
  str = str.trim().replace(/\s+/g, " ");
  if ("\u1E9E".toLowerCase() === "\u1E7E") {
    str = str.replace(/ẞ/g, "\xDF");
  }
  return str.toLowerCase().toUpperCase();
}
var _hasOwnProperty, UNESCAPE_MD_RE, ENTITY_RE, UNESCAPE_ALL_RE, DIGITAL_ENTITY_TEST_RE, HTML_ESCAPE_TEST_RE, HTML_ESCAPE_REPLACE_RE, HTML_REPLACEMENTS, REGEXP_ESCAPE_RE, lib;
var init_utils = __esm({
  "../../node_modules/markdown-it/lib/common/utils.mjs"() {
    init_mdurl();
    init_uc();
    init_esm();
    _hasOwnProperty = Object.prototype.hasOwnProperty;
    UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
    ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
    UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
    DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
    HTML_ESCAPE_TEST_RE = /[&<>"]/;
    HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
    HTML_REPLACEMENTS = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    };
    REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
    lib = { mdurl: mdurl_exports, ucmicro: uc_exports };
  }
});

// ../../node_modules/markdown-it/lib/helpers/parse_link_label.mjs
function parseLinkLabel(state, start, disableNested) {
  let level, found, marker, prevPos;
  const max = state.posMax;
  const oldPos = state.pos;
  state.pos = start + 1;
  level = 1;
  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 93) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }
    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 91) {
      if (prevPos === state.pos - 1) {
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }
  let labelEnd = -1;
  if (found) {
    labelEnd = state.pos;
  }
  state.pos = oldPos;
  return labelEnd;
}
var init_parse_link_label = __esm({
  "../../node_modules/markdown-it/lib/helpers/parse_link_label.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/helpers/parse_link_destination.mjs
function parseLinkDestination(str, start, max) {
  let code2;
  let pos = start;
  const result = {
    ok: false,
    pos: 0,
    str: ""
  };
  if (str.charCodeAt(pos) === 60) {
    pos++;
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === 10) {
        return result;
      }
      if (code2 === 60) {
        return result;
      }
      if (code2 === 62) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code2 === 92 && pos + 1 < max) {
        pos += 2;
        continue;
      }
      pos++;
    }
    return result;
  }
  let level = 0;
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === 32) {
      break;
    }
    if (code2 < 32 || code2 === 127) {
      break;
    }
    if (code2 === 92 && pos + 1 < max) {
      if (str.charCodeAt(pos + 1) === 32) {
        break;
      }
      pos += 2;
      continue;
    }
    if (code2 === 40) {
      level++;
      if (level > 32) {
        return result;
      }
    }
    if (code2 === 41) {
      if (level === 0) {
        break;
      }
      level--;
    }
    pos++;
  }
  if (start === pos) {
    return result;
  }
  if (level !== 0) {
    return result;
  }
  result.str = unescapeAll(str.slice(start, pos));
  result.pos = pos;
  result.ok = true;
  return result;
}
var init_parse_link_destination = __esm({
  "../../node_modules/markdown-it/lib/helpers/parse_link_destination.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/helpers/parse_link_title.mjs
function parseLinkTitle(str, start, max, prev_state) {
  let code2;
  let pos = start;
  const state = {
    // if `true`, this is a valid link title
    ok: false,
    // if `true`, this link can be continued on the next line
    can_continue: false,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (prev_state) {
    state.str = prev_state.str;
    state.marker = prev_state.marker;
  } else {
    if (pos >= max) {
      return state;
    }
    let marker = str.charCodeAt(pos);
    if (marker !== 34 && marker !== 39 && marker !== 40) {
      return state;
    }
    start++;
    pos++;
    if (marker === 40) {
      marker = 41;
    }
    state.marker = marker;
  }
  while (pos < max) {
    code2 = str.charCodeAt(pos);
    if (code2 === state.marker) {
      state.pos = pos + 1;
      state.str += unescapeAll(str.slice(start, pos));
      state.ok = true;
      return state;
    } else if (code2 === 40 && state.marker === 41) {
      return state;
    } else if (code2 === 92 && pos + 1 < max) {
      pos++;
    }
    pos++;
  }
  state.can_continue = true;
  state.str += unescapeAll(str.slice(start, pos));
  return state;
}
var init_parse_link_title = __esm({
  "../../node_modules/markdown-it/lib/helpers/parse_link_title.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/helpers/index.mjs
var helpers_exports = {};
__export(helpers_exports, {
  parseLinkDestination: () => parseLinkDestination,
  parseLinkLabel: () => parseLinkLabel,
  parseLinkTitle: () => parseLinkTitle
});
var init_helpers = __esm({
  "../../node_modules/markdown-it/lib/helpers/index.mjs"() {
    init_parse_link_label();
    init_parse_link_destination();
    init_parse_link_title();
  }
});

// ../../node_modules/markdown-it/lib/renderer.mjs
function Renderer() {
  this.rules = assign({}, default_rules);
}
var default_rules, renderer_default;
var init_renderer = __esm({
  "../../node_modules/markdown-it/lib/renderer.mjs"() {
    init_utils();
    default_rules = {};
    default_rules.code_inline = function(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(token.content) + "</code>";
    };
    default_rules.code_block = function(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
    };
    default_rules.fence = function(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      const info = token.info ? unescapeAll(token.info).trim() : "";
      let langName = "";
      let langAttrs = "";
      if (info) {
        const arr = info.split(/(\s+)/g);
        langName = arr[0];
        langAttrs = arr.slice(2).join("");
      }
      let highlighted;
      if (options.highlight) {
        highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
      } else {
        highlighted = escapeHtml(token.content);
      }
      if (highlighted.indexOf("<pre") === 0) {
        return highlighted + "\n";
      }
      if (info) {
        const i11 = token.attrIndex("class");
        const tmpAttrs = token.attrs ? token.attrs.slice() : [];
        if (i11 < 0) {
          tmpAttrs.push(["class", options.langPrefix + langName]);
        } else {
          tmpAttrs[i11] = tmpAttrs[i11].slice();
          tmpAttrs[i11][1] += " " + options.langPrefix + langName;
        }
        const tmpToken = {
          attrs: tmpAttrs
        };
        return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
      }
      return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>
`;
    };
    default_rules.image = function(tokens, idx, options, env, slf) {
      const token = tokens[idx];
      token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
      return slf.renderToken(tokens, idx, options);
    };
    default_rules.hardbreak = function(tokens, idx, options) {
      return options.xhtmlOut ? "<br />\n" : "<br>\n";
    };
    default_rules.softbreak = function(tokens, idx, options) {
      return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
    };
    default_rules.text = function(tokens, idx) {
      return escapeHtml(tokens[idx].content);
    };
    default_rules.html_block = function(tokens, idx) {
      return tokens[idx].content;
    };
    default_rules.html_inline = function(tokens, idx) {
      return tokens[idx].content;
    };
    Renderer.prototype.renderAttrs = function renderAttrs(token) {
      let i11, l5, result;
      if (!token.attrs) {
        return "";
      }
      result = "";
      for (i11 = 0, l5 = token.attrs.length; i11 < l5; i11++) {
        result += " " + escapeHtml(token.attrs[i11][0]) + '="' + escapeHtml(token.attrs[i11][1]) + '"';
      }
      return result;
    };
    Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
      const token = tokens[idx];
      let result = "";
      if (token.hidden) {
        return "";
      }
      if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
        result += "\n";
      }
      result += (token.nesting === -1 ? "</" : "<") + token.tag;
      result += this.renderAttrs(token);
      if (token.nesting === 0 && options.xhtmlOut) {
        result += " /";
      }
      let needLf = false;
      if (token.block) {
        needLf = true;
        if (token.nesting === 1) {
          if (idx + 1 < tokens.length) {
            const nextToken = tokens[idx + 1];
            if (nextToken.type === "inline" || nextToken.hidden) {
              needLf = false;
            } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
              needLf = false;
            }
          }
        }
      }
      result += needLf ? ">\n" : ">";
      return result;
    };
    Renderer.prototype.renderInline = function(tokens, options, env) {
      let result = "";
      const rules = this.rules;
      for (let i11 = 0, len = tokens.length; i11 < len; i11++) {
        const type2 = tokens[i11].type;
        if (typeof rules[type2] !== "undefined") {
          result += rules[type2](tokens, i11, options, env, this);
        } else {
          result += this.renderToken(tokens, i11, options);
        }
      }
      return result;
    };
    Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
      let result = "";
      for (let i11 = 0, len = tokens.length; i11 < len; i11++) {
        switch (tokens[i11].type) {
          case "text":
            result += tokens[i11].content;
            break;
          case "image":
            result += this.renderInlineAsText(tokens[i11].children, options, env);
            break;
          case "html_inline":
          case "html_block":
            result += tokens[i11].content;
            break;
          case "softbreak":
          case "hardbreak":
            result += "\n";
            break;
          default:
        }
      }
      return result;
    };
    Renderer.prototype.render = function(tokens, options, env) {
      let result = "";
      const rules = this.rules;
      for (let i11 = 0, len = tokens.length; i11 < len; i11++) {
        const type2 = tokens[i11].type;
        if (type2 === "inline") {
          result += this.renderInline(tokens[i11].children, options, env);
        } else if (typeof rules[type2] !== "undefined") {
          result += rules[type2](tokens, i11, options, env, this);
        } else {
          result += this.renderToken(tokens, i11, options, env);
        }
      }
      return result;
    };
    renderer_default = Renderer;
  }
});

// ../../node_modules/markdown-it/lib/ruler.mjs
function Ruler() {
  this.__rules__ = [];
  this.__cache__ = null;
}
var ruler_default;
var init_ruler = __esm({
  "../../node_modules/markdown-it/lib/ruler.mjs"() {
    Ruler.prototype.__find__ = function(name) {
      for (let i11 = 0; i11 < this.__rules__.length; i11++) {
        if (this.__rules__[i11].name === name) {
          return i11;
        }
      }
      return -1;
    };
    Ruler.prototype.__compile__ = function() {
      const self = this;
      const chains = [""];
      self.__rules__.forEach(function(rule) {
        if (!rule.enabled) {
          return;
        }
        rule.alt.forEach(function(altName) {
          if (chains.indexOf(altName) < 0) {
            chains.push(altName);
          }
        });
      });
      self.__cache__ = {};
      chains.forEach(function(chain) {
        self.__cache__[chain] = [];
        self.__rules__.forEach(function(rule) {
          if (!rule.enabled) {
            return;
          }
          if (chain && rule.alt.indexOf(chain) < 0) {
            return;
          }
          self.__cache__[chain].push(rule.fn);
        });
      });
    };
    Ruler.prototype.at = function(name, fn, options) {
      const index = this.__find__(name);
      const opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + name);
      }
      this.__rules__[index].fn = fn;
      this.__rules__[index].alt = opt.alt || [];
      this.__cache__ = null;
    };
    Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
      const index = this.__find__(beforeName);
      const opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + beforeName);
      }
      this.__rules__.splice(index, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.after = function(afterName, ruleName, fn, options) {
      const index = this.__find__(afterName);
      const opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + afterName);
      }
      this.__rules__.splice(index + 1, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.push = function(ruleName, fn, options) {
      const opt = options || {};
      this.__rules__.push({
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.enable = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      const result = [];
      list2.forEach(function(name) {
        const idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = true;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.enableOnly = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      this.__rules__.forEach(function(rule) {
        rule.enabled = false;
      });
      this.enable(list2, ignoreInvalid);
    };
    Ruler.prototype.disable = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      const result = [];
      list2.forEach(function(name) {
        const idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = false;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.getRules = function(chainName) {
      if (this.__cache__ === null) {
        this.__compile__();
      }
      return this.__cache__[chainName] || [];
    };
    ruler_default = Ruler;
  }
});

// ../../node_modules/markdown-it/lib/token.mjs
function Token(type2, tag, nesting) {
  this.type = type2;
  this.tag = tag;
  this.attrs = null;
  this.map = null;
  this.nesting = nesting;
  this.level = 0;
  this.children = null;
  this.content = "";
  this.markup = "";
  this.info = "";
  this.meta = null;
  this.block = false;
  this.hidden = false;
}
var token_default;
var init_token = __esm({
  "../../node_modules/markdown-it/lib/token.mjs"() {
    Token.prototype.attrIndex = function attrIndex(name) {
      if (!this.attrs) {
        return -1;
      }
      const attrs = this.attrs;
      for (let i11 = 0, len = attrs.length; i11 < len; i11++) {
        if (attrs[i11][0] === name) {
          return i11;
        }
      }
      return -1;
    };
    Token.prototype.attrPush = function attrPush(attrData) {
      if (this.attrs) {
        this.attrs.push(attrData);
      } else {
        this.attrs = [attrData];
      }
    };
    Token.prototype.attrSet = function attrSet(name, value) {
      const idx = this.attrIndex(name);
      const attrData = [name, value];
      if (idx < 0) {
        this.attrPush(attrData);
      } else {
        this.attrs[idx] = attrData;
      }
    };
    Token.prototype.attrGet = function attrGet(name) {
      const idx = this.attrIndex(name);
      let value = null;
      if (idx >= 0) {
        value = this.attrs[idx][1];
      }
      return value;
    };
    Token.prototype.attrJoin = function attrJoin(name, value) {
      const idx = this.attrIndex(name);
      if (idx < 0) {
        this.attrPush([name, value]);
      } else {
        this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
      }
    };
    token_default = Token;
  }
});

// ../../node_modules/markdown-it/lib/rules_core/state_core.mjs
function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md;
}
var state_core_default;
var init_state_core = __esm({
  "../../node_modules/markdown-it/lib/rules_core/state_core.mjs"() {
    init_token();
    StateCore.prototype.Token = token_default;
    state_core_default = StateCore;
  }
});

// ../../node_modules/markdown-it/lib/rules_core/normalize.mjs
function normalize(state) {
  let str;
  str = state.src.replace(NEWLINES_RE, "\n");
  str = str.replace(NULL_RE, "\uFFFD");
  state.src = str;
}
var NEWLINES_RE, NULL_RE;
var init_normalize = __esm({
  "../../node_modules/markdown-it/lib/rules_core/normalize.mjs"() {
    NEWLINES_RE = /\r\n?|\n/g;
    NULL_RE = /\0/g;
  }
});

// ../../node_modules/markdown-it/lib/rules_core/block.mjs
function block(state) {
  let token;
  if (state.inlineMode) {
    token = new state.Token("inline", "", 0);
    token.content = state.src;
    token.map = [0, 1];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
}
var init_block = __esm({
  "../../node_modules/markdown-it/lib/rules_core/block.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_core/inline.mjs
function inline(state) {
  const tokens = state.tokens;
  for (let i11 = 0, l5 = tokens.length; i11 < l5; i11++) {
    const tok = tokens[i11];
    if (tok.type === "inline") {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
}
var init_inline = __esm({
  "../../node_modules/markdown-it/lib/rules_core/inline.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_core/linkify.mjs
function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}
function linkify(state) {
  const blockTokens = state.tokens;
  if (!state.md.options.linkify) {
    return;
  }
  for (let j2 = 0, l5 = blockTokens.length; j2 < l5; j2++) {
    if (blockTokens[j2].type !== "inline" || !state.md.linkify.pretest(blockTokens[j2].content)) {
      continue;
    }
    let tokens = blockTokens[j2].children;
    let htmlLinkLevel = 0;
    for (let i11 = tokens.length - 1; i11 >= 0; i11--) {
      const currentToken = tokens[i11];
      if (currentToken.type === "link_close") {
        i11--;
        while (tokens[i11].level !== currentToken.level && tokens[i11].type !== "link_open") {
          i11--;
        }
        continue;
      }
      if (currentToken.type === "html_inline") {
        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) {
        continue;
      }
      if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
        const text3 = currentToken.content;
        let links = state.md.linkify.match(text3);
        const nodes = [];
        let level = currentToken.level;
        let lastPos = 0;
        if (links.length > 0 && links[0].index === 0 && i11 > 0 && tokens[i11 - 1].type === "text_special") {
          links = links.slice(1);
        }
        for (let ln = 0; ln < links.length; ln++) {
          const url = links[ln].url;
          const fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) {
            continue;
          }
          let urlText = links[ln].text;
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
          } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }
          const pos = links[ln].index;
          if (pos > lastPos) {
            const token = new state.Token("text", "", 0);
            token.content = text3.slice(lastPos, pos);
            token.level = level;
            nodes.push(token);
          }
          const token_o = new state.Token("link_open", "a", 1);
          token_o.attrs = [["href", fullUrl]];
          token_o.level = level++;
          token_o.markup = "linkify";
          token_o.info = "auto";
          nodes.push(token_o);
          const token_t = new state.Token("text", "", 0);
          token_t.content = urlText;
          token_t.level = level;
          nodes.push(token_t);
          const token_c = new state.Token("link_close", "a", -1);
          token_c.level = --level;
          token_c.markup = "linkify";
          token_c.info = "auto";
          nodes.push(token_c);
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text3.length) {
          const token = new state.Token("text", "", 0);
          token.content = text3.slice(lastPos);
          token.level = level;
          nodes.push(token);
        }
        blockTokens[j2].children = tokens = arrayReplaceAt(tokens, i11, nodes);
      }
    }
  }
}
var init_linkify = __esm({
  "../../node_modules/markdown-it/lib/rules_core/linkify.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_core/replacements.mjs
function replaceFn(match2, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
  let inside_autolink = 0;
  for (let i11 = inlineTokens.length - 1; i11 >= 0; i11--) {
    const token = inlineTokens[i11];
    if (token.type === "text" && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace_rare(inlineTokens) {
  let inside_autolink = 0;
  for (let i11 = inlineTokens.length - 1; i11 >= 0; i11--) {
    const token = inlineTokens[i11];
    if (token.type === "text" && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1\u2014").replace(/(^|\s)--(?=\s|$)/mg, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1\u2013");
      }
    }
    if (token.type === "link_open" && token.info === "auto") {
      inside_autolink--;
    }
    if (token.type === "link_close" && token.info === "auto") {
      inside_autolink++;
    }
  }
}
function replace(state) {
  let blkIdx;
  if (!state.md.options.typographer) {
    return;
  }
  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline") {
      continue;
    }
    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }
    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }
  }
}
var RARE_RE, SCOPED_ABBR_TEST_RE, SCOPED_ABBR_RE, SCOPED_ABBR;
var init_replacements = __esm({
  "../../node_modules/markdown-it/lib/rules_core/replacements.mjs"() {
    RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
    SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
    SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
    SCOPED_ABBR = {
      c: "\xA9",
      r: "\xAE",
      tm: "\u2122"
    };
  }
});

// ../../node_modules/markdown-it/lib/rules_core/smartquotes.mjs
function replaceAt(str, index, ch) {
  return str.slice(0, index) + ch + str.slice(index + 1);
}
function process_inlines(tokens, state) {
  let j2;
  const stack = [];
  for (let i11 = 0; i11 < tokens.length; i11++) {
    const token = tokens[i11];
    const thisLevel = tokens[i11].level;
    for (j2 = stack.length - 1; j2 >= 0; j2--) {
      if (stack[j2].level <= thisLevel) {
        break;
      }
    }
    stack.length = j2 + 1;
    if (token.type !== "text") {
      continue;
    }
    let text3 = token.content;
    let pos = 0;
    let max = text3.length;
    OUTER:
      while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        const t7 = QUOTE_RE.exec(text3);
        if (!t7) {
          break;
        }
        let canOpen = true;
        let canClose = true;
        pos = t7.index + 1;
        const isSingle = t7[0] === "'";
        let lastChar = 32;
        if (t7.index - 1 >= 0) {
          lastChar = text3.charCodeAt(t7.index - 1);
        } else {
          for (j2 = i11 - 1; j2 >= 0; j2--) {
            if (tokens[j2].type === "softbreak" || tokens[j2].type === "hardbreak") break;
            if (!tokens[j2].content) continue;
            lastChar = tokens[j2].content.charCodeAt(tokens[j2].content.length - 1);
            break;
          }
        }
        let nextChar = 32;
        if (pos < max) {
          nextChar = text3.charCodeAt(pos);
        } else {
          for (j2 = i11 + 1; j2 < tokens.length; j2++) {
            if (tokens[j2].type === "softbreak" || tokens[j2].type === "hardbreak") break;
            if (!tokens[j2].content) continue;
            nextChar = tokens[j2].content.charCodeAt(0);
            break;
          }
        }
        const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
        const isLastWhiteSpace = isWhiteSpace(lastChar);
        const isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) {
          canOpen = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            canOpen = false;
          }
        }
        if (isLastWhiteSpace) {
          canClose = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            canClose = false;
          }
        }
        if (nextChar === 34 && t7[0] === '"') {
          if (lastChar >= 48 && lastChar <= 57) {
            canClose = canOpen = false;
          }
        }
        if (canOpen && canClose) {
          canOpen = isLastPunctChar;
          canClose = isNextPunctChar;
        }
        if (!canOpen && !canClose) {
          if (isSingle) {
            token.content = replaceAt(token.content, t7.index, APOSTROPHE);
          }
          continue;
        }
        if (canClose) {
          for (j2 = stack.length - 1; j2 >= 0; j2--) {
            let item = stack[j2];
            if (stack[j2].level < thisLevel) {
              break;
            }
            if (item.single === isSingle && stack[j2].level === thisLevel) {
              item = stack[j2];
              let openQuote;
              let closeQuote;
              if (isSingle) {
                openQuote = state.md.options.quotes[2];
                closeQuote = state.md.options.quotes[3];
              } else {
                openQuote = state.md.options.quotes[0];
                closeQuote = state.md.options.quotes[1];
              }
              token.content = replaceAt(token.content, t7.index, closeQuote);
              tokens[item.token].content = replaceAt(
                tokens[item.token].content,
                item.pos,
                openQuote
              );
              pos += closeQuote.length - 1;
              if (item.token === i11) {
                pos += openQuote.length - 1;
              }
              text3 = token.content;
              max = text3.length;
              stack.length = j2;
              continue OUTER;
            }
          }
        }
        if (canOpen) {
          stack.push({
            token: i11,
            pos: t7.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t7.index, APOSTROPHE);
        }
      }
  }
}
function smartquotes(state) {
  if (!state.md.options.typographer) {
    return;
  }
  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }
    process_inlines(state.tokens[blkIdx].children, state);
  }
}
var QUOTE_TEST_RE, QUOTE_RE, APOSTROPHE;
var init_smartquotes = __esm({
  "../../node_modules/markdown-it/lib/rules_core/smartquotes.mjs"() {
    init_utils();
    QUOTE_TEST_RE = /['"]/;
    QUOTE_RE = /['"]/g;
    APOSTROPHE = "\u2019";
  }
});

// ../../node_modules/markdown-it/lib/rules_core/text_join.mjs
function text_join(state) {
  let curr, last;
  const blockTokens = state.tokens;
  const l5 = blockTokens.length;
  for (let j2 = 0; j2 < l5; j2++) {
    if (blockTokens[j2].type !== "inline") continue;
    const tokens = blockTokens[j2].children;
    const max = tokens.length;
    for (curr = 0; curr < max; curr++) {
      if (tokens[curr].type === "text_special") {
        tokens[curr].type = "text";
      }
    }
    for (curr = last = 0; curr < max; curr++) {
      if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
      } else {
        if (curr !== last) {
          tokens[last] = tokens[curr];
        }
        last++;
      }
    }
    if (curr !== last) {
      tokens.length = last;
    }
  }
}
var init_text_join = __esm({
  "../../node_modules/markdown-it/lib/rules_core/text_join.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/parser_core.mjs
function Core() {
  this.ruler = new ruler_default();
  for (let i11 = 0; i11 < _rules.length; i11++) {
    this.ruler.push(_rules[i11][0], _rules[i11][1]);
  }
}
var _rules, parser_core_default;
var init_parser_core = __esm({
  "../../node_modules/markdown-it/lib/parser_core.mjs"() {
    init_ruler();
    init_state_core();
    init_normalize();
    init_block();
    init_inline();
    init_linkify();
    init_replacements();
    init_smartquotes();
    init_text_join();
    _rules = [
      ["normalize", normalize],
      ["block", block],
      ["inline", inline],
      ["linkify", linkify],
      ["replacements", replace],
      ["smartquotes", smartquotes],
      // `text_join` finds `text_special` tokens (for escape sequences)
      // and joins them with the rest of the text
      ["text_join", text_join]
    ];
    Core.prototype.process = function(state) {
      const rules = this.ruler.getRules("");
      for (let i11 = 0, l5 = rules.length; i11 < l5; i11++) {
        rules[i11](state);
      }
    };
    Core.prototype.State = state_core_default;
    parser_core_default = Core;
  }
});

// ../../node_modules/markdown-it/lib/rules_block/state_block.mjs
function StateBlock(src, md, env, tokens) {
  this.src = src;
  this.md = md;
  this.env = env;
  this.tokens = tokens;
  this.bMarks = [];
  this.eMarks = [];
  this.tShift = [];
  this.sCount = [];
  this.bsCount = [];
  this.blkIndent = 0;
  this.line = 0;
  this.lineMax = 0;
  this.tight = false;
  this.ddIndent = -1;
  this.listIndent = -1;
  this.parentType = "root";
  this.level = 0;
  const s11 = this.src;
  for (let start = 0, pos = 0, indent = 0, offset = 0, len = s11.length, indent_found = false; pos < len; pos++) {
    const ch = s11.charCodeAt(pos);
    if (!indent_found) {
      if (isSpace(ch)) {
        indent++;
        if (ch === 9) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
        continue;
      } else {
        indent_found = true;
      }
    }
    if (ch === 10 || pos === len - 1) {
      if (ch !== 10) {
        pos++;
      }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      this.sCount.push(offset);
      this.bsCount.push(0);
      indent_found = false;
      indent = 0;
      offset = 0;
      start = pos + 1;
    }
  }
  this.bMarks.push(s11.length);
  this.eMarks.push(s11.length);
  this.tShift.push(0);
  this.sCount.push(0);
  this.bsCount.push(0);
  this.lineMax = this.bMarks.length - 1;
}
var state_block_default;
var init_state_block = __esm({
  "../../node_modules/markdown-it/lib/rules_block/state_block.mjs"() {
    init_token();
    init_utils();
    StateBlock.prototype.push = function(type2, tag, nesting) {
      const token = new token_default(type2, tag, nesting);
      token.block = true;
      if (nesting < 0) this.level--;
      token.level = this.level;
      if (nesting > 0) this.level++;
      this.tokens.push(token);
      return token;
    };
    StateBlock.prototype.isEmpty = function isEmpty(line) {
      return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
    };
    StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
      for (let max = this.lineMax; from < max; from++) {
        if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
          break;
        }
      }
      return from;
    };
    StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
      for (let max = this.src.length; pos < max; pos++) {
        const ch = this.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (!isSpace(this.src.charCodeAt(--pos))) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipChars = function skipChars(pos, code2) {
      for (let max = this.src.length; pos < max; pos++) {
        if (this.src.charCodeAt(pos) !== code2) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code2, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (code2 !== this.src.charCodeAt(--pos)) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
      if (begin >= end) {
        return "";
      }
      const queue = new Array(end - begin);
      for (let i11 = 0, line = begin; line < end; line++, i11++) {
        let lineIndent = 0;
        const lineStart = this.bMarks[line];
        let first = lineStart;
        let last;
        if (line + 1 < end || keepLastLF) {
          last = this.eMarks[line] + 1;
        } else {
          last = this.eMarks[line];
        }
        while (first < last && lineIndent < indent) {
          const ch = this.src.charCodeAt(first);
          if (isSpace(ch)) {
            if (ch === 9) {
              lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
            } else {
              lineIndent++;
            }
          } else if (first - lineStart < this.tShift[line]) {
            lineIndent++;
          } else {
            break;
          }
          first++;
        }
        if (lineIndent > indent) {
          queue[i11] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
        } else {
          queue[i11] = this.src.slice(first, last);
        }
      }
      return queue.join("");
    };
    StateBlock.prototype.Token = token_default;
    state_block_default = StateBlock;
  }
});

// ../../node_modules/markdown-it/lib/rules_block/table.mjs
function getLine(state, line) {
  const pos = state.bMarks[line] + state.tShift[line];
  const max = state.eMarks[line];
  return state.src.slice(pos, max);
}
function escapedSplit(str) {
  const result = [];
  const max = str.length;
  let pos = 0;
  let ch = str.charCodeAt(pos);
  let isEscaped = false;
  let lastPos = 0;
  let current = "";
  while (pos < max) {
    if (ch === 124) {
      if (!isEscaped) {
        result.push(current + str.substring(lastPos, pos));
        current = "";
        lastPos = pos + 1;
      } else {
        current += str.substring(lastPos, pos - 1);
        lastPos = pos;
      }
    }
    isEscaped = ch === 92;
    pos++;
    ch = str.charCodeAt(pos);
  }
  result.push(current + str.substring(lastPos));
  return result;
}
function table(state, startLine, endLine, silent) {
  if (startLine + 2 > endLine) {
    return false;
  }
  let nextLine = startLine + 1;
  if (state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const firstCh = state.src.charCodeAt(pos++);
  if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
    return false;
  }
  if (pos >= state.eMarks[nextLine]) {
    return false;
  }
  const secondCh = state.src.charCodeAt(pos++);
  if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
    return false;
  }
  if (firstCh === 45 && isSpace(secondCh)) {
    return false;
  }
  while (pos < state.eMarks[nextLine]) {
    const ch = state.src.charCodeAt(pos);
    if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
      return false;
    }
    pos++;
  }
  let lineText = getLine(state, startLine + 1);
  let columns = lineText.split("|");
  const aligns = [];
  for (let i11 = 0; i11 < columns.length; i11++) {
    const t7 = columns[i11].trim();
    if (!t7) {
      if (i11 === 0 || i11 === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }
    if (!/^:?-+:?$/.test(t7)) {
      return false;
    }
    if (t7.charCodeAt(t7.length - 1) === 58) {
      aligns.push(t7.charCodeAt(0) === 58 ? "center" : "right");
    } else if (t7.charCodeAt(0) === 58) {
      aligns.push("left");
    } else {
      aligns.push("");
    }
  }
  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf("|") === -1) {
    return false;
  }
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  columns = escapedSplit(lineText);
  if (columns.length && columns[0] === "") columns.shift();
  if (columns.length && columns[columns.length - 1] === "") columns.pop();
  const columnCount = columns.length;
  if (columnCount === 0 || columnCount !== aligns.length) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldParentType = state.parentType;
  state.parentType = "table";
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const token_to = state.push("table_open", "table", 1);
  const tableLines = [startLine, 0];
  token_to.map = tableLines;
  const token_tho = state.push("thead_open", "thead", 1);
  token_tho.map = [startLine, startLine + 1];
  const token_htro = state.push("tr_open", "tr", 1);
  token_htro.map = [startLine, startLine + 1];
  for (let i11 = 0; i11 < columns.length; i11++) {
    const token_ho = state.push("th_open", "th", 1);
    if (aligns[i11]) {
      token_ho.attrs = [["style", "text-align:" + aligns[i11]]];
    }
    const token_il = state.push("inline", "", 0);
    token_il.content = columns[i11].trim();
    token_il.children = [];
    state.push("th_close", "th", -1);
  }
  state.push("tr_close", "tr", -1);
  state.push("thead_close", "thead", -1);
  let tbodyLines;
  let autocompletedCells = 0;
  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    let terminate = false;
    for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
      if (terminatorRules[i11](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    lineText = getLine(state, nextLine).trim();
    if (!lineText) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    autocompletedCells += columnCount - columns.length;
    if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) {
      break;
    }
    if (nextLine === startLine + 2) {
      const token_tbo = state.push("tbody_open", "tbody", 1);
      token_tbo.map = tbodyLines = [startLine + 2, 0];
    }
    const token_tro = state.push("tr_open", "tr", 1);
    token_tro.map = [nextLine, nextLine + 1];
    for (let i11 = 0; i11 < columnCount; i11++) {
      const token_tdo = state.push("td_open", "td", 1);
      if (aligns[i11]) {
        token_tdo.attrs = [["style", "text-align:" + aligns[i11]]];
      }
      const token_il = state.push("inline", "", 0);
      token_il.content = columns[i11] ? columns[i11].trim() : "";
      token_il.children = [];
      state.push("td_close", "td", -1);
    }
    state.push("tr_close", "tr", -1);
  }
  if (tbodyLines) {
    state.push("tbody_close", "tbody", -1);
    tbodyLines[1] = nextLine;
  }
  state.push("table_close", "table", -1);
  tableLines[1] = nextLine;
  state.parentType = oldParentType;
  state.line = nextLine;
  return true;
}
var MAX_AUTOCOMPLETED_CELLS;
var init_table = __esm({
  "../../node_modules/markdown-it/lib/rules_block/table.mjs"() {
    init_utils();
    MAX_AUTOCOMPLETED_CELLS = 65536;
  }
});

// ../../node_modules/markdown-it/lib/rules_block/code.mjs
function code(state, startLine, endLine) {
  if (state.sCount[startLine] - state.blkIndent < 4) {
    return false;
  }
  let nextLine = startLine + 1;
  let last = nextLine;
  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }
  state.line = last;
  const token = state.push("code_block", "code", 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
  token.map = [startLine, state.line];
  return true;
}
var init_code = __esm({
  "../../node_modules/markdown-it/lib/rules_block/code.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_block/fence.mjs
function fence(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (pos + 3 > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== 126 && marker !== 96) {
    return false;
  }
  let mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) {
    return false;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  if (marker === 96) {
    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }
  }
  if (silent) {
    return true;
  }
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      continue;
    }
    pos = state.skipChars(pos, marker);
    if (pos - mem < len) {
      continue;
    }
    pos = state.skipSpaces(pos);
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("fence", "code", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
}
var init_fence = __esm({
  "../../node_modules/markdown-it/lib/rules_block/fence.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_block/blockquote.mjs
function blockquote(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  const oldLineMax = state.lineMax;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 62) {
    return false;
  }
  if (silent) {
    return true;
  }
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const oldParentType = state.parentType;
  state.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state.sCount[nextLine] < state.blkIndent;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos >= max) {
      break;
    }
    if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else {
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }
      let offset = initial;
      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;
      while (pos < max) {
        const ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }
        pos++;
      }
      lastLineEmpty = pos >= max;
      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;
      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty) {
      break;
    }
    let terminate = false;
    for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
      if (terminatorRules[i11](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      state.lineMax = nextLine;
      if (state.blkIndent !== 0) {
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }
      break;
    }
    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);
    state.sCount[nextLine] = -1;
  }
  const oldIndent = state.blkIndent;
  state.blkIndent = 0;
  const token_o = state.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  const lines = [startLine, 0];
  token_o.map = lines;
  state.md.block.tokenize(state, startLine, nextLine);
  const token_c = state.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;
  for (let i11 = 0; i11 < oldTShift.length; i11++) {
    state.bMarks[i11 + startLine] = oldBMarks[i11];
    state.tShift[i11 + startLine] = oldTShift[i11];
    state.sCount[i11 + startLine] = oldSCount[i11];
    state.bsCount[i11 + startLine] = oldBSCount[i11];
  }
  state.blkIndent = oldIndent;
  return true;
}
var init_blockquote = __esm({
  "../../node_modules/markdown-it/lib/rules_block/blockquote.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_block/hr.mjs
function hr(state, startLine, endLine, silent) {
  const max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 95) {
    return false;
  }
  let cnt = 1;
  while (pos < max) {
    const ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) {
      return false;
    }
    if (ch === marker) {
      cnt++;
    }
  }
  if (cnt < 3) {
    return false;
  }
  if (silent) {
    return true;
  }
  state.line = startLine + 1;
  const token = state.push("hr", "hr", 0);
  token.map = [startLine, state.line];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
  return true;
}
var init_hr = __esm({
  "../../node_modules/markdown-it/lib/rules_block/hr.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_block/list.mjs
function skipBulletListMarker(state, startLine) {
  const max = state.eMarks[startLine];
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43) {
    return -1;
  }
  if (pos < max) {
    const ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function skipOrderedListMarker(state, startLine) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let pos = start;
  if (pos + 1 >= max) {
    return -1;
  }
  let ch = state.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57) {
    return -1;
  }
  for (; ; ) {
    if (pos >= max) {
      return -1;
    }
    ch = state.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start >= 10) {
        return -1;
      }
      continue;
    }
    if (ch === 41 || ch === 46) {
      break;
    }
    return -1;
  }
  if (pos < max) {
    ch = state.src.charCodeAt(pos);
    if (!isSpace(ch)) {
      return -1;
    }
  }
  return pos;
}
function markTightParagraphs(state, idx) {
  const level = state.level + 2;
  for (let i11 = idx + 2, l5 = state.tokens.length - 2; i11 < l5; i11++) {
    if (state.tokens[i11].level === level && state.tokens[i11].type === "paragraph_open") {
      state.tokens[i11 + 2].hidden = true;
      state.tokens[i11].hidden = true;
      i11 += 2;
    }
  }
}
function list(state, startLine, endLine, silent) {
  let max, pos, start, token;
  let nextLine = startLine;
  let tight = true;
  if (state.sCount[nextLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  let isTerminatingParagraph = false;
  if (silent && state.parentType === "paragraph") {
    if (state.sCount[nextLine] >= state.blkIndent) {
      isTerminatingParagraph = true;
    }
  }
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[nextLine] + state.tShift[nextLine];
    markerValue = Number(state.src.slice(start, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1) return false;
  } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
  }
  if (silent) {
    return true;
  }
  const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state.tokens.length;
  if (isOrdered) {
    token = state.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) {
      token.attrs = [["start", markerValue]];
    }
  } else {
    token = state.push("bullet_list_open", "ul", 1);
  }
  const listLines = [nextLine, 0];
  token.map = listLines;
  token.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state.md.block.ruler.getRules("list");
  const oldParentType = state.parentType;
  state.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];
    const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (ch === 9) {
        offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      } else if (ch === 32) {
        offset++;
      } else {
        break;
      }
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker;
    if (contentStart >= max) {
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = offset - initial;
    }
    if (indentAfterMarker > 4) {
      indentAfterMarker = 1;
    }
    const indent = initial + indentAfterMarker;
    token = state.push("list_item_open", "li", 1);
    token.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token.map = itemLines;
    if (isOrdered) {
      token.info = state.src.slice(start, posAfterMarker - 1);
    }
    const oldTight = state.tight;
    const oldTShift = state.tShift[nextLine];
    const oldSCount = state.sCount[nextLine];
    const oldListIndent = state.listIndent;
    state.listIndent = state.blkIndent;
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
    state.sCount[nextLine] = offset;
    if (contentStart >= max && state.isEmpty(nextLine + 1)) {
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, nextLine, endLine, true);
    }
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = state.listIndent;
    state.listIndent = oldListIndent;
    state.tShift[nextLine] = oldTShift;
    state.sCount[nextLine] = oldSCount;
    state.tight = oldTight;
    token = state.push("list_item_close", "li", -1);
    token.markup = String.fromCharCode(markerCharCode);
    nextLine = state.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine) {
      break;
    }
    if (state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      break;
    }
    let terminate = false;
    for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
      if (terminatorRules[i11](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
      start = state.bMarks[nextLine] + state.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) {
        break;
      }
    }
    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
      break;
    }
  }
  if (isOrdered) {
    token = state.push("ordered_list_close", "ol", -1);
  } else {
    token = state.push("bullet_list_close", "ul", -1);
  }
  token.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state.line = nextLine;
  state.parentType = oldParentType;
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }
  return true;
}
var init_list = __esm({
  "../../node_modules/markdown-it/lib/rules_block/list.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_block/reference.mjs
function reference(state, startLine, _endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let nextLine = startLine + 1;
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 91) {
    return false;
  }
  function getNextLine(nextLine2) {
    const endLine = state.lineMax;
    if (nextLine2 >= endLine || state.isEmpty(nextLine2)) {
      return null;
    }
    let isContinuation = false;
    if (state.sCount[nextLine2] - state.blkIndent > 3) {
      isContinuation = true;
    }
    if (state.sCount[nextLine2] < 0) {
      isContinuation = true;
    }
    if (!isContinuation) {
      const terminatorRules = state.md.block.ruler.getRules("reference");
      const oldParentType = state.parentType;
      state.parentType = "reference";
      let terminate = false;
      for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
        if (terminatorRules[i11](state, nextLine2, endLine, true)) {
          terminate = true;
          break;
        }
      }
      state.parentType = oldParentType;
      if (terminate) {
        return null;
      }
    }
    const pos2 = state.bMarks[nextLine2] + state.tShift[nextLine2];
    const max2 = state.eMarks[nextLine2];
    return state.src.slice(pos2, max2 + 1);
  }
  let str = state.src.slice(pos, max + 1);
  max = str.length;
  let labelEnd = -1;
  for (pos = 1; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 91) {
      return false;
    } else if (ch === 93) {
      labelEnd = pos;
      break;
    } else if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (ch === 92) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 10) {
        const lineContent = getNextLine(nextLine);
        if (lineContent !== null) {
          str += lineContent;
          max = str.length;
          nextLine++;
        }
      }
    }
  }
  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
    return false;
  }
  for (pos = labelEnd + 2; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch)) {
    } else {
      break;
    }
  }
  const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
  if (!destRes.ok) {
    return false;
  }
  const href = state.md.normalizeLink(destRes.str);
  if (!state.md.validateLink(href)) {
    return false;
  }
  pos = destRes.pos;
  const destEndPos = pos;
  const destEndLineNo = nextLine;
  const start = pos;
  for (; pos < max; pos++) {
    const ch = str.charCodeAt(pos);
    if (ch === 10) {
      const lineContent = getNextLine(nextLine);
      if (lineContent !== null) {
        str += lineContent;
        max = str.length;
        nextLine++;
      }
    } else if (isSpace(ch)) {
    } else {
      break;
    }
  }
  let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
  while (titleRes.can_continue) {
    const lineContent = getNextLine(nextLine);
    if (lineContent === null) break;
    str += lineContent;
    pos = max;
    max = str.length;
    nextLine++;
    titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
  }
  let title;
  if (pos < max && start !== pos && titleRes.ok) {
    title = titleRes.str;
    pos = titleRes.pos;
  } else {
    title = "";
    pos = destEndPos;
    nextLine = destEndLineNo;
  }
  while (pos < max) {
    const ch = str.charCodeAt(pos);
    if (!isSpace(ch)) {
      break;
    }
    pos++;
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    if (title) {
      title = "";
      pos = destEndPos;
      nextLine = destEndLineNo;
      while (pos < max) {
        const ch = str.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
    }
  }
  if (pos < max && str.charCodeAt(pos) !== 10) {
    return false;
  }
  const label = normalizeReference(str.slice(1, labelEnd));
  if (!label) {
    return false;
  }
  if (silent) {
    return true;
  }
  if (typeof state.env.references === "undefined") {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === "undefined") {
    state.env.references[label] = { title, href };
  }
  state.line = nextLine;
  return true;
}
var init_reference = __esm({
  "../../node_modules/markdown-it/lib/rules_block/reference.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/common/html_blocks.mjs
var html_blocks_default;
var init_html_blocks = __esm({
  "../../node_modules/markdown-it/lib/common/html_blocks.mjs"() {
    html_blocks_default = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "search",
      "section",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul"
    ];
  }
});

// ../../node_modules/markdown-it/lib/common/html_re.mjs
var attr_name, unquoted, single_quoted, double_quoted, attr_value, attribute, open_tag, close_tag, comment, processing, declaration, cdata, HTML_TAG_RE, HTML_OPEN_CLOSE_TAG_RE;
var init_html_re = __esm({
  "../../node_modules/markdown-it/lib/common/html_re.mjs"() {
    attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
    unquoted = "[^\"'=<>`\\x00-\\x20]+";
    single_quoted = "'[^']*'";
    double_quoted = '"[^"]*"';
    attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
    attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
    open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
    close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
    comment = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->";
    processing = "<[?][\\s\\S]*?[?]>";
    declaration = "<![A-Za-z][^>]*>";
    cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
    HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
    HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
  }
});

// ../../node_modules/markdown-it/lib/rules_block/html_block.mjs
function html_block(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  if (!state.md.options.html) {
    return false;
  }
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  let lineText = state.src.slice(pos, max);
  let i11 = 0;
  for (; i11 < HTML_SEQUENCES.length; i11++) {
    if (HTML_SEQUENCES[i11][0].test(lineText)) {
      break;
    }
  }
  if (i11 === HTML_SEQUENCES.length) {
    return false;
  }
  if (silent) {
    return HTML_SEQUENCES[i11][2];
  }
  let nextLine = startLine + 1;
  if (!HTML_SEQUENCES[i11][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      if (HTML_SEQUENCES[i11][1].test(lineText)) {
        if (lineText.length !== 0) {
          nextLine++;
        }
        break;
      }
    }
  }
  state.line = nextLine;
  const token = state.push("html_block", "", 0);
  token.map = [startLine, nextLine];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
  return true;
}
var HTML_SEQUENCES;
var init_html_block = __esm({
  "../../node_modules/markdown-it/lib/rules_block/html_block.mjs"() {
    init_html_blocks();
    init_html_re();
    HTML_SEQUENCES = [
      [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
      [/^<!--/, /-->/, true],
      [/^<\?/, /\?>/, true],
      [/^<![A-Z]/, />/, true],
      [/^<!\[CDATA\[/, /\]\]>/, true],
      [new RegExp("^</?(" + html_blocks_default.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
      [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
    ];
  }
});

// ../../node_modules/markdown-it/lib/rules_block/heading.mjs
function heading(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let ch = state.src.charCodeAt(pos);
  if (ch !== 35 || pos >= max) {
    return false;
  }
  let level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 35 && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }
  if (level > 6 || pos < max && !isSpace(ch)) {
    return false;
  }
  if (silent) {
    return true;
  }
  max = state.skipSpacesBack(max, pos);
  const tmp = state.skipCharsBack(max, 35, pos);
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }
  state.line = startLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = "########".slice(0, level);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = state.src.slice(pos, max).trim();
  token_i.map = [startLine, state.line];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = "########".slice(0, level);
  return true;
}
var init_heading = __esm({
  "../../node_modules/markdown-it/lib/rules_block/heading.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_block/lheading.mjs
function lheading(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  const oldParentType = state.parentType;
  state.parentType = "paragraph";
  let level = 0;
  let marker;
  let nextLine = startLine + 1;
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] >= state.blkIndent) {
      let pos = state.bMarks[nextLine] + state.tShift[nextLine];
      const max = state.eMarks[nextLine];
      if (pos < max) {
        marker = state.src.charCodeAt(pos);
        if (marker === 45 || marker === 61) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);
          if (pos >= max) {
            level = marker === 61 ? 1 : 2;
            break;
          }
        }
      }
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
      if (terminatorRules[i11](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  if (!level) {
    return false;
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine + 1;
  const token_o = state.push("heading_open", "h" + String(level), 1);
  token_o.markup = String.fromCharCode(marker);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line - 1];
  token_i.children = [];
  const token_c = state.push("heading_close", "h" + String(level), -1);
  token_c.markup = String.fromCharCode(marker);
  state.parentType = oldParentType;
  return true;
}
var init_lheading = __esm({
  "../../node_modules/markdown-it/lib/rules_block/lheading.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_block/paragraph.mjs
function paragraph(state, startLine, endLine) {
  const terminatorRules = state.md.block.ruler.getRules("paragraph");
  const oldParentType = state.parentType;
  let nextLine = startLine + 1;
  state.parentType = "paragraph";
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }
    if (state.sCount[nextLine] < 0) {
      continue;
    }
    let terminate = false;
    for (let i11 = 0, l5 = terminatorRules.length; i11 < l5; i11++) {
      if (terminatorRules[i11](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }
  const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine;
  const token_o = state.push("paragraph_open", "p", 1);
  token_o.map = [startLine, state.line];
  const token_i = state.push("inline", "", 0);
  token_i.content = content;
  token_i.map = [startLine, state.line];
  token_i.children = [];
  state.push("paragraph_close", "p", -1);
  state.parentType = oldParentType;
  return true;
}
var init_paragraph = __esm({
  "../../node_modules/markdown-it/lib/rules_block/paragraph.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/parser_block.mjs
function ParserBlock() {
  this.ruler = new ruler_default();
  for (let i11 = 0; i11 < _rules2.length; i11++) {
    this.ruler.push(_rules2[i11][0], _rules2[i11][1], { alt: (_rules2[i11][2] || []).slice() });
  }
}
var _rules2, parser_block_default;
var init_parser_block = __esm({
  "../../node_modules/markdown-it/lib/parser_block.mjs"() {
    init_ruler();
    init_state_block();
    init_table();
    init_code();
    init_fence();
    init_blockquote();
    init_hr();
    init_list();
    init_reference();
    init_html_block();
    init_heading();
    init_lheading();
    init_paragraph();
    _rules2 = [
      // First 2 params - rule name & source. Secondary array - list of rules,
      // which can be terminated by this one.
      ["table", table, ["paragraph", "reference"]],
      ["code", code],
      ["fence", fence, ["paragraph", "reference", "blockquote", "list"]],
      ["blockquote", blockquote, ["paragraph", "reference", "blockquote", "list"]],
      ["hr", hr, ["paragraph", "reference", "blockquote", "list"]],
      ["list", list, ["paragraph", "reference", "blockquote"]],
      ["reference", reference],
      ["html_block", html_block, ["paragraph", "reference", "blockquote"]],
      ["heading", heading, ["paragraph", "reference", "blockquote"]],
      ["lheading", lheading],
      ["paragraph", paragraph]
    ];
    ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const maxNesting = state.md.options.maxNesting;
      let line = startLine;
      let hasEmptyLines = false;
      while (line < endLine) {
        state.line = line = state.skipEmptyLines(line);
        if (line >= endLine) {
          break;
        }
        if (state.sCount[line] < state.blkIndent) {
          break;
        }
        if (state.level >= maxNesting) {
          state.line = endLine;
          break;
        }
        const prevLine = state.line;
        let ok = false;
        for (let i11 = 0; i11 < len; i11++) {
          ok = rules[i11](state, line, endLine, false);
          if (ok) {
            if (prevLine >= state.line) {
              throw new Error("block rule didn't increment state.line");
            }
            break;
          }
        }
        if (!ok) throw new Error("none of the block rules matched");
        state.tight = !hasEmptyLines;
        if (state.isEmpty(state.line - 1)) {
          hasEmptyLines = true;
        }
        line = state.line;
        if (line < endLine && state.isEmpty(line)) {
          hasEmptyLines = true;
          line++;
          state.line = line;
        }
      }
    };
    ParserBlock.prototype.parse = function(src, md, env, outTokens) {
      if (!src) {
        return;
      }
      const state = new this.State(src, md, env, outTokens);
      this.tokenize(state, state.line, state.lineMax);
    };
    ParserBlock.prototype.State = state_block_default;
    parser_block_default = ParserBlock;
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/state_inline.mjs
function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;
  this.tokens_meta = Array(outTokens.length);
  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = "";
  this.pendingLevel = 0;
  this.cache = {};
  this.delimiters = [];
  this._prev_delimiters = [];
  this.backticks = {};
  this.backticksScanned = false;
  this.linkLevel = 0;
}
var state_inline_default;
var init_state_inline = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/state_inline.mjs"() {
    init_token();
    init_utils();
    StateInline.prototype.pushPending = function() {
      const token = new token_default("text", "", 0);
      token.content = this.pending;
      token.level = this.pendingLevel;
      this.tokens.push(token);
      this.pending = "";
      return token;
    };
    StateInline.prototype.push = function(type2, tag, nesting) {
      if (this.pending) {
        this.pushPending();
      }
      const token = new token_default(type2, tag, nesting);
      let token_meta = null;
      if (nesting < 0) {
        this.level--;
        this.delimiters = this._prev_delimiters.pop();
      }
      token.level = this.level;
      if (nesting > 0) {
        this.level++;
        this._prev_delimiters.push(this.delimiters);
        this.delimiters = [];
        token_meta = { delimiters: this.delimiters };
      }
      this.pendingLevel = this.level;
      this.tokens.push(token);
      this.tokens_meta.push(token_meta);
      return token;
    };
    StateInline.prototype.scanDelims = function(start, canSplitWord) {
      const max = this.posMax;
      const marker = this.src.charCodeAt(start);
      const lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
      let pos = start;
      while (pos < max && this.src.charCodeAt(pos) === marker) {
        pos++;
      }
      const count = pos - start;
      const nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
      const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
      const isLastWhiteSpace = isWhiteSpace(lastChar);
      const isNextWhiteSpace = isWhiteSpace(nextChar);
      const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
      const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
      const can_open = left_flanking && (canSplitWord || !right_flanking || isLastPunctChar);
      const can_close = right_flanking && (canSplitWord || !left_flanking || isNextPunctChar);
      return { can_open, can_close, length: count };
    };
    StateInline.prototype.Token = token_default;
    state_inline_default = StateInline;
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/text.mjs
function isTerminatorChar(ch) {
  switch (ch) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return true;
    default:
      return false;
  }
}
function text(state, silent) {
  let pos = state.pos;
  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }
  if (pos === state.pos) {
    return false;
  }
  if (!silent) {
    state.pending += state.src.slice(state.pos, pos);
  }
  state.pos = pos;
  return true;
}
var init_text = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/text.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/linkify.mjs
function linkify2(state, silent) {
  if (!state.md.options.linkify) return false;
  if (state.linkLevel > 0) return false;
  const pos = state.pos;
  const max = state.posMax;
  if (pos + 3 > max) return false;
  if (state.src.charCodeAt(pos) !== 58) return false;
  if (state.src.charCodeAt(pos + 1) !== 47) return false;
  if (state.src.charCodeAt(pos + 2) !== 47) return false;
  const match2 = state.pending.match(SCHEME_RE);
  if (!match2) return false;
  const proto = match2[1];
  const link2 = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
  if (!link2) return false;
  let url = link2.url;
  if (url.length <= proto.length) return false;
  let urlEnd = url.length;
  while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) {
    urlEnd--;
  }
  if (urlEnd !== url.length) {
    url = url.slice(0, urlEnd);
  }
  const fullUrl = state.md.normalizeLink(url);
  if (!state.md.validateLink(fullUrl)) return false;
  if (!silent) {
    state.pending = state.pending.slice(0, -proto.length);
    const token_o = state.push("link_open", "a", 1);
    token_o.attrs = [["href", fullUrl]];
    token_o.markup = "linkify";
    token_o.info = "auto";
    const token_t = state.push("text", "", 0);
    token_t.content = state.md.normalizeLinkText(url);
    const token_c = state.push("link_close", "a", -1);
    token_c.markup = "linkify";
    token_c.info = "auto";
  }
  state.pos += url.length - proto.length;
  return true;
}
var SCHEME_RE;
var init_linkify2 = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/linkify.mjs"() {
    SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/newline.mjs
function newline(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 10) {
    return false;
  }
  const pmax = state.pending.length - 1;
  const max = state.posMax;
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
        let ws = pmax - 1;
        while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
        state.pending = state.pending.slice(0, ws);
        state.push("hardbreak", "br", 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push("softbreak", "br", 0);
      }
    } else {
      state.push("softbreak", "br", 0);
    }
  }
  pos++;
  while (pos < max && isSpace(state.src.charCodeAt(pos))) {
    pos++;
  }
  state.pos = pos;
  return true;
}
var init_newline = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/newline.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/escape.mjs
function escape2(state, silent) {
  let pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 92) return false;
  pos++;
  if (pos >= max) return false;
  let ch1 = state.src.charCodeAt(pos);
  if (ch1 === 10) {
    if (!silent) {
      state.push("hardbreak", "br", 0);
    }
    pos++;
    while (pos < max) {
      ch1 = state.src.charCodeAt(pos);
      if (!isSpace(ch1)) break;
      pos++;
    }
    state.pos = pos;
    return true;
  }
  let escapedStr = state.src[pos];
  if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
    const ch2 = state.src.charCodeAt(pos + 1);
    if (ch2 >= 56320 && ch2 <= 57343) {
      escapedStr += state.src[pos + 1];
      pos++;
    }
  }
  const origStr = "\\" + escapedStr;
  if (!silent) {
    const token = state.push("text_special", "", 0);
    if (ch1 < 256 && ESCAPED[ch1] !== 0) {
      token.content = escapedStr;
    } else {
      token.content = origStr;
    }
    token.markup = origStr;
    token.info = "escape";
  }
  state.pos = pos + 1;
  return true;
}
var ESCAPED;
var init_escape2 = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/escape.mjs"() {
    init_utils();
    ESCAPED = [];
    for (let i11 = 0; i11 < 256; i11++) {
      ESCAPED.push(0);
    }
    "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
      ESCAPED[ch.charCodeAt(0)] = 1;
    });
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/backticks.mjs
function backtick(state, silent) {
  let pos = state.pos;
  const ch = state.src.charCodeAt(pos);
  if (ch !== 96) {
    return false;
  }
  const start = pos;
  pos++;
  const max = state.posMax;
  while (pos < max && state.src.charCodeAt(pos) === 96) {
    pos++;
  }
  const marker = state.src.slice(start, pos);
  const openerLength = marker.length;
  if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
    if (!silent) state.pending += marker;
    state.pos += openerLength;
    return true;
  }
  let matchEnd = pos;
  let matchStart;
  while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
    matchEnd = matchStart + 1;
    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
      matchEnd++;
    }
    const closerLength = matchEnd - matchStart;
    if (closerLength === openerLength) {
      if (!silent) {
        const token = state.push("code_inline", "code", 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      state.pos = matchEnd;
      return true;
    }
    state.backticks[closerLength] = matchStart;
  }
  state.backticksScanned = true;
  if (!silent) state.pending += marker;
  state.pos += openerLength;
  return true;
}
var init_backticks = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/backticks.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/strikethrough.mjs
function strikethrough_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 126) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, true);
  let len = scanned.length;
  const ch = String.fromCharCode(marker);
  if (len < 2) {
    return false;
  }
  let token;
  if (len % 2) {
    token = state.push("text", "", 0);
    token.content = ch;
    len--;
  }
  for (let i11 = 0; i11 < len; i11 += 2) {
    token = state.push("text", "", 0);
    token.content = ch + ch;
    state.delimiters.push({
      marker,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess(state, delimiters) {
  let token;
  const loneMarkers = [];
  const max = delimiters.length;
  for (let i11 = 0; i11 < max; i11++) {
    const startDelim = delimiters[i11];
    if (startDelim.marker !== 126) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    token = state.tokens[startDelim.token];
    token.type = "s_open";
    token.tag = "s";
    token.nesting = 1;
    token.markup = "~~";
    token.content = "";
    token = state.tokens[endDelim.token];
    token.type = "s_close";
    token.tag = "s";
    token.nesting = -1;
    token.markup = "~~";
    token.content = "";
    if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
      loneMarkers.push(endDelim.token - 1);
    }
  }
  while (loneMarkers.length) {
    const i11 = loneMarkers.pop();
    let j2 = i11 + 1;
    while (j2 < state.tokens.length && state.tokens[j2].type === "s_close") {
      j2++;
    }
    j2--;
    if (i11 !== j2) {
      token = state.tokens[j2];
      state.tokens[j2] = state.tokens[i11];
      state.tokens[i11] = token;
    }
  }
}
function strikethrough_postProcess(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess(state, tokens_meta[curr].delimiters);
    }
  }
}
var strikethrough_default;
var init_strikethrough = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/strikethrough.mjs"() {
    strikethrough_default = {
      tokenize: strikethrough_tokenize,
      postProcess: strikethrough_postProcess
    };
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/emphasis.mjs
function emphasis_tokenize(state, silent) {
  const start = state.pos;
  const marker = state.src.charCodeAt(start);
  if (silent) {
    return false;
  }
  if (marker !== 95 && marker !== 42) {
    return false;
  }
  const scanned = state.scanDelims(state.pos, marker === 42);
  for (let i11 = 0; i11 < scanned.length; i11++) {
    const token = state.push("text", "", 0);
    token.content = String.fromCharCode(marker);
    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker,
      // Total length of these series of delimiters.
      //
      length: scanned.length,
      // A position of the token this delimiter corresponds to.
      //
      token: state.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: scanned.can_open,
      close: scanned.can_close
    });
  }
  state.pos += scanned.length;
  return true;
}
function postProcess2(state, delimiters) {
  const max = delimiters.length;
  for (let i11 = max - 1; i11 >= 0; i11--) {
    const startDelim = delimiters[i11];
    if (startDelim.marker !== 95 && startDelim.marker !== 42) {
      continue;
    }
    if (startDelim.end === -1) {
      continue;
    }
    const endDelim = delimiters[startDelim.end];
    const isStrong = i11 > 0 && delimiters[i11 - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
    delimiters[i11 - 1].marker === startDelim.marker && delimiters[i11 - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    delimiters[startDelim.end + 1].token === endDelim.token + 1;
    const ch = String.fromCharCode(startDelim.marker);
    const token_o = state.tokens[startDelim.token];
    token_o.type = isStrong ? "strong_open" : "em_open";
    token_o.tag = isStrong ? "strong" : "em";
    token_o.nesting = 1;
    token_o.markup = isStrong ? ch + ch : ch;
    token_o.content = "";
    const token_c = state.tokens[endDelim.token];
    token_c.type = isStrong ? "strong_close" : "em_close";
    token_c.tag = isStrong ? "strong" : "em";
    token_c.nesting = -1;
    token_c.markup = isStrong ? ch + ch : ch;
    token_c.content = "";
    if (isStrong) {
      state.tokens[delimiters[i11 - 1].token].content = "";
      state.tokens[delimiters[startDelim.end + 1].token].content = "";
      i11--;
    }
  }
}
function emphasis_post_process(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  postProcess2(state, state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      postProcess2(state, tokens_meta[curr].delimiters);
    }
  }
}
var emphasis_default;
var init_emphasis = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/emphasis.mjs"() {
    emphasis_default = {
      tokenize: emphasis_tokenize,
      postProcess: emphasis_post_process
    };
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/link.mjs
function link(state, silent) {
  let code2, label, res, ref;
  let href = "";
  let title = "";
  let start = state.pos;
  let parseReference = true;
  if (state.src.charCodeAt(state.pos) !== 91) {
    return false;
  }
  const oldPos = state.pos;
  const max = state.posMax;
  const labelStart = state.pos + 1;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
  if (labelEnd < 0) {
    return false;
  }
  let pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    parseReference = false;
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
      start = pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
      res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
      }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      parseReference = true;
    }
    pos++;
  }
  if (parseReference) {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;
    const token_o = state.push("link_open", "a", 1);
    const attrs = [["href", href]];
    token_o.attrs = attrs;
    if (title) {
      attrs.push(["title", title]);
    }
    state.linkLevel++;
    state.md.inline.tokenize(state);
    state.linkLevel--;
    state.push("link_close", "a", -1);
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
var init_link = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/link.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/image.mjs
function image(state, silent) {
  let code2, content, label, pos, ref, res, title, start;
  let href = "";
  const oldPos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(state.pos) !== 33) {
    return false;
  }
  if (state.src.charCodeAt(state.pos + 1) !== 91) {
    return false;
  }
  const labelStart = state.pos + 2;
  const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
  if (labelEnd < 0) {
    return false;
  }
  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 40) {
    pos++;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    if (pos >= max) {
      return false;
    }
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = "";
      }
    }
    start = pos;
    for (; pos < max; pos++) {
      code2 = state.src.charCodeAt(pos);
      if (!isSpace(code2) && code2 !== 10) {
        break;
      }
    }
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;
      for (; pos < max; pos++) {
        code2 = state.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) {
          break;
        }
      }
    } else {
      title = "";
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 41) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    if (typeof state.env.references === "undefined") {
      return false;
    }
    if (pos < max && state.src.charCodeAt(pos) === 91) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }
    if (!label) {
      label = state.src.slice(labelStart, labelEnd);
    }
    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);
    const tokens = [];
    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens
    );
    const token = state.push("image", "img", 0);
    const attrs = [["src", href], ["alt", ""]];
    token.attrs = attrs;
    token.children = tokens;
    token.content = content;
    if (title) {
      attrs.push(["title", title]);
    }
  }
  state.pos = pos;
  state.posMax = max;
  return true;
}
var init_image = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/image.mjs"() {
    init_utils();
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/autolink.mjs
function autolink(state, silent) {
  let pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60) {
    return false;
  }
  const start = state.pos;
  const max = state.posMax;
  for (; ; ) {
    if (++pos >= max) return false;
    const ch = state.src.charCodeAt(pos);
    if (ch === 60) return false;
    if (ch === 62) break;
  }
  const url = state.src.slice(start + 1, pos);
  if (AUTOLINK_RE.test(url)) {
    const fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
    return true;
  }
  if (EMAIL_RE.test(url)) {
    const fullUrl = state.md.normalizeLink("mailto:" + url);
    if (!state.md.validateLink(fullUrl)) {
      return false;
    }
    if (!silent) {
      const token_o = state.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "autolink";
      token_o.info = "auto";
      const token_t = state.push("text", "", 0);
      token_t.content = state.md.normalizeLinkText(url);
      const token_c = state.push("link_close", "a", -1);
      token_c.markup = "autolink";
      token_c.info = "auto";
    }
    state.pos += url.length + 2;
    return true;
  }
  return false;
}
var EMAIL_RE, AUTOLINK_RE;
var init_autolink = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/autolink.mjs"() {
    EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
    AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/html_inline.mjs
function isLinkOpen2(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose2(str) {
  return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
  const lc = ch | 32;
  return lc >= 97 && lc <= 122;
}
function html_inline(state, silent) {
  if (!state.md.options.html) {
    return false;
  }
  const max = state.posMax;
  const pos = state.pos;
  if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
    return false;
  }
  const ch = state.src.charCodeAt(pos + 1);
  if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
    return false;
  }
  const match2 = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match2) {
    return false;
  }
  if (!silent) {
    const token = state.push("html_inline", "", 0);
    token.content = match2[0];
    if (isLinkOpen2(token.content)) state.linkLevel++;
    if (isLinkClose2(token.content)) state.linkLevel--;
  }
  state.pos += match2[0].length;
  return true;
}
var init_html_inline = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/html_inline.mjs"() {
    init_html_re();
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/entity.mjs
function entity(state, silent) {
  const pos = state.pos;
  const max = state.posMax;
  if (state.src.charCodeAt(pos) !== 38) return false;
  if (pos + 1 >= max) return false;
  const ch = state.src.charCodeAt(pos + 1);
  if (ch === 35) {
    const match2 = state.src.slice(pos).match(DIGITAL_RE);
    if (match2) {
      if (!silent) {
        const code2 = match2[1][0].toLowerCase() === "x" ? parseInt(match2[1].slice(1), 16) : parseInt(match2[1], 10);
        const token = state.push("text_special", "", 0);
        token.content = isValidEntityCode(code2) ? fromCodePoint2(code2) : fromCodePoint2(65533);
        token.markup = match2[0];
        token.info = "entity";
      }
      state.pos += match2[0].length;
      return true;
    }
  } else {
    const match2 = state.src.slice(pos).match(NAMED_RE);
    if (match2) {
      const decoded = decodeHTML(match2[0]);
      if (decoded !== match2[0]) {
        if (!silent) {
          const token = state.push("text_special", "", 0);
          token.content = decoded;
          token.markup = match2[0];
          token.info = "entity";
        }
        state.pos += match2[0].length;
        return true;
      }
    }
  }
  return false;
}
var DIGITAL_RE, NAMED_RE;
var init_entity = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/entity.mjs"() {
    init_esm();
    init_utils();
    DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
    NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/balance_pairs.mjs
function processDelimiters(delimiters) {
  const openersBottom = {};
  const max = delimiters.length;
  if (!max) return;
  let headerIdx = 0;
  let lastTokenIdx = -2;
  const jumps = [];
  for (let closerIdx = 0; closerIdx < max; closerIdx++) {
    const closer = delimiters[closerIdx];
    jumps.push(0);
    if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
      headerIdx = closerIdx;
    }
    lastTokenIdx = closer.token;
    closer.length = closer.length || 0;
    if (!closer.close) continue;
    if (!openersBottom.hasOwnProperty(closer.marker)) {
      openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
    }
    const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
    let openerIdx = headerIdx - jumps[headerIdx] - 1;
    let newMinOpenerIdx = openerIdx;
    for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
      const opener = delimiters[openerIdx];
      if (opener.marker !== closer.marker) continue;
      if (opener.open && opener.end < 0) {
        let isOddMatch = false;
        if (opener.close || closer.open) {
          if ((opener.length + closer.length) % 3 === 0) {
            if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
              isOddMatch = true;
            }
          }
        }
        if (!isOddMatch) {
          const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
          jumps[closerIdx] = closerIdx - openerIdx + lastJump;
          jumps[openerIdx] = lastJump;
          closer.open = false;
          opener.end = closerIdx;
          opener.close = false;
          newMinOpenerIdx = -1;
          lastTokenIdx = -2;
          break;
        }
      }
    }
    if (newMinOpenerIdx !== -1) {
      openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
    }
  }
}
function link_pairs(state) {
  const tokens_meta = state.tokens_meta;
  const max = state.tokens_meta.length;
  processDelimiters(state.delimiters);
  for (let curr = 0; curr < max; curr++) {
    if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
      processDelimiters(tokens_meta[curr].delimiters);
    }
  }
}
var init_balance_pairs = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/balance_pairs.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/rules_inline/fragments_join.mjs
function fragments_join(state) {
  let curr, last;
  let level = 0;
  const tokens = state.tokens;
  const max = state.tokens.length;
  for (curr = last = 0; curr < max; curr++) {
    if (tokens[curr].nesting < 0) level--;
    tokens[curr].level = level;
    if (tokens[curr].nesting > 0) level++;
    if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
      tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    } else {
      if (curr !== last) {
        tokens[last] = tokens[curr];
      }
      last++;
    }
  }
  if (curr !== last) {
    tokens.length = last;
  }
}
var init_fragments_join = __esm({
  "../../node_modules/markdown-it/lib/rules_inline/fragments_join.mjs"() {
  }
});

// ../../node_modules/markdown-it/lib/parser_inline.mjs
function ParserInline() {
  this.ruler = new ruler_default();
  for (let i11 = 0; i11 < _rules3.length; i11++) {
    this.ruler.push(_rules3[i11][0], _rules3[i11][1]);
  }
  this.ruler2 = new ruler_default();
  for (let i11 = 0; i11 < _rules22.length; i11++) {
    this.ruler2.push(_rules22[i11][0], _rules22[i11][1]);
  }
}
var _rules3, _rules22, parser_inline_default;
var init_parser_inline = __esm({
  "../../node_modules/markdown-it/lib/parser_inline.mjs"() {
    init_ruler();
    init_state_inline();
    init_text();
    init_linkify2();
    init_newline();
    init_escape2();
    init_backticks();
    init_strikethrough();
    init_emphasis();
    init_link();
    init_image();
    init_autolink();
    init_html_inline();
    init_entity();
    init_balance_pairs();
    init_fragments_join();
    _rules3 = [
      ["text", text],
      ["linkify", linkify2],
      ["newline", newline],
      ["escape", escape2],
      ["backticks", backtick],
      ["strikethrough", strikethrough_default.tokenize],
      ["emphasis", emphasis_default.tokenize],
      ["link", link],
      ["image", image],
      ["autolink", autolink],
      ["html_inline", html_inline],
      ["entity", entity]
    ];
    _rules22 = [
      ["balance_pairs", link_pairs],
      ["strikethrough", strikethrough_default.postProcess],
      ["emphasis", emphasis_default.postProcess],
      // rules for pairs separate '**' into its own text tokens, which may be left unused,
      // rule below merges unused segments back with the rest of the text
      ["fragments_join", fragments_join]
    ];
    ParserInline.prototype.skipToken = function(state) {
      const pos = state.pos;
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const maxNesting = state.md.options.maxNesting;
      const cache = state.cache;
      if (typeof cache[pos] !== "undefined") {
        state.pos = cache[pos];
        return;
      }
      let ok = false;
      if (state.level < maxNesting) {
        for (let i11 = 0; i11 < len; i11++) {
          state.level++;
          ok = rules[i11](state, true);
          state.level--;
          if (ok) {
            if (pos >= state.pos) {
              throw new Error("inline rule didn't increment state.pos");
            }
            break;
          }
        }
      } else {
        state.pos = state.posMax;
      }
      if (!ok) {
        state.pos++;
      }
      cache[pos] = state.pos;
    };
    ParserInline.prototype.tokenize = function(state) {
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const end = state.posMax;
      const maxNesting = state.md.options.maxNesting;
      while (state.pos < end) {
        const prevPos = state.pos;
        let ok = false;
        if (state.level < maxNesting) {
          for (let i11 = 0; i11 < len; i11++) {
            ok = rules[i11](state, false);
            if (ok) {
              if (prevPos >= state.pos) {
                throw new Error("inline rule didn't increment state.pos");
              }
              break;
            }
          }
        }
        if (ok) {
          if (state.pos >= end) {
            break;
          }
          continue;
        }
        state.pending += state.src[state.pos++];
      }
      if (state.pending) {
        state.pushPending();
      }
    };
    ParserInline.prototype.parse = function(str, md, env, outTokens) {
      const state = new this.State(str, md, env, outTokens);
      this.tokenize(state);
      const rules = this.ruler2.getRules("");
      const len = rules.length;
      for (let i11 = 0; i11 < len; i11++) {
        rules[i11](state);
      }
    };
    ParserInline.prototype.State = state_inline_default;
    parser_inline_default = ParserInline;
  }
});

// ../../node_modules/linkify-it/lib/re.mjs
function re_default(opts) {
  const re = {};
  opts = opts || {};
  re.src_Any = regex_default.source;
  re.src_Cc = regex_default2.source;
  re.src_Z = regex_default6.source;
  re.src_P = regex_default4.source;
  re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
  re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
  const text_separators = "[><\uFF5C]";
  re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
  re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
  re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
  re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
  re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re.src_ZCc + "|[']).)+\\'|\\'(?=" + re.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + re.src_ZCc + "|$)|;(?!" + re.src_ZCc + "|$)|\\!+(?!" + re.src_ZCc + "|[!]|$)|\\?(?!" + re.src_ZCc + "|[?]|$))+|\\/)?";
  re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
  re.src_xn = "xn--[a-z0-9\\-]{1,59}";
  re.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63})";
  re.src_domain = "(?:" + re.src_xn + "|(?:" + re.src_pseudo_letter + ")|(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + "))";
  re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain + "))";
  re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%)))";
  re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
  re.src_host_strict = re.src_host + re.src_host_terminator;
  re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
  re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
  re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
  re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
  re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
  re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
  return re;
}
var init_re = __esm({
  "../../node_modules/linkify-it/lib/re.mjs"() {
    init_uc();
  }
});

// ../../node_modules/linkify-it/index.mjs
function assign2(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  sources.forEach(function(source) {
    if (!source) {
      return;
    }
    Object.keys(source || {}).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
}
function _class2(obj) {
  return Object.prototype.toString.call(obj);
}
function isString2(obj) {
  return _class2(obj) === "[object String]";
}
function isObject2(obj) {
  return _class2(obj) === "[object Object]";
}
function isRegExp(obj) {
  return _class2(obj) === "[object RegExp]";
}
function isFunction(obj) {
  return _class2(obj) === "[object Function]";
}
function escapeRE2(str) {
  return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
function isOptionsObj(obj) {
  return Object.keys(obj || {}).reduce(function(acc, k2) {
    return acc || defaultOptions.hasOwnProperty(k2);
  }, false);
}
function resetScanCache(self) {
  self.__index__ = -1;
  self.__text_cache__ = "";
}
function createValidator(re) {
  return function(text3, pos) {
    const tail = text3.slice(pos);
    if (re.test(tail)) {
      return tail.match(re)[0].length;
    }
    return 0;
  };
}
function createNormalizer() {
  return function(match2, self) {
    self.normalize(match2);
  };
}
function compile(self) {
  const re = self.re = re_default(self.__opts__);
  const tlds2 = self.__tlds__.slice();
  self.onCompile();
  if (!self.__tlds_replaced__) {
    tlds2.push(tlds_2ch_src_re);
  }
  tlds2.push(re.src_xn);
  re.src_tlds = tlds2.join("|");
  function untpl(tpl) {
    return tpl.replace("%TLDS%", re.src_tlds);
  }
  re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
  re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
  re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
  const aliases = [];
  self.__compiled__ = {};
  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }
  Object.keys(self.__schemas__).forEach(function(name) {
    const val = self.__schemas__[name];
    if (val === null) {
      return;
    }
    const compiled = { validate: null, link: null };
    self.__compiled__[name] = compiled;
    if (isObject2(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }
      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }
      return;
    }
    if (isString2(val)) {
      aliases.push(name);
      return;
    }
    schemaError(name, val);
  });
  aliases.forEach(function(alias) {
    if (!self.__compiled__[self.__schemas__[alias]]) {
      return;
    }
    self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
    self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
  });
  self.__compiled__[""] = { validate: null, normalize: createNormalizer() };
  const slist = Object.keys(self.__compiled__).filter(function(name) {
    return name.length > 0 && self.__compiled__[name];
  }).map(escapeRE2).join("|");
  self.re.schema_test = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "i");
  self.re.schema_search = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
  self.re.schema_at_start = RegExp("^" + self.re.schema_search.source, "i");
  self.re.pretest = RegExp(
    "(" + self.re.schema_test.source + ")|(" + self.re.host_fuzzy_test.source + ")|@",
    "i"
  );
  resetScanCache(self);
}
function Match(self, shift) {
  const start = self.__index__;
  const end = self.__last_index__;
  const text3 = self.__text_cache__.slice(start, end);
  this.schema = self.__schema__.toLowerCase();
  this.index = start + shift;
  this.lastIndex = end + shift;
  this.raw = text3;
  this.text = text3;
  this.url = text3;
}
function createMatch(self, shift) {
  const match2 = new Match(self, shift);
  self.__compiled__[match2.schema].normalize(match2, self);
  return match2;
}
function LinkifyIt(schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options);
  }
  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }
  this.__opts__ = assign2({}, defaultOptions, options);
  this.__index__ = -1;
  this.__last_index__ = -1;
  this.__schema__ = "";
  this.__text_cache__ = "";
  this.__schemas__ = assign2({}, defaultSchemas, schemas);
  this.__compiled__ = {};
  this.__tlds__ = tlds_default;
  this.__tlds_replaced__ = false;
  this.re = {};
  compile(this);
}
var defaultOptions, defaultSchemas, tlds_2ch_src_re, tlds_default, linkify_it_default;
var init_linkify_it = __esm({
  "../../node_modules/linkify-it/index.mjs"() {
    init_re();
    defaultOptions = {
      fuzzyLink: true,
      fuzzyEmail: true,
      fuzzyIP: false
    };
    defaultSchemas = {
      "http:": {
        validate: function(text3, pos, self) {
          const tail = text3.slice(pos);
          if (!self.re.http) {
            self.re.http = new RegExp(
              "^\\/\\/" + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path,
              "i"
            );
          }
          if (self.re.http.test(tail)) {
            return tail.match(self.re.http)[0].length;
          }
          return 0;
        }
      },
      "https:": "http:",
      "ftp:": "http:",
      "//": {
        validate: function(text3, pos, self) {
          const tail = text3.slice(pos);
          if (!self.re.no_http) {
            self.re.no_http = new RegExp(
              "^" + self.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
              // with code comments
              "(?:localhost|(?:(?:" + self.re.src_domain + ")\\.)+" + self.re.src_domain_root + ")" + self.re.src_port + self.re.src_host_terminator + self.re.src_path,
              "i"
            );
          }
          if (self.re.no_http.test(tail)) {
            if (pos >= 3 && text3[pos - 3] === ":") {
              return 0;
            }
            if (pos >= 3 && text3[pos - 3] === "/") {
              return 0;
            }
            return tail.match(self.re.no_http)[0].length;
          }
          return 0;
        }
      },
      "mailto:": {
        validate: function(text3, pos, self) {
          const tail = text3.slice(pos);
          if (!self.re.mailto) {
            self.re.mailto = new RegExp(
              "^" + self.re.src_email_name + "@" + self.re.src_host_strict,
              "i"
            );
          }
          if (self.re.mailto.test(tail)) {
            return tail.match(self.re.mailto)[0].length;
          }
          return 0;
        }
      }
    };
    tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
    tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444".split("|");
    LinkifyIt.prototype.add = function add(schema, definition) {
      this.__schemas__[schema] = definition;
      compile(this);
      return this;
    };
    LinkifyIt.prototype.set = function set(options) {
      this.__opts__ = assign2(this.__opts__, options);
      return this;
    };
    LinkifyIt.prototype.test = function test(text3) {
      this.__text_cache__ = text3;
      this.__index__ = -1;
      if (!text3.length) {
        return false;
      }
      let m5, ml, me, len, shift, next, re, tld_pos, at_pos;
      if (this.re.schema_test.test(text3)) {
        re = this.re.schema_search;
        re.lastIndex = 0;
        while ((m5 = re.exec(text3)) !== null) {
          len = this.testSchemaAt(text3, m5[2], re.lastIndex);
          if (len) {
            this.__schema__ = m5[2];
            this.__index__ = m5.index + m5[1].length;
            this.__last_index__ = m5.index + m5[0].length + len;
            break;
          }
        }
      }
      if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
        tld_pos = text3.search(this.re.host_fuzzy_test);
        if (tld_pos >= 0) {
          if (this.__index__ < 0 || tld_pos < this.__index__) {
            if ((ml = text3.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
              shift = ml.index + ml[1].length;
              if (this.__index__ < 0 || shift < this.__index__) {
                this.__schema__ = "";
                this.__index__ = shift;
                this.__last_index__ = ml.index + ml[0].length;
              }
            }
          }
        }
      }
      if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
        at_pos = text3.indexOf("@");
        if (at_pos >= 0) {
          if ((me = text3.match(this.re.email_fuzzy)) !== null) {
            shift = me.index + me[1].length;
            next = me.index + me[0].length;
            if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
              this.__schema__ = "mailto:";
              this.__index__ = shift;
              this.__last_index__ = next;
            }
          }
        }
      }
      return this.__index__ >= 0;
    };
    LinkifyIt.prototype.pretest = function pretest(text3) {
      return this.re.pretest.test(text3);
    };
    LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text3, schema, pos) {
      if (!this.__compiled__[schema.toLowerCase()]) {
        return 0;
      }
      return this.__compiled__[schema.toLowerCase()].validate(text3, pos, this);
    };
    LinkifyIt.prototype.match = function match(text3) {
      const result = [];
      let shift = 0;
      if (this.__index__ >= 0 && this.__text_cache__ === text3) {
        result.push(createMatch(this, shift));
        shift = this.__last_index__;
      }
      let tail = shift ? text3.slice(shift) : text3;
      while (this.test(tail)) {
        result.push(createMatch(this, shift));
        tail = tail.slice(this.__last_index__);
        shift += this.__last_index__;
      }
      if (result.length) {
        return result;
      }
      return null;
    };
    LinkifyIt.prototype.matchAtStart = function matchAtStart(text3) {
      this.__text_cache__ = text3;
      this.__index__ = -1;
      if (!text3.length) return null;
      const m5 = this.re.schema_at_start.exec(text3);
      if (!m5) return null;
      const len = this.testSchemaAt(text3, m5[2], m5[0].length);
      if (!len) return null;
      this.__schema__ = m5[2];
      this.__index__ = m5.index + m5[1].length;
      this.__last_index__ = m5.index + m5[0].length + len;
      return createMatch(this, 0);
    };
    LinkifyIt.prototype.tlds = function tlds(list2, keepOld) {
      list2 = Array.isArray(list2) ? list2 : [list2];
      if (!keepOld) {
        this.__tlds__ = list2.slice();
        this.__tlds_replaced__ = true;
        compile(this);
        return this;
      }
      this.__tlds__ = this.__tlds__.concat(list2).sort().filter(function(el, idx, arr) {
        return el !== arr[idx - 1];
      }).reverse();
      compile(this);
      return this;
    };
    LinkifyIt.prototype.normalize = function normalize2(match2) {
      if (!match2.schema) {
        match2.url = "http://" + match2.url;
      }
      if (match2.schema === "mailto:" && !/^mailto:/i.test(match2.url)) {
        match2.url = "mailto:" + match2.url;
      }
    };
    LinkifyIt.prototype.onCompile = function onCompile() {
    };
    linkify_it_default = LinkifyIt;
  }
});

// ../../node_modules/punycode.js/punycode.es6.js
function error(type2) {
  throw new RangeError(errors[type2]);
}
function map(array, callback) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = callback(array[length]);
  }
  return result;
}
function mapDomain(domain, callback) {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    domain = parts[1];
  }
  domain = domain.replace(regexSeparators, ".");
  const labels = domain.split(".");
  const encoded = map(labels, callback).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
var maxInt, base, tMin, tMax, skew, damp, initialBias, initialN, delimiter, regexPunycode, regexNonASCII, regexSeparators, errors, baseMinusTMin, floor, stringFromCharCode, ucs2encode, basicToDigit, digitToBasic, adapt, decode2, encode2, toUnicode, toASCII, punycode, punycode_es6_default;
var init_punycode_es6 = __esm({
  "../../node_modules/punycode.js/punycode.es6.js"() {
    "use strict";
    maxInt = 2147483647;
    base = 36;
    tMin = 1;
    tMax = 26;
    skew = 38;
    damp = 700;
    initialBias = 72;
    initialN = 128;
    delimiter = "-";
    regexPunycode = /^xn--/;
    regexNonASCII = /[^\0-\x7F]/;
    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
    errors = {
      "overflow": "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    };
    baseMinusTMin = base - tMin;
    floor = Math.floor;
    stringFromCharCode = String.fromCharCode;
    ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
    basicToDigit = function(codePoint) {
      if (codePoint >= 48 && codePoint < 58) {
        return 26 + (codePoint - 48);
      }
      if (codePoint >= 65 && codePoint < 91) {
        return codePoint - 65;
      }
      if (codePoint >= 97 && codePoint < 123) {
        return codePoint - 97;
      }
      return base;
    };
    digitToBasic = function(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    };
    adapt = function(delta, numPoints, firstTime) {
      let k2 = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (; delta > baseMinusTMin * tMax >> 1; k2 += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k2 + (baseMinusTMin + 1) * delta / (delta + skew));
    };
    decode2 = function(input2) {
      const output = [];
      const inputLength = input2.length;
      let i11 = 0;
      let n11 = initialN;
      let bias = initialBias;
      let basic = input2.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (let j2 = 0; j2 < basic; ++j2) {
        if (input2.charCodeAt(j2) >= 128) {
          error("not-basic");
        }
        output.push(input2.charCodeAt(j2));
      }
      for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
        const oldi = i11;
        for (let w2 = 1, k2 = base; ; k2 += base) {
          if (index >= inputLength) {
            error("invalid-input");
          }
          const digit = basicToDigit(input2.charCodeAt(index++));
          if (digit >= base) {
            error("invalid-input");
          }
          if (digit > floor((maxInt - i11) / w2)) {
            error("overflow");
          }
          i11 += digit * w2;
          const t7 = k2 <= bias ? tMin : k2 >= bias + tMax ? tMax : k2 - bias;
          if (digit < t7) {
            break;
          }
          const baseMinusT = base - t7;
          if (w2 > floor(maxInt / baseMinusT)) {
            error("overflow");
          }
          w2 *= baseMinusT;
        }
        const out = output.length + 1;
        bias = adapt(i11 - oldi, out, oldi == 0);
        if (floor(i11 / out) > maxInt - n11) {
          error("overflow");
        }
        n11 += floor(i11 / out);
        i11 %= out;
        output.splice(i11++, 0, n11);
      }
      return String.fromCodePoint(...output);
    };
    encode2 = function(input2) {
      const output = [];
      input2 = ucs2decode(input2);
      const inputLength = input2.length;
      let n11 = initialN;
      let delta = 0;
      let bias = initialBias;
      for (const currentValue of input2) {
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      const basicLength = output.length;
      let handledCPCount = basicLength;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        let m5 = maxInt;
        for (const currentValue of input2) {
          if (currentValue >= n11 && currentValue < m5) {
            m5 = currentValue;
          }
        }
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m5 - n11 > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error("overflow");
        }
        delta += (m5 - n11) * handledCPCountPlusOne;
        n11 = m5;
        for (const currentValue of input2) {
          if (currentValue < n11 && ++delta > maxInt) {
            error("overflow");
          }
          if (currentValue === n11) {
            let q = delta;
            for (let k2 = base; ; k2 += base) {
              const t7 = k2 <= bias ? tMin : k2 >= bias + tMax ? tMax : k2 - bias;
              if (q < t7) {
                break;
              }
              const qMinusT = q - t7;
              const baseMinusT = base - t7;
              output.push(
                stringFromCharCode(digitToBasic(t7 + qMinusT % baseMinusT, 0))
              );
              q = floor(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
        ++delta;
        ++n11;
      }
      return output.join("");
    };
    toUnicode = function(input2) {
      return mapDomain(input2, function(string) {
        return regexPunycode.test(string) ? decode2(string.slice(4).toLowerCase()) : string;
      });
    };
    toASCII = function(input2) {
      return mapDomain(input2, function(string) {
        return regexNonASCII.test(string) ? "xn--" + encode2(string) : string;
      });
    };
    punycode = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      "version": "2.3.1",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      "ucs2": {
        "decode": ucs2decode,
        "encode": ucs2encode
      },
      "decode": decode2,
      "encode": encode2,
      "toASCII": toASCII,
      "toUnicode": toUnicode
    };
    punycode_es6_default = punycode;
  }
});

// ../../node_modules/markdown-it/lib/presets/default.mjs
var default_default;
var init_default = __esm({
  "../../node_modules/markdown-it/lib/presets/default.mjs"() {
    default_default = {
      options: {
        // Enable HTML tags in source
        html: false,
        // Use '/' to close single tags (<br />)
        xhtmlOut: false,
        // Convert '\n' in paragraphs into <br>
        breaks: false,
        // CSS language prefix for fenced blocks
        langPrefix: "language-",
        // autoconvert URL-like texts to links
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        // Internal protection, recursion limit
        maxNesting: 100
      },
      components: {
        core: {},
        block: {},
        inline: {}
      }
    };
  }
});

// ../../node_modules/markdown-it/lib/presets/zero.mjs
var zero_default;
var init_zero = __esm({
  "../../node_modules/markdown-it/lib/presets/zero.mjs"() {
    zero_default = {
      options: {
        // Enable HTML tags in source
        html: false,
        // Use '/' to close single tags (<br />)
        xhtmlOut: false,
        // Convert '\n' in paragraphs into <br>
        breaks: false,
        // CSS language prefix for fenced blocks
        langPrefix: "language-",
        // autoconvert URL-like texts to links
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        // Internal protection, recursion limit
        maxNesting: 20
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "text"
          ],
          rules2: [
            "balance_pairs",
            "fragments_join"
          ]
        }
      }
    };
  }
});

// ../../node_modules/markdown-it/lib/presets/commonmark.mjs
var commonmark_default;
var init_commonmark = __esm({
  "../../node_modules/markdown-it/lib/presets/commonmark.mjs"() {
    commonmark_default = {
      options: {
        // Enable HTML tags in source
        html: true,
        // Use '/' to close single tags (<br />)
        xhtmlOut: true,
        // Convert '\n' in paragraphs into <br>
        breaks: false,
        // CSS language prefix for fenced blocks
        langPrefix: "language-",
        // autoconvert URL-like texts to links
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "\u201C\u201D\u2018\u2019",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        // Internal protection, recursion limit
        maxNesting: 20
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "blockquote",
            "code",
            "fence",
            "heading",
            "hr",
            "html_block",
            "lheading",
            "list",
            "reference",
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "autolink",
            "backticks",
            "emphasis",
            "entity",
            "escape",
            "html_inline",
            "image",
            "link",
            "newline",
            "text"
          ],
          rules2: [
            "balance_pairs",
            "emphasis",
            "fragments_join"
          ]
        }
      }
    };
  }
});

// ../../node_modules/markdown-it/lib/index.mjs
function validateLink(url) {
  const str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
}
function normalizeLink(url) {
  const parsed = parse_default(url, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode_es6_default.toASCII(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return encode_default(format(parsed));
}
function normalizeLinkText(url) {
  const parsed = parse_default(url, true);
  if (parsed.hostname) {
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode_es6_default.toUnicode(parsed.hostname);
      } catch (er) {
      }
    }
  }
  return decode_default(format(parsed), decode_default.defaultChars + "%");
}
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }
  if (!options) {
    if (!isString(presetName)) {
      options = presetName || {};
      presetName = "default";
    }
  }
  this.inline = new parser_inline_default();
  this.block = new parser_block_default();
  this.core = new parser_core_default();
  this.renderer = new renderer_default();
  this.linkify = new linkify_it_default();
  this.validateLink = validateLink;
  this.normalizeLink = normalizeLink;
  this.normalizeLinkText = normalizeLinkText;
  this.utils = utils_exports2;
  this.helpers = assign({}, helpers_exports);
  this.options = {};
  this.configure(presetName);
  if (options) {
    this.set(options);
  }
}
var config, BAD_PROTO_RE, GOOD_DATA_RE, RECODE_HOSTNAME_FOR, lib_default;
var init_lib = __esm({
  "../../node_modules/markdown-it/lib/index.mjs"() {
    init_utils();
    init_helpers();
    init_renderer();
    init_parser_core();
    init_parser_block();
    init_parser_inline();
    init_linkify_it();
    init_mdurl();
    init_punycode_es6();
    init_default();
    init_zero();
    init_commonmark();
    config = {
      default: default_default,
      zero: zero_default,
      commonmark: commonmark_default
    };
    BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
    GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
    RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
    MarkdownIt.prototype.set = function(options) {
      assign(this.options, options);
      return this;
    };
    MarkdownIt.prototype.configure = function(presets) {
      const self = this;
      if (isString(presets)) {
        const presetName = presets;
        presets = config[presetName];
        if (!presets) {
          throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
        }
      }
      if (!presets) {
        throw new Error("Wrong `markdown-it` preset, can't be empty");
      }
      if (presets.options) {
        self.set(presets.options);
      }
      if (presets.components) {
        Object.keys(presets.components).forEach(function(name) {
          if (presets.components[name].rules) {
            self[name].ruler.enableOnly(presets.components[name].rules);
          }
          if (presets.components[name].rules2) {
            self[name].ruler2.enableOnly(presets.components[name].rules2);
          }
        });
      }
      return this;
    };
    MarkdownIt.prototype.enable = function(list2, ignoreInvalid) {
      let result = [];
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.enable(list2, true));
      }, this);
      result = result.concat(this.inline.ruler2.enable(list2, true));
      const missed = list2.filter(function(name) {
        return result.indexOf(name) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt.prototype.disable = function(list2, ignoreInvalid) {
      let result = [];
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.disable(list2, true));
      }, this);
      result = result.concat(this.inline.ruler2.disable(list2, true));
      const missed = list2.filter(function(name) {
        return result.indexOf(name) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt.prototype.use = function(plugin) {
      const args = [this].concat(Array.prototype.slice.call(arguments, 1));
      plugin.apply(plugin, args);
      return this;
    };
    MarkdownIt.prototype.parse = function(src, env) {
      if (typeof src !== "string") {
        throw new Error("Input data should be a String");
      }
      const state = new this.core.State(src, this, env);
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt.prototype.render = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parse(src, env), this.options, env);
    };
    MarkdownIt.prototype.parseInline = function(src, env) {
      const state = new this.core.State(src, this, env);
      state.inlineMode = true;
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt.prototype.renderInline = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parseInline(src, env), this.options, env);
    };
    lib_default = MarkdownIt;
  }
});

// ../../node_modules/markdown-it/index.mjs
var init_markdown_it = __esm({
  "../../node_modules/markdown-it/index.mjs"() {
    init_lib();
  }
});

// ../../node_modules/@a2ui/markdown-it/src/raw-markdown.js
var MarkdownItRenderer, rawMarkdownRenderer;
var init_raw_markdown = __esm({
  "../../node_modules/@a2ui/markdown-it/src/raw-markdown.js"() {
    init_markdown_it();
    MarkdownItRenderer = class {
      constructor() {
        this.markdownIt = lib_default();
        this.registerTagClassMapRules();
      }
      /**
       * Registers rules to apply tag class maps from the environment.
       */
      registerTagClassMapRules() {
        const rulesToProxy = [
          "paragraph_open",
          "heading_open",
          "bullet_list_open",
          "ordered_list_open",
          "list_item_open",
          "link_open",
          "strong_open",
          "em_open"
        ];
        for (const ruleName of rulesToProxy) {
          const originalRule = this.markdownIt.renderer.rules[ruleName];
          this.markdownIt.renderer.rules[ruleName] = (tokens, idx, options, env, self) => {
            var _a7;
            const token = tokens[idx];
            const tagClassMap = env == null ? void 0 : env.tagClassMap;
            if (tagClassMap) {
              const tokenClasses = (_a7 = tagClassMap[token.tag]) != null ? _a7 : [];
              for (const clazz of tokenClasses) {
                token.attrJoin("class", clazz);
              }
            }
            if (originalRule) {
              return originalRule(tokens, idx, options, env, self);
            }
            return self.renderToken(tokens, idx, options);
          };
        }
      }
      /**
       * Renders the markdown string to HTML using the internal MarkdownIt instance.
       *
       * @param tagClassMap A map of tag names to classes to apply when rendering a tag.
       *
       * This method does not perform any sanitization of the outgoing HTML.
       */
      render(value, tagClassMap) {
        return this.markdownIt.render(value, { tagClassMap });
      }
    };
    rawMarkdownRenderer = new MarkdownItRenderer();
  }
});

// ../../node_modules/dompurify/dist/purify.es.mjs
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set2, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set2, null);
  }
  let l5 = array.length;
  while (l5--) {
    let element = array[l5];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l5] = lcElement;
        }
        element = lcElement;
      }
    }
    set2[element] = true;
  }
  return set2;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create2(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.4.0";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text2]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create2(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create2(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || create2(null);
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text2);
      ALLOWED_ATTR = create2(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (cfg.ADD_FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_2) {
      remove(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_2) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_2) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_2) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_2) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_2) {
      }
    }
    const body2 = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body2.insertBefore(document2.createTextNode(leadingWhitespace), body2.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body2;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i11 = childCount - 1; i11 >= 0; --i11) {
            const childClone = cloneNode(childNodes[i11], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l5 = attributes.length;
    while (l5--) {
      const attr = attributes[l5];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_2) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body2 = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body2 = _initDocument("<!---->");
      importedNode = body2.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body2 = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body2 = importedNode;
      } else {
        body2.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body2 = _initDocument(dirty);
      if (!body2) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body2 && FORCE_BODY) {
      _forceRemove(body2.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body2);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) {
        body2.normalize();
        let html2 = body2.innerHTML;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          html2 = stringReplace(html2, expr, " ");
        });
        body2.innerHTML = html2;
      }
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body2.ownerDocument);
        while (body2.firstChild) {
          returnNode.appendChild(body2.firstChild);
        }
      } else {
        returnNode = body2;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body2.outerHTML : body2.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body2.ownerDocument && body2.ownerDocument.doctype && body2.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body2.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body2.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var entries, setPrototypeOf, isFrozen, getPrototypeOf, getOwnPropertyDescriptor, freeze, seal, create2, apply, construct, arrayForEach, arrayLastIndexOf, arrayPop, arrayPush, arraySplice, stringToLowerCase, stringToString, stringMatch, stringReplace, stringIndexOf, stringTrim, objectHasOwnProperty, regExpTest, typeErrorCreate, html$1, svg$1, svgFilters, svgDisallowed, mathMl$1, mathMlDisallowed, text2, html, svg, mathMl, xml, MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR, DATA_ATTR, ARIA_ATTR, IS_ALLOWED_URI, IS_SCRIPT_OR_DATA, ATTR_WHITESPACE, DOCTYPE_NAME, CUSTOM_ELEMENT, EXPRESSIONS, NODE_TYPE, getGlobal, _createTrustedTypesPolicy, _createHooksMap, purify;
var init_purify_es = __esm({
  "../../node_modules/dompurify/dist/purify.es.mjs"() {
    ({
      entries,
      setPrototypeOf,
      isFrozen,
      getPrototypeOf,
      getOwnPropertyDescriptor
    } = Object);
    ({
      freeze,
      seal,
      create: create2
    } = Object);
    ({
      apply,
      construct
    } = typeof Reflect !== "undefined" && Reflect);
    if (!freeze) {
      freeze = function freeze2(x2) {
        return x2;
      };
    }
    if (!seal) {
      seal = function seal2(x2) {
        return x2;
      };
    }
    if (!apply) {
      apply = function apply2(func, thisArg) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        return func.apply(thisArg, args);
      };
    }
    if (!construct) {
      construct = function construct2(Func) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        return new Func(...args);
      };
    }
    arrayForEach = unapply(Array.prototype.forEach);
    arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
    arrayPop = unapply(Array.prototype.pop);
    arrayPush = unapply(Array.prototype.push);
    arraySplice = unapply(Array.prototype.splice);
    stringToLowerCase = unapply(String.prototype.toLowerCase);
    stringToString = unapply(String.prototype.toString);
    stringMatch = unapply(String.prototype.match);
    stringReplace = unapply(String.prototype.replace);
    stringIndexOf = unapply(String.prototype.indexOf);
    stringTrim = unapply(String.prototype.trim);
    objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
    regExpTest = unapply(RegExp.prototype.test);
    typeErrorCreate = unconstruct(TypeError);
    html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
    svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
    svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
    svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
    mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
    mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
    text2 = freeze(["#text"]);
    html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
    svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
    mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
    xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
    MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
    ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
    TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
    DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
    ARIA_ATTR = seal(/^aria-[\-\w]+$/);
    IS_ALLOWED_URI = seal(
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      // eslint-disable-line no-useless-escape
    );
    IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
    ATTR_WHITESPACE = seal(
      /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
      // eslint-disable-line no-control-regex
    );
    DOCTYPE_NAME = seal(/^html$/i);
    CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
    EXPRESSIONS = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      ARIA_ATTR,
      ATTR_WHITESPACE,
      CUSTOM_ELEMENT,
      DATA_ATTR,
      DOCTYPE_NAME,
      ERB_EXPR,
      IS_ALLOWED_URI,
      IS_SCRIPT_OR_DATA,
      MUSTACHE_EXPR,
      TMPLIT_EXPR
    });
    NODE_TYPE = {
      element: 1,
      text: 3,
      // Deprecated
      progressingInstruction: 7,
      comment: 8,
      document: 9
    };
    getGlobal = function getGlobal2() {
      return typeof window === "undefined" ? null : window;
    };
    _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
      if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
        return null;
      }
      let suffix = null;
      const ATTR_NAME = "data-tt-policy-suffix";
      if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
        suffix = purifyHostElement.getAttribute(ATTR_NAME);
      }
      const policyName = "dompurify" + (suffix ? "#" + suffix : "");
      try {
        return trustedTypes.createPolicy(policyName, {
          createHTML(html2) {
            return html2;
          },
          createScriptURL(scriptUrl) {
            return scriptUrl;
          }
        });
      } catch (_2) {
        console.warn("TrustedTypes policy " + policyName + " could not be created.");
        return null;
      }
    };
    _createHooksMap = function _createHooksMap2() {
      return {
        afterSanitizeAttributes: [],
        afterSanitizeElements: [],
        afterSanitizeShadowDOM: [],
        beforeSanitizeAttributes: [],
        beforeSanitizeElements: [],
        beforeSanitizeShadowDOM: [],
        uponSanitizeAttribute: [],
        uponSanitizeElement: [],
        uponSanitizeShadowNode: []
      };
    };
    purify = createDOMPurify();
  }
});

// ../../node_modules/@a2ui/markdown-it/src/sanitizer.js
function sanitize(html2) {
  if (!purify2) {
    if (typeof purify.sanitize === "function") {
      purify2 = purify;
    } else {
      const globalWindow = globalThis.window;
      if (globalWindow) {
        purify2 = purify(globalWindow);
      } else {
        throw new Error("DOMPurify requires a window object. If testing, provide a jsdom window as `globalThis`.");
      }
    }
  }
  return purify2.sanitize(html2);
}
var purify2;
var init_sanitizer = __esm({
  "../../node_modules/@a2ui/markdown-it/src/sanitizer.js"() {
    init_purify_es();
  }
});

// ../../node_modules/@a2ui/markdown-it/src/markdown.js
var markdown_exports = {};
__export(markdown_exports, {
  renderMarkdown: () => renderMarkdown
});
async function renderMarkdown(value, options) {
  const htmlString = rawMarkdownRenderer.render(value, options == null ? void 0 : options.tagClassMap);
  return sanitize(htmlString);
}
var init_markdown = __esm({
  "../../node_modules/@a2ui/markdown-it/src/markdown.js"() {
    init_raw_markdown();
    init_sanitizer();
  }
});

// ../../node_modules/@a2ui/lit/src/0.8/events/events.js
var events_exports = {};
__export(events_exports, {
  StateEvent: () => StateEvent
});
var eventInit = {
  bubbles: true,
  cancelable: true,
  composed: true
};
var _StateEvent = class _StateEvent extends CustomEvent {
  constructor(payload) {
    super(_StateEvent.eventName, { detail: payload, ...eventInit });
    this.payload = payload;
  }
};
_StateEvent.eventName = "a2uiaction";
var StateEvent = _StateEvent;

// ../../node_modules/@a2ui/web_core/src/v0_8/data/guards.js
var guards_exports = {};
__export(guards_exports, {
  isComponentArrayReference: () => isComponentArrayReference,
  isObject: () => isObject,
  isPath: () => isPath,
  isResolvedAudioPlayer: () => isResolvedAudioPlayer,
  isResolvedButton: () => isResolvedButton,
  isResolvedCard: () => isResolvedCard,
  isResolvedCheckbox: () => isResolvedCheckbox,
  isResolvedColumn: () => isResolvedColumn,
  isResolvedDateTimeInput: () => isResolvedDateTimeInput,
  isResolvedDivider: () => isResolvedDivider,
  isResolvedIcon: () => isResolvedIcon,
  isResolvedImage: () => isResolvedImage,
  isResolvedList: () => isResolvedList,
  isResolvedModal: () => isResolvedModal,
  isResolvedMultipleChoice: () => isResolvedMultipleChoice,
  isResolvedRow: () => isResolvedRow,
  isResolvedSlider: () => isResolvedSlider,
  isResolvedTabs: () => isResolvedTabs,
  isResolvedText: () => isResolvedText,
  isResolvedTextField: () => isResolvedTextField,
  isResolvedVideo: () => isResolvedVideo,
  isValueMap: () => isValueMap
});
function isValueMap(value) {
  return isObject(value) && "key" in value;
}
function isPath(key, value) {
  return key === "path" && typeof value === "string";
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isComponentArrayReference(value) {
  if (!isObject(value))
    return false;
  return "explicitList" in value || "template" in value;
}
function isStringValue(value) {
  return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "string" || "literalString" in value);
}
function isNumberValue(value) {
  return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "number" || "literalNumber" in value);
}
function isBooleanValue(value) {
  return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "boolean" || "literalBoolean" in value);
}
function isAnyComponentNode(value) {
  if (!isObject(value))
    return false;
  const hasBaseKeys = "id" in value && "type" in value && "properties" in value;
  if (!hasBaseKeys)
    return false;
  return true;
}
function isResolvedAudioPlayer(props) {
  return isObject(props) && "url" in props && isStringValue(props.url);
}
function isResolvedButton(props) {
  return isObject(props) && "child" in props && isAnyComponentNode(props.child) && "action" in props;
}
function isResolvedCard(props) {
  if (!isObject(props))
    return false;
  if (!("child" in props)) {
    if (!("children" in props)) {
      return false;
    } else {
      return Array.isArray(props.children) && props.children.every(isAnyComponentNode);
    }
  }
  return isAnyComponentNode(props.child);
}
function isResolvedCheckbox(props) {
  return isObject(props) && "label" in props && isStringValue(props.label) && "value" in props && isBooleanValue(props.value);
}
function isResolvedColumn(props) {
  return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
function isResolvedDateTimeInput(props) {
  return isObject(props) && "value" in props && isStringValue(props.value);
}
function isResolvedDivider(props) {
  return isObject(props);
}
function isResolvedImage(props) {
  return isObject(props) && "url" in props && isStringValue(props.url);
}
function isResolvedIcon(props) {
  return isObject(props) && "name" in props && isStringValue(props.name);
}
function isResolvedList(props) {
  return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
function isResolvedModal(props) {
  return isObject(props) && "entryPointChild" in props && isAnyComponentNode(props.entryPointChild) && "contentChild" in props && isAnyComponentNode(props.contentChild);
}
function isResolvedMultipleChoice(props) {
  return isObject(props) && "selections" in props;
}
function isResolvedRow(props) {
  return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
function isResolvedSlider(props) {
  return isObject(props) && "value" in props && isNumberValue(props.value);
}
function isResolvedTabItem(item) {
  return isObject(item) && "title" in item && isStringValue(item.title) && "child" in item && isAnyComponentNode(item.child);
}
function isResolvedTabs(props) {
  return isObject(props) && "tabItems" in props && Array.isArray(props.tabItems) && props.tabItems.every(isResolvedTabItem);
}
function isResolvedText(props) {
  return isObject(props) && "text" in props && isStringValue(props.text);
}
function isResolvedTextField(props) {
  return isObject(props) && "label" in props && isStringValue(props.label);
}
function isResolvedVideo(props) {
  return isObject(props) && "url" in props && isStringValue(props.url);
}

// ../../node_modules/@a2ui/web_core/src/v0_8/events/index.js
var events_exports2 = {};
__export(events_exports2, {
  A2UIValidationEvent: () => A2UIValidationEvent
});

// ../../node_modules/@a2ui/web_core/src/v0_8/events/validation-event.js
var _A2UIValidationEvent = class _A2UIValidationEvent extends CustomEvent {
  constructor(detail, eventInitDict) {
    super(_A2UIValidationEvent.EVENT_NAME, {
      bubbles: true,
      composed: true,
      ...eventInitDict,
      detail: {
        ...detail,
        eventType: _A2UIValidationEvent.EVENT_NAME
      }
    });
  }
};
_A2UIValidationEvent.EVENT_NAME = "a2ui-validation-input";
var A2UIValidationEvent = _A2UIValidationEvent;

// ../../node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_2) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k2) => typeof obj[obj[k2]] !== "number");
    const filtered = {};
    for (const k2 of validKeys) {
      filtered[k2] = obj[k2];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e11) {
      return obj[e11];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj || {}) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_2, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t7 = typeof data;
  switch (t7) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error2) => {
      for (const issue of error2.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i11 = 0;
          while (i11 < issue.path.length) {
            const el = issue.path[i11];
            const terminal = i11 === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i11++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error2 = new ZodError(issues);
  return error2;
};

// ../../node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map2) {
  overrideErrorMap = map2;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m5) => !!m5).slice().reverse();
  for (const map2 of maps) {
    errorMessage = map2(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x2) => !!x2)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s11 of results) {
      if (s11.status === "aborted")
        return INVALID;
      if (s11.status === "dirty")
        status.dirty();
      arrayValue.push(s11.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x2) => x2.status === "aborted";
var isDirty = (x2) => x2.status === "dirty";
var isValid = (x2) => x2.status === "valid";
var isAsync = (x2) => typeof Promise !== "undefined" && x2 instanceof Promise;

// ../../node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error2 = new ZodError(ctx.common.issues);
        this._error = error2;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a7, _b2;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message != null ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a7 = message != null ? message : required_error) != null ? _a7 : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b2 = message != null ? message : invalid_type_error) != null ? _b2 : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input2) {
    return getParsedType(input2.data);
  }
  _getOrReturnCtx(input2, ctx) {
    return ctx || {
      common: input2.parent.common,
      data: input2.data,
      parsedType: getParsedType(input2.data),
      schemaErrorMap: this._def.errorMap,
      path: input2.path,
      parent: input2.parent
    };
  }
  _processInputParams(input2) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input2.parent.common,
        data: input2.data,
        parsedType: getParsedType(input2.data),
        schemaErrorMap: this._def.errorMap,
        path: input2.path,
        parent: input2.parent
      }
    };
  }
  _parseSync(input2) {
    const result = this._parse(input2);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input2) {
    const result = this._parse(input2);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a7;
    const ctx = {
      common: {
        issues: [],
        async: (_a7 = params == null ? void 0 : params.async) != null ? _a7 : false,
        contextualErrorMap: params == null ? void 0 : params.errorMap
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a7, _b2;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b2 = (_a7 = err == null ? void 0 : err.message) == null ? void 0 : _a7.toLowerCase()) == null ? void 0 : _b2.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params == null ? void 0 : params.errorMap,
        async: true
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (e11) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = String(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input2.data.length < check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input2.data.length > check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input2.data.length > check.value;
        const tooSmall = input2.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input2.data);
        } catch (e11) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input2.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input2.data = input2.data.trim();
      } else if (check.kind === "includes") {
        if (!input2.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input2.data = input2.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input2.data = input2.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input2.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input2.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input2.data, check.version)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input2.data, check.alg)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input2.data, check.version)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input2.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a7, _b2;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      offset: (_a7 = options == null ? void 0 : options.offset) != null ? _a7 : false,
      local: (_b2 = options == null ? void 0 : options.local) != null ? _b2 : false,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options == null ? void 0 : options.position,
      ...errorUtil.errToObj(options == null ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a7;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a7 = params == null ? void 0 : params.coerce) != null ? _a7 : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = Number(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input2.data < check.value : input2.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input2.data > check.value : input2.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input2.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input2.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input2) {
    if (this._def.coerce) {
      try {
        input2.data = BigInt(input2.data);
      } catch (e11) {
        return this._getInvalidInput(input2);
      }
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input2);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input2.data < check.value : input2.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input2.data > check.value : input2.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input2.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input2.data };
  }
  _getInvalidInput(input2) {
    const ctx = this._getOrReturnCtx(input2);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a7;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a7 = params == null ? void 0 : params.coerce) != null ? _a7 : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = Boolean(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = new Date(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input2.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input2.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input2.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input2.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input2) {
    return OK(input2.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input2) {
    return OK(input2.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input2) {
    const ctx = this._getOrReturnCtx(input2);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input2) {
    const { ctx, status } = this._processInputParams(input2);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i11) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i11));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i11) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i11));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input2);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a7, _b2, _c, _d;
          const defaultError = (_c = (_b2 = (_a7 = this._def).errorMap) == null ? void 0 : _b2.call(_a7, issue, ctx).message) != null ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) != null ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type2) => {
  if (type2 instanceof ZodLazy) {
    return getDiscriminator(type2.schema);
  } else if (type2 instanceof ZodEffects) {
    return getDiscriminator(type2.innerType());
  } else if (type2 instanceof ZodLiteral) {
    return [type2.value];
  } else if (type2 instanceof ZodEnum) {
    return type2.options;
  } else if (type2 instanceof ZodNativeEnum) {
    return util.objectValues(type2.enum);
  } else if (type2 instanceof ZodDefault) {
    return getDiscriminator(type2._def.innerType);
  } else if (type2 instanceof ZodUndefined) {
    return [void 0];
  } else if (type2 instanceof ZodNull) {
    return [null];
  } else if (type2 instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodNullable) {
    return [null, ...getDiscriminator(type2.unwrap())];
  } else if (type2 instanceof ZodBranded) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodReadonly) {
    return getDiscriminator(type2.unwrap());
  } else if (type2 instanceof ZodCatch) {
    return getDiscriminator(type2._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type2 of options) {
      const discriminatorValues = getDiscriminator(type2.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type2);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a4, b3) {
  const aType = getParsedType(a4);
  const bType = getParsedType(b3);
  if (a4 === b3) {
    return { valid: true, data: a4 };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b3);
    const sharedKeys = util.objectKeys(a4).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a4, ...b3 };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a4[key], b3[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a4.length !== b3.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a4.length; index++) {
      const itemA = a4[index];
      const itemB = b3[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a4 === +b3) {
    return { valid: true, data: a4 };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x2) => !!x2);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i11) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i11)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error2) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error2
        }
      });
    }
    function makeReturnsIssue(returns, error2) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error2
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error2 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e11) => {
          error2.addIssue(makeArgsIssue(args, e11));
          throw error2;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e11) => {
          error2.addIssue(makeReturnsIssue(result, e11));
          throw error2;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input2) {
    if (input2.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input2.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input2) {
    if (typeof input2.data !== "string") {
      const ctx = this._getOrReturnCtx(input2);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input2.data)) {
      const ctx = this._getOrReturnCtx(input2);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input2.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input2) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input2);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input2.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input2.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    const effect2 = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect2.type === "preprocess") {
      const processed = effect2.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect2.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect2.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect2.type === "transform") {
      if (ctx.common.async === false) {
        const base2 = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base2))
          return INVALID;
        const result = effect2.transform(base2.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base2) => {
          if (!isValid(base2))
            return INVALID;
          return Promise.resolve(effect2.transform(base2.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect2);
  }
};
ZodEffects.create = (schema, effect2, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect: effect2,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type2, params) => {
  return new ZodOptional({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type2, params) => {
  return new ZodNullable({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type2, params) => {
  return new ZodDefault({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type2, params) => {
  return new ZodCatch({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input2.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a4, b3) {
    return new _ZodPipeline({
      in: a4,
      out: b3,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input2) {
    const result = this._def.innerType._parse(input2);
    const freeze2 = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze2(data)) : freeze2(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type2, params) => {
  return new ZodReadonly({
    innerType: type2,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p5 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p22 = typeof p5 === "string" ? { message: p5 } : p5;
  return p22;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a7, _b2;
      const r9 = check(data);
      if (r9 instanceof Promise) {
        return r9.then((r10) => {
          var _a8, _b3;
          if (!r10) {
            const params = cleanParams(_params, data);
            const _fatal = (_b3 = (_a8 = params.fatal) != null ? _a8 : fatal) != null ? _b3 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r9) {
        const params = cleanParams(_params, data);
        const _fatal = (_b2 = (_a7 = params.fatal) != null ? _a7 : fatal) != null ? _b2 : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// ../../node_modules/@a2ui/web_core/src/v0_8/schema/common-types.js
var exactlyOneKey = (val, ctx) => {
  const keys = Object.keys(val || {}).filter((k2) => val[k2] !== void 0);
  if (keys.length !== 1) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: `Must define exactly one property, found ${keys.length} (${keys.join(", ")}).`
    });
  }
};
var StringValueSchema = external_exports.object({
  path: external_exports.string().optional(),
  literalString: external_exports.string().optional(),
  literal: external_exports.string().optional()
}).strict().superRefine(exactlyOneKey);
var DataValueMapItemSchema = external_exports.lazy(() => external_exports.object({
  key: external_exports.string(),
  valueString: external_exports.string().optional(),
  valueNumber: external_exports.number().optional(),
  valueBoolean: external_exports.boolean().optional(),
  valueMap: external_exports.array(DataValueMapItemSchema).optional()
}).strict().superRefine((val, ctx) => {
  let count = 0;
  if (val.valueString !== void 0)
    count++;
  if (val.valueNumber !== void 0)
    count++;
  if (val.valueBoolean !== void 0)
    count++;
  if (val.valueMap !== void 0)
    count++;
  if (count !== 1) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: `Value map item must have exactly one value property (valueString, valueNumber, valueBoolean, valueMap), found ${count}.`
    });
  }
}));
var DataValueSchema = external_exports.object({
  key: external_exports.string(),
  valueString: external_exports.string().optional(),
  valueNumber: external_exports.number().optional(),
  valueBoolean: external_exports.boolean().optional(),
  valueMap: external_exports.array(DataValueMapItemSchema).optional()
}).strict().superRefine((val, ctx) => {
  let count = 0;
  if (val.valueString !== void 0)
    count++;
  if (val.valueNumber !== void 0)
    count++;
  if (val.valueBoolean !== void 0)
    count++;
  if (val.valueMap !== void 0)
    count++;
  if (count !== 1) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: `Value must have exactly one value property (valueString, valueNumber, valueBoolean, valueMap), found ${count}.`
    });
  }
}).superRefine((val, ctx) => {
  const checkDepth = (v3, currentDepth) => {
    if (currentDepth > 5) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: "valueMap recursion exceeded maximum depth of 5."
      });
      return;
    }
    if (v3.valueMap && Array.isArray(v3.valueMap)) {
      for (const item of v3.valueMap) {
        checkDepth(item, currentDepth + 1);
      }
    }
  };
  checkDepth(val, 1);
});
var NumberValueSchema = external_exports.object({
  path: external_exports.string().optional(),
  literalNumber: external_exports.number().optional(),
  literal: external_exports.number().optional()
}).strict().superRefine(exactlyOneKey);
var BooleanValueSchema = external_exports.object({
  path: external_exports.string().optional(),
  literalBoolean: external_exports.boolean().optional(),
  literal: external_exports.boolean().optional()
}).strict().superRefine(exactlyOneKey);
var ActionSchema = external_exports.object({
  name: external_exports.string().describe("A unique name identifying the action (e.g., 'submitForm')."),
  context: external_exports.array(external_exports.object({
    key: external_exports.string(),
    value: external_exports.object({
      path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
      literalString: external_exports.string().describe("A fixed, hardcoded string value.").optional(),
      literalNumber: external_exports.number().optional(),
      literalBoolean: external_exports.boolean().optional()
    }).describe("The dynamic value. Define EXACTLY ONE of the nested properties.").strict().superRefine(exactlyOneKey)
  })).describe("A key-value map of data bindings to be resolved when the action is triggered.").optional()
});
var TextSchema = external_exports.object({
  text: StringValueSchema,
  usageHint: external_exports.enum(["h1", "h2", "h3", "h4", "h5", "caption", "body"]).optional()
});
var ImageSchema = external_exports.object({
  url: StringValueSchema,
  usageHint: external_exports.enum([
    "icon",
    "avatar",
    "smallFeature",
    "mediumFeature",
    "largeFeature",
    "header"
  ]).optional(),
  fit: external_exports.enum(["contain", "cover", "fill", "none", "scale-down"]).optional(),
  altText: StringValueSchema.optional()
});
var IconSchema = external_exports.object({
  name: StringValueSchema
});
var VideoSchema = external_exports.object({
  url: StringValueSchema
});
var AudioPlayerSchema = external_exports.object({
  url: StringValueSchema,
  description: StringValueSchema.optional().describe("A label, title, or placeholder text.")
});
var TabsSchema = external_exports.object({
  tabItems: external_exports.array(external_exports.object({
    title: external_exports.object({
      path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
      literalString: external_exports.string().describe("A fixed, hardcoded string value.").optional()
    }),
    child: external_exports.string().describe("A reference to a component instance by its unique ID.")
  }).strict().superRefine((val, ctx) => {
    if (!val.title) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: "Tab item is missing 'title'."
      });
    }
    if (!val.child) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: "Tab item is missing 'child'."
      });
    }
    if (val.title) {
      exactlyOneKey(val.title, ctx);
    }
  })).describe("A list of tabs, each with a title and a child component ID.")
});
var DividerSchema = external_exports.object({
  axis: external_exports.enum(["horizontal", "vertical"]).optional().describe("The orientation."),
  color: external_exports.string().optional().describe("The color of the divider (e.g., hex code or semantic name)."),
  thickness: external_exports.number().optional().describe("The thickness of the divider.")
});
var ModalSchema = external_exports.object({
  entryPointChild: external_exports.string().describe("The ID of the component (e.g., a button) that triggers the modal."),
  contentChild: external_exports.string().describe("The ID of the component to display as the modal's content.")
});
var ButtonSchema = external_exports.object({
  child: external_exports.string().describe("The ID of the component to display as the button's content."),
  action: ActionSchema.describe("Represents a user-initiated action."),
  primary: external_exports.boolean().optional().describe("Indicates if this button should be styled as the primary action.")
});
var CheckboxSchema = external_exports.object({
  label: StringValueSchema,
  value: external_exports.object({
    path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
    literalBoolean: external_exports.boolean().optional()
  }).strict().superRefine(exactlyOneKey)
});
var TextFieldSchema = external_exports.object({
  text: StringValueSchema.optional(),
  label: StringValueSchema.describe("A label, title, or placeholder text."),
  textFieldType: external_exports.enum(["shortText", "number", "date", "longText"]).optional(),
  validationRegexp: external_exports.string().optional().describe("A regex string to validate the input.")
});
var DateTimeInputSchema = external_exports.object({
  value: StringValueSchema,
  enableDate: external_exports.boolean().optional(),
  enableTime: external_exports.boolean().optional(),
  outputFormat: external_exports.string().optional().describe("The string format for the output (e.g., 'YYYY-MM-DD').")
});
var MultipleChoiceSchema = external_exports.object({
  selections: external_exports.object({
    path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
    literalArray: external_exports.array(external_exports.string()).optional()
  }).strict().superRefine(exactlyOneKey),
  options: external_exports.array(external_exports.object({
    label: external_exports.object({
      path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
      literalString: external_exports.string().describe("A fixed, hardcoded string value.").optional()
    }).strict().superRefine(exactlyOneKey),
    value: external_exports.string()
  })).optional(),
  maxAllowedSelections: external_exports.number().optional(),
  type: external_exports.enum(["checkbox", "chips"]).optional(),
  filterable: external_exports.boolean().optional()
});
var SliderSchema = external_exports.object({
  value: external_exports.object({
    path: external_exports.string().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
    literalNumber: external_exports.number().optional()
  }).strict().superRefine(exactlyOneKey),
  minValue: external_exports.number().optional(),
  maxValue: external_exports.number().optional(),
  label: StringValueSchema.optional()
});
var ComponentArrayTemplateSchema = external_exports.object({
  componentId: external_exports.string(),
  dataBinding: external_exports.string()
});
var ComponentArrayReferenceSchema = external_exports.object({
  explicitList: external_exports.array(external_exports.string()).optional(),
  template: ComponentArrayTemplateSchema.describe("A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.").optional()
}).strict().superRefine(exactlyOneKey);
var RowSchema = external_exports.object({
  children: ComponentArrayReferenceSchema,
  distribution: external_exports.enum([
    "start",
    "center",
    "end",
    "spaceBetween",
    "spaceAround",
    "spaceEvenly"
  ]).optional(),
  alignment: external_exports.enum(["start", "center", "end", "stretch"]).optional()
});
var ColumnSchema = external_exports.object({
  children: ComponentArrayReferenceSchema,
  distribution: external_exports.enum([
    "start",
    "center",
    "end",
    "spaceBetween",
    "spaceAround",
    "spaceEvenly"
  ]).optional(),
  alignment: external_exports.enum(["start", "center", "end", "stretch"]).optional()
});
var ListSchema = external_exports.object({
  children: ComponentArrayReferenceSchema,
  direction: external_exports.enum(["vertical", "horizontal"]).optional(),
  alignment: external_exports.enum(["start", "center", "end", "stretch"]).optional()
});
var CardSchema = external_exports.object({
  child: external_exports.string().describe("The ID of the component to be rendered inside the card.")
});

// ../../node_modules/@a2ui/web_core/src/v0_8/schema/server-to-client.js
var ValueMapSchema = DataValueSchema.describe("A single data entry. Exactly one 'value*' property should be provided alongside the key.");
var AnyComponentSchema = external_exports.object({
  Text: TextSchema.optional(),
  Image: ImageSchema.optional(),
  Icon: IconSchema.optional(),
  Video: VideoSchema.optional(),
  AudioPlayer: AudioPlayerSchema.optional(),
  Row: external_exports.lazy(() => RowSchema).optional(),
  Column: external_exports.lazy(() => ColumnSchema).optional(),
  List: external_exports.lazy(() => ListSchema).optional(),
  Card: external_exports.lazy(() => CardSchema).optional(),
  Tabs: TabsSchema.optional(),
  Divider: DividerSchema.optional(),
  Modal: ModalSchema.optional(),
  Button: ButtonSchema.optional(),
  Checkbox: CheckboxSchema.optional(),
  TextField: TextFieldSchema.optional(),
  DateTimeInput: DateTimeInputSchema.optional(),
  MultipleChoice: MultipleChoiceSchema.optional(),
  Slider: SliderSchema.optional()
}).catchall(external_exports.any());
var ComponentPropertiesSchema = AnyComponentSchema;
var ComponentInstanceSchema = external_exports.object({
  id: external_exports.string().describe("The unique identifier for this component."),
  weight: external_exports.number().optional().describe("The relative weight of this component within a Row or Column. This corresponds to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."),
  component: ComponentPropertiesSchema.describe("A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading'). The value is an object containing the properties for that specific component.")
}).strict().describe("Represents a *single* component in a UI widget tree. This component could be one of many supported types.");
var BeginRenderingMessageSchema = external_exports.object({
  surfaceId: external_exports.string().describe("The unique identifier for the UI surface to be rendered."),
  catalogId: external_exports.string().optional().describe("The identifier of the component catalog to use for this surface. If omitted, the client MUST default to the standard catalog for this A2UI version (https://a2ui.org/specification/v0_8/standard_catalog_definition.json)."),
  root: external_exports.string().describe("The ID of the root component to render."),
  styles: external_exports.object({
    font: external_exports.string().optional().describe("The primary font for the UI."),
    primaryColor: external_exports.string().regex(/^#[0-9a-fA-F]{6}$/).optional().describe("The primary UI color as a hexadecimal code (e.g., '#00BFFF').")
  }).strict().optional().describe("Styling information for the UI.")
}).strict().describe("Signals the client to begin rendering a surface with a root component and specific styles.");
var SurfaceUpdateMessageSchema = external_exports.object({
  surfaceId: external_exports.string().describe("The unique identifier for the UI surface to be updated. If you are adding a new surface this *must* be a new, unique identified that has never been used for any existing surfaces shown."),
  components: external_exports.array(ComponentInstanceSchema).min(1).describe("A list containing all UI components for the surface.")
}).strict().superRefine((data, ctx) => {
  var _a7;
  const componentIds = /* @__PURE__ */ new Set();
  for (const c8 of data.components) {
    if (c8.id) {
      if (componentIds.has(c8.id)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          message: `Duplicate component ID found: ${c8.id}`,
          path: ["components"]
        });
      }
      componentIds.add(c8.id);
    }
  }
  const checkRefs = (ids, componentId) => {
    for (const id of ids) {
      if (id && !componentIds.has(id)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          message: `Component '${componentId}' references non-existent component ID '${id}'.`,
          path: ["components"]
        });
      }
    }
  };
  for (const component of data.components) {
    if (!component.id || !component.component)
      continue;
    const componentTypes = Object.keys(component.component);
    if (componentTypes.length !== 1)
      continue;
    const componentType = componentTypes[0];
    const properties = component.component[componentType];
    switch (componentType) {
      case "Row":
      case "Column":
      case "List":
        if (properties.children && !Array.isArray(properties.children)) {
          const hasExplicit = !!properties.children.explicitList;
          const hasTemplate = !!properties.children.template;
          if (hasExplicit && hasTemplate || !hasExplicit && !hasTemplate) {
            ctx.addIssue({
              code: external_exports.ZodIssueCode.custom,
              message: `Component '${component.id}' must have either 'explicitList' or 'template' in children, but not both or neither.`
            });
          }
          if (hasExplicit)
            checkRefs(properties.children.explicitList, component.id);
          if (hasTemplate)
            checkRefs([(_a7 = properties.children.template) == null ? void 0 : _a7.componentId], component.id);
        }
        break;
      case "Card":
        if (properties.child)
          checkRefs([properties.child], component.id);
        break;
      case "Tabs":
        if (properties.tabItems && Array.isArray(properties.tabItems)) {
          properties.tabItems.forEach((tab) => {
            if (tab.child)
              checkRefs([tab.child], component.id);
          });
        }
        break;
      case "Modal":
        checkRefs([properties.entryPointChild, properties.contentChild], component.id);
        break;
      case "Button":
        if (properties.child)
          checkRefs([properties.child], component.id);
        break;
    }
  }
}).describe("Updates a surface with a new set of components.");
var DataModelUpdateMessageSchema = external_exports.object({
  surfaceId: external_exports.string().describe("The unique identifier for the UI surface this data model update applies to."),
  path: external_exports.string().optional().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', the entire data model will be replaced."),
  contents: external_exports.array(ValueMapSchema).describe("An array of data entries. Each entry must contain a 'key' and exactly one corresponding typed 'value*' property.")
}).strict().describe("Updates the data model for a surface.");
var DeleteSurfaceMessageSchema = external_exports.object({
  surfaceId: external_exports.string().describe("The unique identifier for the UI surface to be deleted.")
}).strict().describe("Signals the client to delete the surface identified by 'surfaceId'.");
var A2uiMessageSchema = external_exports.object({
  beginRendering: BeginRenderingMessageSchema.optional(),
  surfaceUpdate: SurfaceUpdateMessageSchema.optional(),
  dataModelUpdate: DataModelUpdateMessageSchema.optional(),
  deleteSurface: DeleteSurfaceMessageSchema.optional()
}).strict().superRefine((data, ctx) => {
  const keys = Object.keys(data || {}).filter((k2) => [
    "beginRendering",
    "surfaceUpdate",
    "dataModelUpdate",
    "deleteSurface"
  ].includes(k2));
  if (keys.length !== 1) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "A2UI Protocol message must have exactly one of: surfaceUpdate, dataModelUpdate, beginRendering, deleteSurface."
    });
  }
}).describe("Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces. A message MUST contain exactly ONE of the action properties: 'beginRendering', 'surfaceUpdate', 'dataModelUpdate', or 'deleteSurface'.");

// ../../node_modules/@a2ui/web_core/src/v0_8/errors.js
var A2uiError = class extends Error {
  constructor(message, code2 = "UNKNOWN_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.code = code2;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var A2uiValidationError = class extends A2uiError {
  constructor(message, details) {
    super(message, "VALIDATION_ERROR");
    this.details = details;
  }
};
var A2uiStateError = class extends A2uiError {
  constructor(message) {
    super(message, "STATE_ERROR");
  }
};

// ../../node_modules/@a2ui/web_core/src/v0_8/data/model-processor.js
function __a2uiShouldResolveChildString(propertyKey) {
  if (propertyKey === void 0 || propertyKey === null) return true;
  return propertyKey !== "usageHint" && propertyKey !== "icon";
}
function __a2uiNormalizeArrayLikeValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if (value instanceof Map) {
    const keys = Array.from(value.keys()).map((k) => String(k));
    if (keys.length === 0 || !keys.every((k) => /^\d+$/.test(k))) {
      return value;
    }
    const sorted = keys.map((k) => Number(k)).sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i += 1) {
      if (sorted[i] !== i) {
        return value;
      }
    }
    return sorted.map((idx) => value.get(String(idx)));
  }

  const keys = Object.keys(value);
  if (keys.length === 0 || !keys.every((k) => /^\d+$/.test(k))) {
    return value;
  }
  const sorted = keys.map((k) => Number(k)).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i] !== i) {
      return value;
    }
  }
  return sorted.map((idx) => value[String(idx)]);
}
function __a2uiDebugEnabled() {
  try {
    if (typeof window === "undefined") return false;
    const search = new URLSearchParams(window.location.search || "");
    const hashQuery = (window.location.hash || "").includes("?")
      ? new URLSearchParams((window.location.hash || "").split("?")[1] || "")
      : null;
    const queryDebug = search.get("a2uiDebug");
    const hashDebug = hashQuery && hashQuery.get("a2uiDebug");
    const storageDebug = window.localStorage
      ? window.localStorage.getItem("a2uiDebug")
      : null;
    return [queryDebug, hashDebug, storageDebug].some((v) => v === "1" || v === "true");
  } catch (_e) {
    return false;
  }
}
function __a2uiDebugLog(...args) {
  if (!__a2uiDebugEnabled()) return;
  try {
    console.log("[A2UI MC DEBUG]", ...args);
  } catch (_e) {
    // noop
  }
}
function __a2uiI18nText(key) {
  try {
    const fallbackMap = {
      "Please enter a value": "请输入内容",
      "No options found": "未找到可选项",
      "Select items": "请选择",
      "Filter options...": "筛选选项..."
    };
    const customMap = typeof window !== "undefined" && window.A2UI_I18N && typeof window.A2UI_I18N === "object"
      ? window.A2UI_I18N
      : null;
    if (customMap && typeof customMap[key] === "string" && customMap[key]) {
      return customMap[key];
    }
    return fallbackMap[key] || key;
  } catch (_e) {
    return key;
  }
}
function __a2uiI18nCountSelected(count) {
  return count > 0 ? `已选择 ${count} 项` : __a2uiI18nText("Select items");
}
var _A2uiMessageProcessor = class _A2uiMessageProcessor {
  constructor(opts = { mapCtor: Map, arrayCtor: Array, setCtor: Set, objCtor: Object }) {
    this.opts = opts;
    this.mapCtor = Map;
    this.arrayCtor = Array;
    this.setCtor = Set;
    this.objCtor = Object;
    this.arrayCtor = opts.arrayCtor;
    this.mapCtor = opts.mapCtor;
    this.setCtor = opts.setCtor;
    this.objCtor = opts.objCtor;
    this.surfaces = new opts.mapCtor();
  }
  getSurfaces() {
    const allSurfaces = this.surfaces;
    const visibleSurfaces = /* @__PURE__ */ new Map();
    for (const [surfaceId, surface] of allSurfaces) {
      if (surface.rootComponentId) {
        visibleSurfaces.set(surfaceId, surface);
      }
    }
    return visibleSurfaces;
  }
  clearSurfaces() {
    this.surfaces.clear();
  }
  processMessages(messages) {
    for (const rawMessage of messages) {
      const message = A2uiMessageSchema.parse(rawMessage);
      if (message.beginRendering) {
        this.handleBeginRendering(message.beginRendering, message.beginRendering.surfaceId);
      }
      if (message.surfaceUpdate) {
        this.handleSurfaceUpdate(message.surfaceUpdate, message.surfaceUpdate.surfaceId);
      }
      if (message.dataModelUpdate) {
        this.handleDataModelUpdate(message.dataModelUpdate, message.dataModelUpdate.surfaceId);
      }
      if (message.deleteSurface) {
        this.handleDeleteSurface(message.deleteSurface);
      }
    }
  }
  /**
   * Retrieves the data for a given component node and a relative path string.
   * This correctly handles the special `.` path, which refers to the node's
   * own data context.
   */
  getData(node, relativePath, surfaceId = _A2uiMessageProcessor.DEFAULT_SURFACE_ID) {
    var _a7;
    const surface = this.getOrCreateSurface(surfaceId);
    if (!surface)
      return null;
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    return __a2uiNormalizeArrayLikeValue(this.getDataByPath(surface.dataModel, finalPath));
  }
  setData(node, relativePath, value, surfaceId = _A2uiMessageProcessor.DEFAULT_SURFACE_ID) {
    var _a7;
    if (!node) {
      console.warn("No component node set");
      return;
    }
    const surface = this.getOrCreateSurface(surfaceId);
    if (!surface)
      return;
    if (relativePath == null) {
      return;
    }
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    this.setDataByPath(surface.dataModel, finalPath, value);
  }
  resolvePath(path, dataContextPath) {
    if (path == null || path === "" || typeof path !== "string") {
      return "/";
    }
    if (path.startsWith("/")) {
      return path;
    }
    if (dataContextPath && dataContextPath !== "/") {
      return dataContextPath.endsWith("/") ? `${dataContextPath}${path}` : `${dataContextPath}/${path}`;
    }
    return `/${path}`;
  }
  parseIfJsonString(value) {
    if (typeof value !== "string") {
      return value;
    }
    const trimmedValue = value.trim();
    if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}") || trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
      try {
        return JSON.parse(value);
      } catch (e11) {
        console.warn(`Failed to parse potential JSON string: "${value.substring(0, 50)}..."`, e11);
        return value;
      }
    }
    return value;
  }
  /**
   * Converts a specific array format [{key: "...", value_string: "..."}, ...]
   * into a standard Map. It also attempts to parse any string values that
   * appear to be stringified JSON.
   */
  convertKeyValueArrayToMap(arr) {
    const map2 = new this.mapCtor();
    for (const item of arr) {
      if (!isObject(item) || !("key" in item))
        continue;
      const key = item.key;
      const valueKey = this.findValueKey(item);
      if (!valueKey)
        continue;
      let value = item[valueKey];
      if (valueKey === "valueMap" && Array.isArray(value)) {
        value = this.convertKeyValueArrayToMap(value);
      } else if (typeof value === "string") {
        value = this.parseIfJsonString(value);
      }
      this.setDataByPath(map2, key, value);
    }
    return map2;
  }
  setDataByPath(root, path, value) {
    if (Array.isArray(value) && (value.length === 0 || isObject(value[0]) && "key" in value[0])) {
      if (value.length === 1 && isObject(value[0]) && value[0].key === ".") {
        const item = value[0];
        const valueKey = this.findValueKey(item);
        if (valueKey) {
          value = item[valueKey];
          if (valueKey === "valueMap" && Array.isArray(value)) {
            value = this.convertKeyValueArrayToMap(value);
          } else if (typeof value === "string") {
            value = this.parseIfJsonString(value);
          }
        } else {
          value = this.convertKeyValueArrayToMap(value);
        }
      } else {
        value = this.convertKeyValueArrayToMap(value);
      }
    }
    const segments = this.normalizePath(path).split("/").filter((s11) => s11);
    if (segments.length === 0) {
      if (value instanceof Map || isObject(value)) {
        if (!(value instanceof Map) && isObject(value)) {
          value = new this.mapCtor(Object.entries(value || {}));
        }
        root.clear();
        for (const [key, v3] of value.entries()) {
          root.set(key, v3);
        }
      } else {
        console.error("Cannot set root of DataModel to a non-Map value.");
      }
      return;
    }
    let current = root;
    for (let i11 = 0; i11 < segments.length - 1; i11++) {
      const segment = segments[i11];
      let target;
      if (current instanceof Map) {
        target = current.get(segment);
      } else if (Array.isArray(current) && /^\d+$/.test(segment)) {
        target = current[parseInt(segment, 10)];
      }
      if (target === void 0 || typeof target !== "object" || target === null) {
        target = new this.mapCtor();
        if (current instanceof this.mapCtor) {
          current.set(segment, target);
        } else if (Array.isArray(current)) {
          current[parseInt(segment, 10)] = target;
        }
      }
      current = target;
    }
    const finalSegment = segments[segments.length - 1];
    const storedValue = value;
    if (current instanceof this.mapCtor) {
      current.set(finalSegment, storedValue);
    } else if (Array.isArray(current) && /^\d+$/.test(finalSegment)) {
      current[parseInt(finalSegment, 10)] = storedValue;
    }
  }
  /**
   * Normalizes a path string into a consistent, slash-delimited format.
   * Converts bracket notation and dot notation in a two-pass.
   * e.g., "bookRecommendations[0].title" -> "/bookRecommendations/0/title"
   * e.g., "book.0.title" -> "/book/0/title"
   */
  normalizePath(path) {
    const dotPath = path.replace(/\[(\d+)\]/g, ".$1");
    const segments = dotPath.split(".");
    return "/" + segments.filter((s11) => s11.length > 0).join("/");
  }
  getDataByPath(root, path) {
    const segments = this.normalizePath(path).split("/").filter((s11) => s11);
    let current = root;
    for (const segment of segments) {
      if (current === void 0 || current === null)
        return null;
      if (current instanceof Map) {
        current = current.get(segment);
      } else if (Array.isArray(current) && /^\d+$/.test(segment)) {
        current = current[parseInt(segment, 10)];
      } else if (isObject(current)) {
        current = current[segment];
      } else {
        return null;
      }
    }
    return current;
  }
  getOrCreateSurface(surfaceId) {
    let surface = this.surfaces.get(surfaceId);
    if (!surface) {
      surface = new this.objCtor({
        rootComponentId: null,
        componentTree: null,
        dataModel: new this.mapCtor(),
        components: new this.mapCtor(),
        styles: new this.objCtor()
      });
      this.surfaces.set(surfaceId, surface);
    }
    return surface;
  }
  handleBeginRendering(message, surfaceId) {
    var _a7;
    const surface = this.getOrCreateSurface(surfaceId);
    surface.rootComponentId = message.root;
    surface.styles = (_a7 = message.styles) != null ? _a7 : {};
    this.rebuildComponentTree(surface);
  }
  handleSurfaceUpdate(message, surfaceId) {
    const surface = this.getOrCreateSurface(surfaceId);
    for (const component of message.components) {
      surface.components.set(component.id, component);
    }
    this.rebuildComponentTree(surface);
  }
  handleDataModelUpdate(message, surfaceId) {
    var _a7;
    const surface = this.getOrCreateSurface(surfaceId);
    const path = (_a7 = message.path) != null ? _a7 : "/";
    this.setDataByPath(surface.dataModel, path, message.contents);
    this.rebuildComponentTree(surface);
  }
  handleDeleteSurface(message) {
    this.surfaces.delete(message.surfaceId);
  }
  /**
   * Starts at the root component of the surface and builds out the tree
   * recursively. This process involves resolving all properties of the child
   * components, and expanding on any explicit children lists or templates
   * found in the structure.
   *
   * @param surface The surface to be built.
   */
  rebuildComponentTree(surface) {
    if (!surface.rootComponentId) {
      surface.componentTree = null;
      return;
    }
    const visited = new this.setCtor();
    surface.componentTree = this.buildNodeRecursive(surface.rootComponentId, surface, visited, "/", "");
  }
  /** Finds a value key in a map. */
  findValueKey(value) {
    return Object.keys(value || {}).find((k2) => k2.startsWith("value"));
  }
  /**
   * Builds out the nodes recursively.
   */
  buildNodeRecursive(baseComponentId, surface, visited, dataContextPath, idSuffix = "") {
    var _a7, _b2;
    const fullId = `${baseComponentId}${idSuffix}`;
    const { components } = surface;
    if (!components.has(baseComponentId)) {
      return null;
    }
    if (visited.has(fullId)) {
      throw new A2uiStateError(`Circular dependency for component "${fullId}".`);
    }
    visited.add(fullId);
    const componentData = components.get(baseComponentId);
    const componentProps = (_a7 = componentData.component) != null ? _a7 : {};
    const componentType = Object.keys(componentProps || {})[0];
    const unresolvedProperties = componentProps[componentType];
    const resolvedProperties = new this.objCtor();
    if (isObject(unresolvedProperties)) {
      for (const [key, value] of Object.entries(unresolvedProperties || {})) {
        resolvedProperties[key] = this.resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix, key);
      }
    }
    visited.delete(fullId);
    const baseNode = {
      id: fullId,
      dataContextPath,
      weight: (_b2 = componentData.weight) != null ? _b2 : "initial"
    };
    switch (componentType) {
      case "Text":
        if (!isResolvedText(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Text",
          properties: resolvedProperties
        });
      case "Image":
        if (!isResolvedImage(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Image",
          properties: resolvedProperties
        });
      case "Icon":
        if (!isResolvedIcon(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Icon",
          properties: resolvedProperties
        });
      case "Video":
        if (!isResolvedVideo(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Video",
          properties: resolvedProperties
        });
      case "AudioPlayer":
        if (!isResolvedAudioPlayer(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "AudioPlayer",
          properties: resolvedProperties
        });
      case "Row":
        if (!isResolvedRow(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Row",
          properties: resolvedProperties
        });
      case "Column":
        if (!isResolvedColumn(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Column",
          properties: resolvedProperties
        });
      case "List":
        if (!isResolvedList(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "List",
          properties: resolvedProperties
        });
      case "Card":
        if (!isResolvedCard(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Card",
          properties: resolvedProperties
        });
      case "Tabs":
        if (!isResolvedTabs(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Tabs",
          properties: resolvedProperties
        });
      case "Divider":
        if (!isResolvedDivider(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Divider",
          properties: resolvedProperties
        });
      case "Modal":
        if (!isResolvedModal(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Modal",
          properties: resolvedProperties
        });
      case "Button":
        if (!isResolvedButton(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Button",
          properties: resolvedProperties
        });
      case "CheckBox":
        if (!isResolvedCheckbox(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "CheckBox",
          properties: resolvedProperties
        });
      case "TextField":
        if (!isResolvedTextField(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "TextField",
          properties: resolvedProperties
        });
      case "DateTimeInput":
        if (!isResolvedDateTimeInput(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "DateTimeInput",
          properties: resolvedProperties
        });
      case "MultipleChoice":
        if (!isResolvedMultipleChoice(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "MultipleChoice",
          properties: resolvedProperties
        });
      case "Slider":
        if (!isResolvedSlider(resolvedProperties)) {
          throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
        }
        return new this.objCtor({
          ...baseNode,
          type: "Slider",
          properties: resolvedProperties
        });
      default:
        return new this.objCtor({
          ...baseNode,
          type: componentType,
          properties: resolvedProperties
        });
    }
  }
  /**
   * Recursively resolves an individual property value. If a property indicates
   * a child node (a string that matches a component ID), an explicitList of
   * children, or a template, these will be built out here.
   */
  resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix = "", propertyKey) {
    if (typeof value === "string" && surface.components.has(value) && __a2uiShouldResolveChildString(propertyKey)) {
      return this.buildNodeRecursive(value, surface, visited, dataContextPath, idSuffix);
    }
    if (isComponentArrayReference(value)) {
      if (value.explicitList) {
        return value.explicitList.map((id) => this.buildNodeRecursive(id, surface, visited, dataContextPath, idSuffix));
      }
      if (value.template) {
        const fullDataPath = this.resolvePath(value.template.dataBinding, dataContextPath);
        const data = this.getDataByPath(surface.dataModel, fullDataPath);
        const template = value.template;
        if (Array.isArray(data)) {
          return data.map((_2, index) => {
            const parentIndices = dataContextPath.split("/").filter((segment) => /^\d+$/.test(segment));
            const newIndices = [...parentIndices, index];
            const newSuffix = `:${newIndices.join(":")}`;
            const childDataContextPath = `${fullDataPath}/${index}`;
            return this.buildNodeRecursive(
              template.componentId,
              // baseId
              surface,
              visited,
              childDataContextPath,
              newSuffix
            );
          });
        }
        const mapCtor = this.mapCtor;
        if (data instanceof mapCtor) {
          return Array.from(data.keys(), (key) => {
            const newSuffix = `:${key}`;
            const childDataContextPath = `${fullDataPath}/${key}`;
            return this.buildNodeRecursive(
              template.componentId,
              // baseId
              surface,
              visited,
              childDataContextPath,
              newSuffix
            );
          });
        }
        return new this.arrayCtor();
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.resolvePropertyValue(item, surface, visited, dataContextPath, idSuffix, propertyKey));
    }
    if (isObject(value)) {
      const newObj = new this.objCtor();
      for (const [key, propValue] of Object.entries(value || {})) {
        let propertyValue = propValue;
        if (isPath(key, propValue) && dataContextPath !== "/") {
          propertyValue = propValue.replace(/^\.?\/item/, "").replace(/^\.?\/text/, "").replace(/^\.?\/label/, "").replace(/^\.?\//, "");
          newObj[key] = propertyValue;
          continue;
        }
        newObj[key] = this.resolvePropertyValue(propertyValue, surface, visited, dataContextPath, idSuffix, key);
      }
      return newObj;
    }
    return value;
  }
};
_A2uiMessageProcessor.DEFAULT_SURFACE_ID = "@default";
var A2uiMessageProcessor = _A2uiMessageProcessor;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/index.js
var styles_exports = {};
__export(styles_exports, {
  appendToAll: () => appendToAll,
  createThemeStyles: () => createThemeStyles,
  merge: () => merge,
  structuralStyles: () => structuralStyles,
  toProp: () => toProp
});

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/behavior.js
var opacityBehavior = `
  &:not([disabled]) {
    cursor: pointer;
    opacity: var(--opacity, 0);
    transition: opacity var(--speed, 0.2s) cubic-bezier(0, 0, 0.3, 1);

    &:hover,
    &:focus {
      opacity: 1;
    }
  }`;
var behavior = `
  ${new Array(21).fill(0).map((_2, idx) => {
  return `.behavior-ho-${idx * 5} {
          --opacity: ${idx / 20};
          ${opacityBehavior}
        }`;
}).join("\n")}

  .behavior-o-s {
    overflow: scroll;
  }

  .behavior-o-a {
    overflow: auto;
  }

  .behavior-o-h {
    overflow: hidden;
  }

  .behavior-sw-n {
    scrollbar-width: none;
  }
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/shared.js
var grid = 4;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/border.js
var border = `
  ${new Array(25).fill(0).map((_2, idx) => {
  return `
        .border-bw-${idx} { border-width: ${idx}px; }
        .border-btw-${idx} { border-top-width: ${idx}px; }
        .border-bbw-${idx} { border-bottom-width: ${idx}px; }
        .border-blw-${idx} { border-left-width: ${idx}px; }
        .border-brw-${idx} { border-right-width: ${idx}px; }

        .border-ow-${idx} { outline-width: ${idx}px; }
        .border-br-${idx} { border-radius: ${idx * grid}px; overflow: hidden;}`;
}).join("\n")}

  .border-br-50pc {
    border-radius: 50%;
  }

  .border-bs-s {
    border-style: solid;
  }
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/types/colors.js
var shades = [
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  50,
  60,
  70,
  80,
  90,
  95,
  98,
  99,
  100
];

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/utils.js
function merge(...classes) {
  const styles = {};
  for (const clazz of classes) {
    for (const [key, val] of Object.entries(clazz || {})) {
      const prefix = key.split("-").with(-1, "").join("-");
      const existingKeys = Object.keys(styles || {}).filter((key2) => key2.startsWith(prefix));
      for (const existingKey of existingKeys) {
        delete styles[existingKey];
      }
      styles[key] = val;
    }
  }
  return styles;
}
function appendToAll(target, exclusions, ...classes) {
  const updatedTarget = structuredClone(target);
  for (const clazz of classes) {
    for (const key of Object.keys(clazz || {})) {
      const prefix = key.split("-").with(-1, "").join("-");
      for (const [tagName, classesToAdd] of Object.entries(updatedTarget || {})) {
        if (exclusions.includes(tagName)) {
          continue;
        }
        let found = false;
        for (let t7 = 0; t7 < classesToAdd.length; t7++) {
          if (classesToAdd[t7].startsWith(prefix)) {
            found = true;
            classesToAdd[t7] = key;
          }
        }
        if (!found) {
          classesToAdd.push(key);
        }
      }
    }
  }
  return updatedTarget;
}
function createThemeStyles(palettes) {
  const styles = {};
  for (const palette of Object.values(palettes || {})) {
    for (const [key, val] of Object.entries(palette || {})) {
      const prop = toProp(key);
      styles[prop] = val;
    }
  }
  return styles;
}
function toProp(key) {
  if (key.startsWith("nv")) {
    return `--nv-${key.slice(2)}`;
  }
  return `--${key[0]}-${key.slice(1)}`;
}

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/colors.js
var color = (src) => `
    ${src.map((key) => {
  const inverseKey = getInverseKey(key);
  return `.color-bc-${key} { border-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`;
}).join("\n")}

    ${src.map((key) => {
  const inverseKey = getInverseKey(key);
  const vals = [
    `.color-bgc-${key} { background-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`,
    `.color-bbgc-${key}::backdrop { background-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`
  ];
  for (let o13 = 0.1; o13 < 1; o13 += 0.1) {
    vals.push(`.color-bbgc-${key}_${(o13 * 100).toFixed(0)}::backdrop {
            background-color: light-dark(oklch(from var(${toProp(key)}) l c h / calc(alpha * ${o13.toFixed(1)})), oklch(from var(${toProp(inverseKey)}) l c h / calc(alpha * ${o13.toFixed(1)})) );
          }
        `);
  }
  return vals.join("\n");
}).join("\n")}

  ${src.map((key) => {
  const inverseKey = getInverseKey(key);
  return `.color-c-${key} { color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`;
}).join("\n")}
  `;
var getInverseKey = (key) => {
  const match2 = key.match(/^([a-z]+)(\d+)$/);
  if (!match2)
    return key;
  const [, prefix, shadeStr] = match2;
  const shade = parseInt(shadeStr, 10);
  const target = 100 - shade;
  const inverseShade = shades.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
  return `${prefix}${inverseShade}`;
};
var keyFactory = (prefix) => {
  return shades.map((v3) => `${prefix}${v3}`);
};
var colors = [
  color(keyFactory("p")),
  color(keyFactory("s")),
  color(keyFactory("t")),
  color(keyFactory("n")),
  color(keyFactory("nv")),
  color(keyFactory("e")),
  `
    .color-bgc-transparent {
      background-color: transparent;
    }

    :host {
      color-scheme: var(--color-scheme);
    }
  `
];

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/icons.js
var icons = `
  .g-icon {
    font-family: "Material Symbols Outlined", "Google Symbols";
    font-weight: normal;
    font-style: normal;
    font-display: optional;
    font-size: 24px;
    width: 1em;
    height: 1em;
    user-select: none;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: "liga";
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;

    font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 48,
      "ROND" 100;

    &.filled {
      font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 48,
        "ROND" 100;
    }

    &.filled-heavy {
      font-variation-settings: "FILL" 1, "wght" 700, "GRAD" 0, "opsz" 48,
        "ROND" 100;
    }
  }
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/layout.js
var layout = `
  :host {
    ${new Array(16).fill(0).map((_2, idx) => {
  return `--g-${idx + 1}: ${(idx + 1) * grid}px;`;
}).join("\n")}
  }

  ${new Array(49).fill(0).map((_2, index) => {
  const idx = index - 24;
  const lbl = idx < 0 ? `n${Math.abs(idx)}` : idx.toString();
  return `
        .layout-p-${lbl} { --padding: ${idx * grid}px; padding: var(--padding); }
        .layout-pt-${lbl} { padding-top: ${idx * grid}px; }
        .layout-pr-${lbl} { padding-right: ${idx * grid}px; }
        .layout-pb-${lbl} { padding-bottom: ${idx * grid}px; }
        .layout-pl-${lbl} { padding-left: ${idx * grid}px; }

        .layout-m-${lbl} { --margin: ${idx * grid}px; margin: var(--margin); }
        .layout-mt-${lbl} { margin-top: ${idx * grid}px; }
        .layout-mr-${lbl} { margin-right: ${idx * grid}px; }
        .layout-mb-${lbl} { margin-bottom: ${idx * grid}px; }
        .layout-ml-${lbl} { margin-left: ${idx * grid}px; }

        .layout-t-${lbl} { top: ${idx * grid}px; }
        .layout-r-${lbl} { right: ${idx * grid}px; }
        .layout-b-${lbl} { bottom: ${idx * grid}px; }
        .layout-l-${lbl} { left: ${idx * grid}px; }`;
}).join("\n")}

  ${new Array(25).fill(0).map((_2, idx) => {
  return `
        .layout-g-${idx} { gap: ${idx * grid}px; }`;
}).join("\n")}

  ${new Array(8).fill(0).map((_2, idx) => {
  return `
        .layout-grd-col${idx + 1} { grid-template-columns: ${"1fr ".repeat(idx + 1).trim()}; }`;
}).join("\n")}

  .layout-pos-a {
    position: absolute;
  }

  .layout-pos-rel {
    position: relative;
  }

  .layout-dsp-none {
    display: none;
  }

  .layout-dsp-block {
    display: block;
  }

  .layout-dsp-grid {
    display: grid;
  }

  .layout-dsp-iflex {
    display: inline-flex;
  }

  .layout-dsp-flexvert {
    display: flex;
    flex-direction: column;
  }

  .layout-dsp-flexhor {
    display: flex;
    flex-direction: row;
  }

  .layout-fw-w {
    flex-wrap: wrap;
  }

  .layout-al-fs {
    align-items: start;
  }

  .layout-al-fe {
    align-items: end;
  }

  .layout-al-c {
    align-items: center;
  }

  .layout-as-n {
    align-self: normal;
  }

  .layout-js-c {
    justify-self: center;
  }

  .layout-sp-c {
    justify-content: center;
  }

  .layout-sp-ev {
    justify-content: space-evenly;
  }

  .layout-sp-bt {
    justify-content: space-between;
  }

  .layout-sp-s {
    justify-content: start;
  }

  .layout-sp-e {
    justify-content: end;
  }

  .layout-ji-e {
    justify-items: end;
  }

  .layout-r-none {
    resize: none;
  }

  .layout-fs-c {
    field-sizing: content;
  }

  .layout-fs-n {
    field-sizing: none;
  }

  .layout-flx-0 {
    flex: 0 0 auto;
  }

  .layout-flx-1 {
    flex: 1 0 auto;
  }

  .layout-c-s {
    contain: strict;
  }

  /** Widths **/

  ${new Array(10).fill(0).map((_2, idx) => {
  const weight = (idx + 1) * 10;
  return `.layout-w-${weight} { width: ${weight}%; max-width: ${weight}%; }`;
}).join("\n")}

  ${new Array(16).fill(0).map((_2, idx) => {
  const weight = idx * grid;
  return `.layout-wp-${idx} { width: ${weight}px; }`;
}).join("\n")}

  /** Heights **/

  ${new Array(10).fill(0).map((_2, idx) => {
  const height = (idx + 1) * 10;
  return `.layout-h-${height} { height: ${height}%; }`;
}).join("\n")}

  ${new Array(16).fill(0).map((_2, idx) => {
  const height = idx * grid;
  return `.layout-hp-${idx} { height: ${height}px; }`;
}).join("\n")}

  .layout-el-cv {
    & img,
    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin: 0;
    }
  }

  .layout-ar-sq {
    aspect-ratio: 1 / 1;
  }

  .layout-ex-fb {
    margin: calc(var(--padding) * -1) 0 0 calc(var(--padding) * -1);
    width: calc(100% + var(--padding) * 2);
    height: calc(100% + var(--padding) * 2);
  }
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/opacity.js
var opacity = `
  ${new Array(21).fill(0).map((_2, idx) => {
  return `.opacity-el-${idx * 5} { opacity: ${idx / 20}; }`;
}).join("\n")}
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/type.js
var type = `
  :host {
    --default-font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    --default-font-family-mono: "Courier New", Courier, monospace;
  }

  .typography-f-s {
    font-family: var(--font-family, var(--default-font-family));
    font-optical-sizing: auto;
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0;
  }

  .typography-f-sf {
    font-family: var(--font-family-flex, var(--default-font-family));
    font-optical-sizing: auto;
  }

  .typography-f-c {
    font-family: var(--font-family-mono, var(--default-font-family));
    font-optical-sizing: auto;
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0;
  }

  .typography-v-r {
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0, "ROND" 100;
  }

  .typography-ta-s {
    text-align: start;
  }

  .typography-ta-c {
    text-align: center;
  }

  .typography-fs-n {
    font-style: normal;
  }

  .typography-fs-i {
    font-style: italic;
  }

  .typography-sz-ls {
    font-size: 11px;
    line-height: 16px;
  }

  .typography-sz-lm {
    font-size: 12px;
    line-height: 16px;
  }

  .typography-sz-ll {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-bs {
    font-size: 12px;
    line-height: 16px;
  }

  .typography-sz-bm {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-bl {
    font-size: 16px;
    line-height: 24px;
  }

  .typography-sz-ts {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-tm {
    font-size: 16px;
    line-height: 24px;
  }

  .typography-sz-tl {
    font-size: 22px;
    line-height: 28px;
  }

  .typography-sz-hs {
    font-size: 24px;
    line-height: 32px;
  }

  .typography-sz-hm {
    font-size: 28px;
    line-height: 36px;
  }

  .typography-sz-hl {
    font-size: 32px;
    line-height: 40px;
  }

  .typography-sz-ds {
    font-size: 36px;
    line-height: 44px;
  }

  .typography-sz-dm {
    font-size: 45px;
    line-height: 52px;
  }

  .typography-sz-dl {
    font-size: 57px;
    line-height: 64px;
  }

  .typography-ws-p {
    white-space: pre-line;
  }

  .typography-ws-nw {
    white-space: nowrap;
  }

  .typography-td-none {
    text-decoration: none;
  }

  /** Weights **/

  ${new Array(9).fill(0).map((_2, idx) => {
  const weight = (idx + 1) * 100;
  return `.typography-w-${weight} { font-weight: ${weight}; }`;
}).join("\n")}
`;

// ../../node_modules/@a2ui/web_core/src/v0_8/styles/index.js
var structuralStyles = [
  behavior,
  border,
  colors,
  icons,
  layout,
  opacity,
  type
].flat(Infinity).join("\n");

// ../../node_modules/signal-polyfill/dist/index.js
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateIn2 = (member, obj) => {
  if (Object(obj) !== obj)
    throw TypeError('Cannot use the "in" operator on this value');
  return member.has(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod2 = (obj, member, method) => {
  __accessCheck2(obj, member, "access private method");
  return method;
};
function defaultEquals(a4, b3) {
  return Object.is(a4, b3);
}
var activeConsumer = null;
var inNotificationPhase = false;
var epoch = 1;
var SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
function setActiveConsumer(consumer) {
  const prev = activeConsumer;
  activeConsumer = consumer;
  return prev;
}
function getActiveConsumer() {
  return activeConsumer;
}
function isInNotificationPhase() {
  return inNotificationPhase;
}
var REACTIVE_NODE = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: false,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: false,
  consumerIsAlwaysLive: false,
  producerMustRecompute: () => false,
  producerRecomputeValue: () => {
  },
  consumerMarkedDirty: () => {
  },
  consumerOnSignalRead: () => {
  }
};
function producerAccessed(node) {
  if (inNotificationPhase) {
    throw new Error(
      typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : ""
    );
  }
  if (activeConsumer === null) {
    return;
  }
  activeConsumer.consumerOnSignalRead(node);
  const idx = activeConsumer.nextProducerIndex++;
  assertConsumerNode(activeConsumer);
  if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
    if (consumerIsLive(activeConsumer)) {
      const staleProducer = activeConsumer.producerNode[idx];
      producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
    }
  }
  if (activeConsumer.producerNode[idx] !== node) {
    activeConsumer.producerNode[idx] = node;
    activeConsumer.producerIndexOfThis[idx] = consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
  }
  activeConsumer.producerLastReadVersion[idx] = node.version;
}
function producerIncrementEpoch() {
  epoch++;
}
function producerUpdateValueVersion(node) {
  if (!node.dirty && node.lastCleanEpoch === epoch) {
    return;
  }
  if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
    node.dirty = false;
    node.lastCleanEpoch = epoch;
    return;
  }
  node.producerRecomputeValue(node);
  node.dirty = false;
  node.lastCleanEpoch = epoch;
}
function producerNotifyConsumers(node) {
  if (node.liveConsumerNode === void 0) {
    return;
  }
  const prev = inNotificationPhase;
  inNotificationPhase = true;
  try {
    for (const consumer of node.liveConsumerNode) {
      if (!consumer.dirty) {
        consumerMarkDirty(consumer);
      }
    }
  } finally {
    inNotificationPhase = prev;
  }
}
function producerUpdatesAllowed() {
  return (activeConsumer == null ? void 0 : activeConsumer.consumerAllowSignalWrites) !== false;
}
function consumerMarkDirty(node) {
  var _a8;
  var _a7;
  node.dirty = true;
  producerNotifyConsumers(node);
  (_a7 = node.consumerMarkedDirty) == null ? void 0 : _a7.call((_a8 = node.wrapper) != null ? _a8 : node);
}
function consumerBeforeComputation(node) {
  node && (node.nextProducerIndex = 0);
  return setActiveConsumer(node);
}
function consumerAfterComputation(node, prevConsumer) {
  setActiveConsumer(prevConsumer);
  if (!node || node.producerNode === void 0 || node.producerIndexOfThis === void 0 || node.producerLastReadVersion === void 0) {
    return;
  }
  if (consumerIsLive(node)) {
    for (let i11 = node.nextProducerIndex; i11 < node.producerNode.length; i11++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i11], node.producerIndexOfThis[i11]);
    }
  }
  while (node.producerNode.length > node.nextProducerIndex) {
    node.producerNode.pop();
    node.producerLastReadVersion.pop();
    node.producerIndexOfThis.pop();
  }
}
function consumerPollProducersForChange(node) {
  assertConsumerNode(node);
  for (let i11 = 0; i11 < node.producerNode.length; i11++) {
    const producer = node.producerNode[i11];
    const seenVersion = node.producerLastReadVersion[i11];
    if (seenVersion !== producer.version) {
      return true;
    }
    producerUpdateValueVersion(producer);
    if (seenVersion !== producer.version) {
      return true;
    }
  }
  return false;
}
function producerAddLiveConsumer(node, consumer, indexOfThis) {
  var _a7;
  assertProducerNode(node);
  assertConsumerNode(node);
  if (node.liveConsumerNode.length === 0) {
    (_a7 = node.watched) == null ? void 0 : _a7.call(node.wrapper);
    for (let i11 = 0; i11 < node.producerNode.length; i11++) {
      node.producerIndexOfThis[i11] = producerAddLiveConsumer(node.producerNode[i11], node, i11);
    }
  }
  node.liveConsumerIndexOfThis.push(indexOfThis);
  return node.liveConsumerNode.push(consumer) - 1;
}
function producerRemoveLiveConsumerAtIndex(node, idx) {
  var _a7;
  assertProducerNode(node);
  assertConsumerNode(node);
  if (typeof ngDevMode !== "undefined" && ngDevMode && idx >= node.liveConsumerNode.length) {
    throw new Error(
      `Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`
    );
  }
  if (node.liveConsumerNode.length === 1) {
    (_a7 = node.unwatched) == null ? void 0 : _a7.call(node.wrapper);
    for (let i11 = 0; i11 < node.producerNode.length; i11++) {
      producerRemoveLiveConsumerAtIndex(node.producerNode[i11], node.producerIndexOfThis[i11]);
    }
  }
  const lastIdx = node.liveConsumerNode.length - 1;
  node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
  node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
  node.liveConsumerNode.length--;
  node.liveConsumerIndexOfThis.length--;
  if (idx < node.liveConsumerNode.length) {
    const idxProducer = node.liveConsumerIndexOfThis[idx];
    const consumer = node.liveConsumerNode[idx];
    assertConsumerNode(consumer);
    consumer.producerIndexOfThis[idxProducer] = idx;
  }
}
function consumerIsLive(node) {
  var _a8;
  var _a7;
  return node.consumerIsAlwaysLive || ((_a8 = (_a7 = node == null ? void 0 : node.liveConsumerNode) == null ? void 0 : _a7.length) != null ? _a8 : 0) > 0;
}
function assertConsumerNode(node) {
  var _a7, _b2, _c;
  (_a7 = node.producerNode) != null ? _a7 : node.producerNode = [];
  (_b2 = node.producerIndexOfThis) != null ? _b2 : node.producerIndexOfThis = [];
  (_c = node.producerLastReadVersion) != null ? _c : node.producerLastReadVersion = [];
}
function assertProducerNode(node) {
  var _a7, _b2;
  (_a7 = node.liveConsumerNode) != null ? _a7 : node.liveConsumerNode = [];
  (_b2 = node.liveConsumerIndexOfThis) != null ? _b2 : node.liveConsumerIndexOfThis = [];
}
function computedGet(node) {
  producerUpdateValueVersion(node);
  producerAccessed(node);
  if (node.value === ERRORED) {
    throw node.error;
  }
  return node.value;
}
function createComputed(computation) {
  const node = Object.create(COMPUTED_NODE);
  node.computation = computation;
  const computed = () => computedGet(node);
  computed[SIGNAL] = node;
  return computed;
}
var UNSET = /* @__PURE__ */ Symbol("UNSET");
var COMPUTING = /* @__PURE__ */ Symbol("COMPUTING");
var ERRORED = /* @__PURE__ */ Symbol("ERRORED");
var COMPUTED_NODE = /* @__PURE__ */ (() => {
  return {
    ...REACTIVE_NODE,
    value: UNSET,
    dirty: true,
    error: null,
    equal: defaultEquals,
    producerMustRecompute(node) {
      return node.value === UNSET || node.value === COMPUTING;
    },
    producerRecomputeValue(node) {
      if (node.value === COMPUTING) {
        throw new Error("Detected cycle in computations.");
      }
      const oldValue = node.value;
      node.value = COMPUTING;
      const prevConsumer = consumerBeforeComputation(node);
      let newValue;
      let wasEqual = false;
      try {
        newValue = node.computation.call(node.wrapper);
        const oldOk = oldValue !== UNSET && oldValue !== ERRORED;
        wasEqual = oldOk && node.equal.call(node.wrapper, oldValue, newValue);
      } catch (err) {
        newValue = ERRORED;
        node.error = err;
      } finally {
        consumerAfterComputation(node, prevConsumer);
      }
      if (wasEqual) {
        node.value = oldValue;
        return;
      }
      node.value = newValue;
      node.version++;
    }
  };
})();
function defaultThrowError() {
  throw new Error();
}
var throwInvalidWriteToSignalErrorFn = defaultThrowError;
function throwInvalidWriteToSignalError() {
  throwInvalidWriteToSignalErrorFn();
}
function createSignal(initialValue) {
  const node = Object.create(SIGNAL_NODE);
  node.value = initialValue;
  const getter = () => {
    producerAccessed(node);
    return node.value;
  };
  getter[SIGNAL] = node;
  return getter;
}
function signalGetFn() {
  producerAccessed(this);
  return this.value;
}
function signalSetFn(node, newValue) {
  if (!producerUpdatesAllowed()) {
    throwInvalidWriteToSignalError();
  }
  if (!node.equal.call(node.wrapper, node.value, newValue)) {
    node.value = newValue;
    signalValueChanged(node);
  }
}
var SIGNAL_NODE = /* @__PURE__ */ (() => {
  return {
    ...REACTIVE_NODE,
    equal: defaultEquals,
    value: void 0
  };
})();
function signalValueChanged(node) {
  node.version++;
  producerIncrementEpoch();
  producerNotifyConsumers(node);
}
var NODE = /* @__PURE__ */ Symbol("node");
var Signal;
((Signal2) => {
  var _a7, _brand, brand_fn, _b2, _brand2, brand_fn2;
  class State {
    constructor(initialValue, options = {}) {
      __privateAdd2(this, _brand);
      __publicField2(this, _a7);
      const ref = createSignal(initialValue);
      const node = ref[SIGNAL];
      this[NODE] = node;
      node.wrapper = this;
      if (options) {
        const equals = options.equals;
        if (equals) {
          node.equal = equals;
        }
        node.watched = options[Signal2.subtle.watched];
        node.unwatched = options[Signal2.subtle.unwatched];
      }
    }
    get() {
      if (!(0, Signal2.isState)(this))
        throw new TypeError("Wrong receiver type for Signal.State.prototype.get");
      return signalGetFn.call(this[NODE]);
    }
    set(newValue) {
      if (!(0, Signal2.isState)(this))
        throw new TypeError("Wrong receiver type for Signal.State.prototype.set");
      if (isInNotificationPhase()) {
        throw new Error("Writes to signals not permitted during Watcher callback");
      }
      const ref = this[NODE];
      signalSetFn(ref, newValue);
    }
  }
  _a7 = NODE;
  _brand = /* @__PURE__ */ new WeakSet();
  brand_fn = function() {
  };
  Signal2.isState = (s11) => typeof s11 === "object" && __privateIn2(_brand, s11);
  Signal2.State = State;
  class Computed {
    // Create a Signal which evaluates to the value returned by the callback.
    // Callback is called with this signal as the parameter.
    constructor(computation, options) {
      __privateAdd2(this, _brand2);
      __publicField2(this, _b2);
      const ref = createComputed(computation);
      const node = ref[SIGNAL];
      node.consumerAllowSignalWrites = true;
      this[NODE] = node;
      node.wrapper = this;
      if (options) {
        const equals = options.equals;
        if (equals) {
          node.equal = equals;
        }
        node.watched = options[Signal2.subtle.watched];
        node.unwatched = options[Signal2.subtle.unwatched];
      }
    }
    get() {
      if (!(0, Signal2.isComputed)(this))
        throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");
      return computedGet(this[NODE]);
    }
  }
  _b2 = NODE;
  _brand2 = /* @__PURE__ */ new WeakSet();
  brand_fn2 = function() {
  };
  Signal2.isComputed = (c8) => typeof c8 === "object" && __privateIn2(_brand2, c8);
  Signal2.Computed = Computed;
  ((subtle2) => {
    var _a22, _brand3, brand_fn3, _assertSignals, assertSignals_fn;
    function untrack(cb) {
      let output;
      let prevActiveConsumer = null;
      try {
        prevActiveConsumer = setActiveConsumer(null);
        output = cb();
      } finally {
        setActiveConsumer(prevActiveConsumer);
      }
      return output;
    }
    subtle2.untrack = untrack;
    function introspectSources(sink) {
      var _a8;
      var _a32;
      if (!(0, Signal2.isComputed)(sink) && !(0, Signal2.isWatcher)(sink)) {
        throw new TypeError("Called introspectSources without a Computed or Watcher argument");
      }
      return (_a8 = (_a32 = sink[NODE].producerNode) == null ? void 0 : _a32.map((n11) => n11.wrapper)) != null ? _a8 : [];
    }
    subtle2.introspectSources = introspectSources;
    function introspectSinks(signal) {
      var _a8;
      var _a32;
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
        throw new TypeError("Called introspectSinks without a Signal argument");
      }
      return (_a8 = (_a32 = signal[NODE].liveConsumerNode) == null ? void 0 : _a32.map((n11) => n11.wrapper)) != null ? _a8 : [];
    }
    subtle2.introspectSinks = introspectSinks;
    function hasSinks(signal) {
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
        throw new TypeError("Called hasSinks without a Signal argument");
      }
      const liveConsumerNode = signal[NODE].liveConsumerNode;
      if (!liveConsumerNode)
        return false;
      return liveConsumerNode.length > 0;
    }
    subtle2.hasSinks = hasSinks;
    function hasSources(signal) {
      if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isWatcher)(signal)) {
        throw new TypeError("Called hasSources without a Computed or Watcher argument");
      }
      const producerNode = signal[NODE].producerNode;
      if (!producerNode)
        return false;
      return producerNode.length > 0;
    }
    subtle2.hasSources = hasSources;
    class Watcher {
      // When a (recursive) source of Watcher is written to, call this callback,
      // if it hasn't already been called since the last `watch` call.
      // No signals may be read or written during the notify.
      constructor(notify) {
        __privateAdd2(this, _brand3);
        __privateAdd2(this, _assertSignals);
        __publicField2(this, _a22);
        let node = Object.create(REACTIVE_NODE);
        node.wrapper = this;
        node.consumerMarkedDirty = notify;
        node.consumerIsAlwaysLive = true;
        node.consumerAllowSignalWrites = false;
        node.producerNode = [];
        this[NODE] = node;
      }
      // Add these signals to the Watcher's set, and set the watcher to run its
      // notify callback next time any signal in the set (or one of its dependencies) changes.
      // Can be called with no arguments just to reset the "notified" state, so that
      // the notify callback will be invoked again.
      watch(...signals) {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called unwatch without Watcher receiver");
        }
        __privateMethod2(this, _assertSignals, assertSignals_fn).call(this, signals);
        const node = this[NODE];
        node.dirty = false;
        const prev = setActiveConsumer(node);
        for (const signal of signals) {
          producerAccessed(signal[NODE]);
        }
        setActiveConsumer(prev);
      }
      // Remove these signals from the watched set (e.g., for an effect which is disposed)
      unwatch(...signals) {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called unwatch without Watcher receiver");
        }
        __privateMethod2(this, _assertSignals, assertSignals_fn).call(this, signals);
        const node = this[NODE];
        assertConsumerNode(node);
        for (let i11 = node.producerNode.length - 1; i11 >= 0; i11--) {
          if (signals.includes(node.producerNode[i11].wrapper)) {
            producerRemoveLiveConsumerAtIndex(node.producerNode[i11], node.producerIndexOfThis[i11]);
            const lastIdx = node.producerNode.length - 1;
            node.producerNode[i11] = node.producerNode[lastIdx];
            node.producerIndexOfThis[i11] = node.producerIndexOfThis[lastIdx];
            node.producerNode.length--;
            node.producerIndexOfThis.length--;
            node.nextProducerIndex--;
            if (i11 < node.producerNode.length) {
              const idxConsumer = node.producerIndexOfThis[i11];
              const producer = node.producerNode[i11];
              assertProducerNode(producer);
              producer.liveConsumerIndexOfThis[idxConsumer] = i11;
            }
          }
        }
      }
      // Returns the set of computeds in the Watcher's set which are still yet
      // to be re-evaluated
      getPending() {
        if (!(0, Signal2.isWatcher)(this)) {
          throw new TypeError("Called getPending without Watcher receiver");
        }
        const node = this[NODE];
        return node.producerNode.filter((n11) => n11.dirty).map((n11) => n11.wrapper);
      }
    }
    _a22 = NODE;
    _brand3 = /* @__PURE__ */ new WeakSet();
    brand_fn3 = function() {
    };
    _assertSignals = /* @__PURE__ */ new WeakSet();
    assertSignals_fn = function(signals) {
      for (const signal of signals) {
        if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) {
          throw new TypeError("Called watch/unwatch without a Computed or State argument");
        }
      }
    };
    Signal2.isWatcher = (w2) => __privateIn2(_brand3, w2);
    subtle2.Watcher = Watcher;
    function currentComputed() {
      var _a32;
      return (_a32 = getActiveConsumer()) == null ? void 0 : _a32.wrapper;
    }
    subtle2.currentComputed = currentComputed;
    subtle2.watched = /* @__PURE__ */ Symbol("watched");
    subtle2.unwatched = /* @__PURE__ */ Symbol("unwatched");
  })(Signal2.subtle || (Signal2.subtle = {}));
})(Signal || (Signal = {}));

// ../../node_modules/signal-utils/dist/-private/util.ts.js
var createStorage = (initial = null) => new Signal.State(initial, {
  equals: () => false
});

// ../../node_modules/signal-utils/dist/array.ts.js
var ARRAY_GETTER_METHODS = /* @__PURE__ */ new Set([Symbol.iterator, "concat", "entries", "every", "filter", "find", "findIndex", "flat", "flatMap", "forEach", "includes", "indexOf", "join", "keys", "lastIndexOf", "map", "reduce", "reduceRight", "slice", "some", "values"]);
var ARRAY_WRITE_THEN_READ_METHODS = /* @__PURE__ */ new Set(["fill", "push", "unshift"]);
function convertToInt(prop) {
  if (typeof prop === "symbol") return null;
  const num = Number(prop);
  if (isNaN(num)) return null;
  return num % 1 === 0 ? num : null;
}
var _collection, _storages, _SignalArray_instances, readStorageFor_fn, dirtyStorageFor_fn;
var _SignalArray = class _SignalArray {
  constructor(arr = []) {
    __privateAdd(this, _SignalArray_instances);
    __privateAdd(this, _collection, createStorage());
    __privateAdd(this, _storages, /* @__PURE__ */ new Map());
    let clone2 = arr.slice();
    let self = this;
    let boundFns = /* @__PURE__ */ new Map();
    let nativelyAccessingLengthFromPushOrUnshift = false;
    return new Proxy(clone2, {
      get(target, prop) {
        var _a7;
        let index = convertToInt(prop);
        if (index !== null) {
          __privateMethod(_a7 = self, _SignalArray_instances, readStorageFor_fn).call(_a7, index);
          __privateGet(self, _collection).get();
          return target[index];
        }
        if (prop === "length") {
          if (nativelyAccessingLengthFromPushOrUnshift) {
            nativelyAccessingLengthFromPushOrUnshift = false;
          } else {
            __privateGet(self, _collection).get();
          }
          return target[prop];
        }
        if (ARRAY_WRITE_THEN_READ_METHODS.has(prop)) {
          nativelyAccessingLengthFromPushOrUnshift = true;
        }
        if (ARRAY_GETTER_METHODS.has(prop)) {
          let fn = boundFns.get(prop);
          if (fn === void 0) {
            fn = (...args) => {
              __privateGet(self, _collection).get();
              return target[prop](...args);
            };
            boundFns.set(prop, fn);
          }
          return fn;
        }
        return target[prop];
      },
      set(target, prop, value) {
        var _a7;
        target[prop] = value;
        let index = convertToInt(prop);
        if (index !== null) {
          __privateMethod(_a7 = self, _SignalArray_instances, dirtyStorageFor_fn).call(_a7, index);
          __privateGet(self, _collection).set(null);
        } else if (prop === "length") {
          __privateGet(self, _collection).set(null);
        }
        return true;
      },
      getPrototypeOf() {
        return _SignalArray.prototype;
      }
    });
  }
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   */
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  static from(iterable, mapfn, thisArg) {
    return mapfn ? new _SignalArray(Array.from(iterable, mapfn, thisArg)) : new _SignalArray(Array.from(iterable));
  }
  static of(...arr) {
    return new _SignalArray(arr);
  }
};
_collection = new WeakMap();
_storages = new WeakMap();
_SignalArray_instances = new WeakSet();
readStorageFor_fn = function(index) {
  let storage = __privateGet(this, _storages).get(index);
  if (storage === void 0) {
    storage = createStorage();
    __privateGet(this, _storages).set(index, storage);
  }
  storage.get();
};
dirtyStorageFor_fn = function(index) {
  const storage = __privateGet(this, _storages).get(index);
  if (storage) {
    storage.set(null);
  }
};
var SignalArray = _SignalArray;
Object.setPrototypeOf(SignalArray.prototype, Array.prototype);

// ../../node_modules/signal-utils/dist/map.ts.js
var SignalMap = class {
  constructor(existing) {
    __publicField(this, "collection", createStorage());
    __publicField(this, "storages", /* @__PURE__ */ new Map());
    __publicField(this, "vals");
    this.vals = existing ? new Map(existing) : /* @__PURE__ */ new Map();
  }
  readStorageFor(key) {
    const {
      storages
    } = this;
    let storage = storages.get(key);
    if (storage === void 0) {
      storage = createStorage();
      storages.set(key, storage);
    }
    storage.get();
  }
  dirtyStorageFor(key) {
    const storage = this.storages.get(key);
    if (storage) {
      storage.set(null);
    }
  }
  // **** KEY GETTERS ****
  get(key) {
    this.readStorageFor(key);
    return this.vals.get(key);
  }
  has(key) {
    this.readStorageFor(key);
    return this.vals.has(key);
  }
  // **** ALL GETTERS ****
  entries() {
    this.collection.get();
    return this.vals.entries();
  }
  keys() {
    this.collection.get();
    return this.vals.keys();
  }
  values() {
    this.collection.get();
    return this.vals.values();
  }
  forEach(fn) {
    this.collection.get();
    this.vals.forEach(fn);
  }
  get size() {
    this.collection.get();
    return this.vals.size;
  }
  [Symbol.iterator]() {
    this.collection.get();
    return this.vals[Symbol.iterator]();
  }
  get [Symbol.toStringTag]() {
    return this.vals[Symbol.toStringTag];
  }
  // **** KEY SETTERS ****
  set(key, value) {
    this.dirtyStorageFor(key);
    this.collection.set(null);
    this.vals.set(key, value);
    return this;
  }
  delete(key) {
    this.dirtyStorageFor(key);
    this.collection.set(null);
    return this.vals.delete(key);
  }
  // **** ALL SETTERS ****
  clear() {
    this.storages.forEach((s11) => s11.set(null));
    this.collection.set(null);
    this.vals.clear();
  }
};
Object.setPrototypeOf(SignalMap.prototype, Map.prototype);

// ../../node_modules/signal-utils/dist/object.ts.js
var _storages2, _collection2, _SignalObjectImpl_instances, readStorageFor_fn2, dirtyStorageFor_fn2, dirtyCollection_fn;
var _SignalObjectImpl = class _SignalObjectImpl {
  constructor(obj = {}) {
    __privateAdd(this, _SignalObjectImpl_instances);
    __privateAdd(this, _storages2, /* @__PURE__ */ new Map());
    __privateAdd(this, _collection2, createStorage());
    let proto = Object.getPrototypeOf(obj);
    let descs = Object.getOwnPropertyDescriptors(obj);
    let clone2 = Object.create(proto);
    for (let prop in descs) {
      Object.defineProperty(clone2, prop, descs[prop]);
    }
    let self = this;
    return new Proxy(clone2, {
      get(target, prop, receiver) {
        var _a7;
        __privateMethod(_a7 = self, _SignalObjectImpl_instances, readStorageFor_fn2).call(_a7, prop);
        return Reflect.get(target, prop, receiver);
      },
      has(target, prop) {
        var _a7;
        __privateMethod(_a7 = self, _SignalObjectImpl_instances, readStorageFor_fn2).call(_a7, prop);
        return prop in target;
      },
      ownKeys(target) {
        __privateGet(self, _collection2).get();
        return Reflect.ownKeys(target);
      },
      set(target, prop, value, receiver) {
        var _a7, _b2;
        let result = Reflect.set(target, prop, value, receiver);
        __privateMethod(_a7 = self, _SignalObjectImpl_instances, dirtyStorageFor_fn2).call(_a7, prop);
        __privateMethod(_b2 = self, _SignalObjectImpl_instances, dirtyCollection_fn).call(_b2);
        return result;
      },
      deleteProperty(target, prop) {
        var _a7, _b2;
        if (prop in target) {
          delete target[prop];
          __privateMethod(_a7 = self, _SignalObjectImpl_instances, dirtyStorageFor_fn2).call(_a7, prop);
          __privateMethod(_b2 = self, _SignalObjectImpl_instances, dirtyCollection_fn).call(_b2);
        }
        return true;
      },
      getPrototypeOf() {
        return _SignalObjectImpl.prototype;
      }
    });
  }
  static fromEntries(entries2) {
    return new _SignalObjectImpl(Object.fromEntries(entries2));
  }
};
_storages2 = new WeakMap();
_collection2 = new WeakMap();
_SignalObjectImpl_instances = new WeakSet();
readStorageFor_fn2 = function(key) {
  let storage = __privateGet(this, _storages2).get(key);
  if (storage === void 0) {
    storage = createStorage();
    __privateGet(this, _storages2).set(key, storage);
  }
  storage.get();
};
dirtyStorageFor_fn2 = function(key) {
  const storage = __privateGet(this, _storages2).get(key);
  if (storage) {
    storage.set(null);
  }
};
dirtyCollection_fn = function() {
  __privateGet(this, _collection2).set(null);
};
var SignalObjectImpl = _SignalObjectImpl;
var SignalObject = SignalObjectImpl;

// ../../node_modules/signal-utils/dist/set.ts.js
var SignalSet = class {
  constructor(existing) {
    __publicField(this, "collection", createStorage());
    __publicField(this, "storages", /* @__PURE__ */ new Map());
    __publicField(this, "vals");
    this.vals = new Set(existing);
  }
  storageFor(key) {
    const storages = this.storages;
    let storage = storages.get(key);
    if (storage === void 0) {
      storage = createStorage();
      storages.set(key, storage);
    }
    return storage;
  }
  dirtyStorageFor(key) {
    const storage = this.storages.get(key);
    if (storage) {
      storage.set(null);
    }
  }
  // **** KEY GETTERS ****
  has(value) {
    this.storageFor(value).get();
    return this.vals.has(value);
  }
  // **** ALL GETTERS ****
  entries() {
    this.collection.get();
    return this.vals.entries();
  }
  keys() {
    this.collection.get();
    return this.vals.keys();
  }
  values() {
    this.collection.get();
    return this.vals.values();
  }
  forEach(fn) {
    this.collection.get();
    this.vals.forEach(fn);
  }
  get size() {
    this.collection.get();
    return this.vals.size;
  }
  [Symbol.iterator]() {
    this.collection.get();
    return this.vals[Symbol.iterator]();
  }
  get [Symbol.toStringTag]() {
    return this.vals[Symbol.toStringTag];
  }
  // **** KEY SETTERS ****
  add(value) {
    this.dirtyStorageFor(value);
    this.collection.set(null);
    this.vals.add(value);
    return this;
  }
  delete(value) {
    this.dirtyStorageFor(value);
    this.collection.set(null);
    return this.vals.delete(value);
  }
  // **** ALL SETTERS ****
  clear() {
    this.storages.forEach((s11) => s11.set(null));
    this.collection.set(null);
    this.vals.clear();
  }
};
Object.setPrototypeOf(SignalSet.prototype, Set.prototype);

// ../../node_modules/@a2ui/lit/src/0.8/data/signal-model-processor.js
function create() {
  return new A2uiMessageProcessor({
    arrayCtor: SignalArray,
    mapCtor: SignalMap,
    objCtor: SignalObject,
    setCtor: SignalSet
  });
}

// ../../node_modules/@a2ui/lit/src/0.8/core.js
var Data = {
  createSignalA2uiMessageProcessor: create,
  A2uiMessageProcessor,
  Guards: guards_exports
};

// ../../node_modules/@a2ui/lit/src/0.8/ui/ui.js
var ui_exports = {};
__export(ui_exports, {
  Audio: () => Audio,
  Button: () => Button,
  Card: () => Card,
  Checkbox: () => Checkbox,
  Column: () => Column,
  ComponentRegistry: () => ComponentRegistry,
  Context: () => context_exports,
  DateTimeInput: () => DateTimeInput,
  Divider: () => Divider,
  Icon: () => Icon,
  Image: () => Image,
  List: () => List,
  Modal: () => Modal,
  MultipleChoice: () => MultipleChoice,
  Root: () => Root,
  Row: () => Row,
  Slider: () => Slider,
  Surface: () => Surface,
  Tabs: () => Tabs,
  Text: () => Text,
  TextField: () => TextField,
  Utils: () => utils_exports,
  Video: () => Video,
  componentRegistry: () => componentRegistry,
  instanceOf: () => instanceOf,
  registerCustomComponents: () => registerCustomComponents
});

// ../../node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t7, e11, o13) {
    if (this._$cssResult$ = true, o13 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t7, this.t = e11;
  }
  get styleSheet() {
    let t7 = this.o;
    const s11 = this.t;
    if (e && void 0 === t7) {
      const e11 = void 0 !== s11 && 1 === s11.length;
      e11 && (t7 = o.get(s11)), void 0 === t7 && ((this.o = t7 = new CSSStyleSheet()).replaceSync(this.cssText), e11 && o.set(s11, t7));
    }
    return t7;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t7) => new n("string" == typeof t7 ? t7 : t7 + "", void 0, s);
var i = (t7, ...e11) => {
  const o13 = 1 === t7.length ? t7[0] : e11.reduce((e12, s11, o14) => e12 + ((t8) => {
    if (true === t8._$cssResult$) return t8.cssText;
    if ("number" == typeof t8) return t8;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t8 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s11) + t7[o14 + 1], t7[0]);
  return new n(o13, t7, s);
};
var S = (s11, o13) => {
  if (e) s11.adoptedStyleSheets = o13.map((t7) => t7 instanceof CSSStyleSheet ? t7 : t7.styleSheet);
  else for (const e11 of o13) {
    const o14 = document.createElement("style"), n11 = t.litNonce;
    void 0 !== n11 && o14.setAttribute("nonce", n11), o14.textContent = e11.cssText, s11.appendChild(o14);
  }
};
var c = e ? (t7) => t7 : (t7) => t7 instanceof CSSStyleSheet ? ((t8) => {
  let e11 = "";
  for (const s11 of t8.cssRules) e11 += s11.cssText;
  return r(e11);
})(t7) : t7;

// ../../node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t7, s11) => t7;
var u = { toAttribute(t7, s11) {
  switch (s11) {
    case Boolean:
      t7 = t7 ? l : null;
      break;
    case Object:
    case Array:
      t7 = null == t7 ? t7 : JSON.stringify(t7);
  }
  return t7;
}, fromAttribute(t7, s11) {
  let i11 = t7;
  switch (s11) {
    case Boolean:
      i11 = null !== t7;
      break;
    case Number:
      i11 = null === t7 ? null : Number(t7);
      break;
    case Object:
    case Array:
      try {
        i11 = JSON.parse(t7);
      } catch (t8) {
        i11 = null;
      }
  }
  return i11;
} };
var f = (t7, s11) => !i2(t7, s11);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
var _a, _b;
(_a = Symbol.metadata) != null ? _a : Symbol.metadata = /* @__PURE__ */ Symbol("metadata"), (_b = a.litPropertyMetadata) != null ? _b : a.litPropertyMetadata = /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t7) {
    var _a7;
    this._$Ei(), ((_a7 = this.l) != null ? _a7 : this.l = []).push(t7);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t7, s11 = b) {
    if (s11.state && (s11.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t7) && ((s11 = Object.create(s11)).wrapped = true), this.elementProperties.set(t7, s11), !s11.noAccessor) {
      const i11 = /* @__PURE__ */ Symbol(), h8 = this.getPropertyDescriptor(t7, i11, s11);
      void 0 !== h8 && e2(this.prototype, t7, h8);
    }
  }
  static getPropertyDescriptor(t7, s11, i11) {
    var _a7;
    const { get: e11, set: r9 } = (_a7 = h(this.prototype, t7)) != null ? _a7 : { get() {
      return this[s11];
    }, set(t8) {
      this[s11] = t8;
    } };
    return { get: e11, set(s12) {
      const h8 = e11 == null ? void 0 : e11.call(this);
      r9 == null ? void 0 : r9.call(this, s12), this.requestUpdate(t7, h8, i11);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t7) {
    var _a7;
    return (_a7 = this.elementProperties.get(t7)) != null ? _a7 : b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t7 = n2(this);
    t7.finalize(), void 0 !== t7.l && (this.l = [...t7.l]), this.elementProperties = new Map(t7.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t8 = this.properties, s11 = [...r2(t8), ...o2(t8)];
      for (const i11 of s11) this.createProperty(i11, t8[i11]);
    }
    const t7 = this[Symbol.metadata];
    if (null !== t7) {
      const s11 = litPropertyMetadata.get(t7);
      if (void 0 !== s11) for (const [t8, i11] of s11) this.elementProperties.set(t8, i11);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t8, s11] of this.elementProperties) {
      const i11 = this._$Eu(t8, s11);
      void 0 !== i11 && this._$Eh.set(i11, t8);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s11) {
    const i11 = [];
    if (Array.isArray(s11)) {
      const e11 = new Set(s11.flat(1 / 0).reverse());
      for (const s12 of e11) i11.unshift(c(s12));
    } else void 0 !== s11 && i11.push(c(s11));
    return i11;
  }
  static _$Eu(t7, s11) {
    const i11 = s11.attribute;
    return false === i11 ? void 0 : "string" == typeof i11 ? i11 : "string" == typeof t7 ? t7.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a7;
    this._$ES = new Promise((t7) => this.enableUpdating = t7), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a7 = this.constructor.l) == null ? void 0 : _a7.forEach((t7) => t7(this));
  }
  addController(t7) {
    var _a7, _b2;
    ((_a7 = this._$EO) != null ? _a7 : this._$EO = /* @__PURE__ */ new Set()).add(t7), void 0 !== this.renderRoot && this.isConnected && ((_b2 = t7.hostConnected) == null ? void 0 : _b2.call(t7));
  }
  removeController(t7) {
    var _a7;
    (_a7 = this._$EO) == null ? void 0 : _a7.delete(t7);
  }
  _$E_() {
    const t7 = /* @__PURE__ */ new Map(), s11 = this.constructor.elementProperties;
    for (const i11 of s11.keys()) this.hasOwnProperty(i11) && (t7.set(i11, this[i11]), delete this[i11]);
    t7.size > 0 && (this._$Ep = t7);
  }
  createRenderRoot() {
    var _a7;
    const t7 = (_a7 = this.shadowRoot) != null ? _a7 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(t7, this.constructor.elementStyles), t7;
  }
  connectedCallback() {
    var _a7, _b2;
    (_a7 = this.renderRoot) != null ? _a7 : this.renderRoot = this.createRenderRoot(), this.enableUpdating(true), (_b2 = this._$EO) == null ? void 0 : _b2.forEach((t7) => {
      var _a8;
      return (_a8 = t7.hostConnected) == null ? void 0 : _a8.call(t7);
    });
  }
  enableUpdating(t7) {
  }
  disconnectedCallback() {
    var _a7;
    (_a7 = this._$EO) == null ? void 0 : _a7.forEach((t7) => {
      var _a8;
      return (_a8 = t7.hostDisconnected) == null ? void 0 : _a8.call(t7);
    });
  }
  attributeChangedCallback(t7, s11, i11) {
    this._$AK(t7, i11);
  }
  _$ET(t7, s11) {
    var _a7;
    const i11 = this.constructor.elementProperties.get(t7), e11 = this.constructor._$Eu(t7, i11);
    if (void 0 !== e11 && true === i11.reflect) {
      const h8 = (void 0 !== ((_a7 = i11.converter) == null ? void 0 : _a7.toAttribute) ? i11.converter : u).toAttribute(s11, i11.type);
      this._$Em = t7, null == h8 ? this.removeAttribute(e11) : this.setAttribute(e11, h8), this._$Em = null;
    }
  }
  _$AK(t7, s11) {
    var _a7, _b2, _c;
    const i11 = this.constructor, e11 = i11._$Eh.get(t7);
    if (void 0 !== e11 && this._$Em !== e11) {
      const t8 = i11.getPropertyOptions(e11), h8 = "function" == typeof t8.converter ? { fromAttribute: t8.converter } : void 0 !== ((_a7 = t8.converter) == null ? void 0 : _a7.fromAttribute) ? t8.converter : u;
      this._$Em = e11;
      const r9 = h8.fromAttribute(s11, t8.type);
      this[e11] = (_c = r9 != null ? r9 : (_b2 = this._$Ej) == null ? void 0 : _b2.get(e11)) != null ? _c : r9, this._$Em = null;
    }
  }
  requestUpdate(t7, s11, i11, e11 = false, h8) {
    var _a7, _b2;
    if (void 0 !== t7) {
      const r9 = this.constructor;
      if (false === e11 && (h8 = this[t7]), i11 != null ? i11 : i11 = r9.getPropertyOptions(t7), !(((_a7 = i11.hasChanged) != null ? _a7 : f)(h8, s11) || i11.useDefault && i11.reflect && h8 === ((_b2 = this._$Ej) == null ? void 0 : _b2.get(t7)) && !this.hasAttribute(r9._$Eu(t7, i11)))) return;
      this.C(t7, s11, i11);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t7, s11, { useDefault: i11, reflect: e11, wrapped: h8 }, r9) {
    var _a7, _b2, _c;
    i11 && !((_a7 = this._$Ej) != null ? _a7 : this._$Ej = /* @__PURE__ */ new Map()).has(t7) && (this._$Ej.set(t7, (_b2 = r9 != null ? r9 : s11) != null ? _b2 : this[t7]), true !== h8 || void 0 !== r9) || (this._$AL.has(t7) || (this.hasUpdated || i11 || (s11 = void 0), this._$AL.set(t7, s11)), true === e11 && this._$Em !== t7 && ((_c = this._$Eq) != null ? _c : this._$Eq = /* @__PURE__ */ new Set()).add(t7));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t8) {
      Promise.reject(t8);
    }
    const t7 = this.scheduleUpdate();
    return null != t7 && await t7, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a7, _b2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((_a7 = this.renderRoot) != null ? _a7 : this.renderRoot = this.createRenderRoot(), this._$Ep) {
        for (const [t9, s12] of this._$Ep) this[t9] = s12;
        this._$Ep = void 0;
      }
      const t8 = this.constructor.elementProperties;
      if (t8.size > 0) for (const [s12, i11] of t8) {
        const { wrapped: t9 } = i11, e11 = this[s12];
        true !== t9 || this._$AL.has(s12) || void 0 === e11 || this.C(s12, void 0, i11, e11);
      }
    }
    let t7 = false;
    const s11 = this._$AL;
    try {
      t7 = this.shouldUpdate(s11), t7 ? (this.willUpdate(s11), (_b2 = this._$EO) == null ? void 0 : _b2.forEach((t8) => {
        var _a8;
        return (_a8 = t8.hostUpdate) == null ? void 0 : _a8.call(t8);
      }), this.update(s11)) : this._$EM();
    } catch (s12) {
      throw t7 = false, this._$EM(), s12;
    }
    t7 && this._$AE(s11);
  }
  willUpdate(t7) {
  }
  _$AE(t7) {
    var _a7;
    (_a7 = this._$EO) == null ? void 0 : _a7.forEach((t8) => {
      var _a8;
      return (_a8 = t8.hostUpdated) == null ? void 0 : _a8.call(t8);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t7)), this.updated(t7);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t7) {
    return true;
  }
  update(t7) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t8) => this._$ET(t8, this[t8]))), this._$EM();
  }
  updated(t7) {
  }
  firstUpdated(t7) {
  }
};
var _a2;
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p == null ? void 0 : p({ ReactiveElement: y }), ((_a2 = a.reactiveElementVersions) != null ? _a2 : a.reactiveElementVersions = []).push("2.1.2");

// ../../node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t7) => t7;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t7) => t7 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t7) => null === t7 || "object" != typeof t7 && "function" != typeof t7;
var u2 = Array.isArray;
var d2 = (t7) => u2(t7) || "function" == typeof (t7 == null ? void 0 : t7[Symbol.iterator]);
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t7) => (i11, ...s11) => ({ _$litType$: t7, strings: i11, values: s11 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t7, i11) {
  if (!u2(t7) || !t7.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i11) : i11;
}
var N = (t7, i11) => {
  const s11 = t7.length - 1, e11 = [];
  let n11, l5 = 2 === i11 ? "<svg>" : 3 === i11 ? "<math>" : "", c8 = v;
  for (let i12 = 0; i12 < s11; i12++) {
    const s12 = t7[i12];
    let a4, u5, d3 = -1, f4 = 0;
    for (; f4 < s12.length && (c8.lastIndex = f4, u5 = c8.exec(s12), null !== u5); ) f4 = c8.lastIndex, c8 === v ? "!--" === u5[1] ? c8 = _ : void 0 !== u5[1] ? c8 = m : void 0 !== u5[2] ? (y2.test(u5[2]) && (n11 = RegExp("</" + u5[2], "g")), c8 = p2) : void 0 !== u5[3] && (c8 = p2) : c8 === p2 ? ">" === u5[0] ? (c8 = n11 != null ? n11 : v, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c8.lastIndex - u5[2].length, a4 = u5[1], c8 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g) : c8 === $ || c8 === g ? c8 = p2 : c8 === _ || c8 === m ? c8 = v : (c8 = p2, n11 = void 0);
    const x2 = c8 === p2 && t7[i12 + 1].startsWith("/>") ? " " : "";
    l5 += c8 === v ? s12 + r3 : d3 >= 0 ? (e11.push(a4), s12.slice(0, d3) + h2 + s12.slice(d3) + o3 + x2) : s12 + o3 + (-2 === d3 ? i12 : x2);
  }
  return [V(t7, l5 + (t7[s11] || "<?>") + (2 === i11 ? "</svg>" : 3 === i11 ? "</math>" : "")), e11];
};
var S2 = class _S {
  constructor({ strings: t7, _$litType$: i11 }, e11) {
    let r9;
    this.parts = [];
    let l5 = 0, a4 = 0;
    const u5 = t7.length - 1, d3 = this.parts, [f4, v3] = N(t7, i11);
    if (this.el = _S.createElement(f4, e11), P.currentNode = this.el.content, 2 === i11 || 3 === i11) {
      const t8 = this.el.content.firstChild;
      t8.replaceWith(...t8.childNodes);
    }
    for (; null !== (r9 = P.nextNode()) && d3.length < u5; ) {
      if (1 === r9.nodeType) {
        if (r9.hasAttributes()) for (const t8 of r9.getAttributeNames()) if (t8.endsWith(h2)) {
          const i12 = v3[a4++], s11 = r9.getAttribute(t8).split(o3), e12 = /([.?@])?(.*)/.exec(i12);
          d3.push({ type: 1, index: l5, name: e12[2], strings: s11, ctor: "." === e12[1] ? I : "?" === e12[1] ? L : "@" === e12[1] ? z : H }), r9.removeAttribute(t8);
        } else t8.startsWith(o3) && (d3.push({ type: 6, index: l5 }), r9.removeAttribute(t8));
        if (y2.test(r9.tagName)) {
          const t8 = r9.textContent.split(o3), i12 = t8.length - 1;
          if (i12 > 0) {
            r9.textContent = s2 ? s2.emptyScript : "";
            for (let s11 = 0; s11 < i12; s11++) r9.append(t8[s11], c3()), P.nextNode(), d3.push({ type: 2, index: ++l5 });
            r9.append(t8[i12], c3());
          }
        }
      } else if (8 === r9.nodeType) if (r9.data === n3) d3.push({ type: 2, index: l5 });
      else {
        let t8 = -1;
        for (; -1 !== (t8 = r9.data.indexOf(o3, t8 + 1)); ) d3.push({ type: 7, index: l5 }), t8 += o3.length - 1;
      }
      l5++;
    }
  }
  static createElement(t7, i11) {
    const s11 = l2.createElement("template");
    return s11.innerHTML = t7, s11;
  }
};
function M(t7, i11, s11 = t7, e11) {
  var _a7, _b2, _c;
  if (i11 === E) return i11;
  let h8 = void 0 !== e11 ? (_a7 = s11._$Co) == null ? void 0 : _a7[e11] : s11._$Cl;
  const o13 = a2(i11) ? void 0 : i11._$litDirective$;
  return (h8 == null ? void 0 : h8.constructor) !== o13 && ((_b2 = h8 == null ? void 0 : h8._$AO) == null ? void 0 : _b2.call(h8, false), void 0 === o13 ? h8 = void 0 : (h8 = new o13(t7), h8._$AT(t7, s11, e11)), void 0 !== e11 ? ((_c = s11._$Co) != null ? _c : s11._$Co = [])[e11] = h8 : s11._$Cl = h8), void 0 !== h8 && (i11 = M(t7, h8._$AS(t7, i11.values), h8, e11)), i11;
}
var R = class {
  constructor(t7, i11) {
    this._$AV = [], this._$AN = void 0, this._$AD = t7, this._$AM = i11;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t7) {
    var _a7;
    const { el: { content: i11 }, parts: s11 } = this._$AD, e11 = ((_a7 = t7 == null ? void 0 : t7.creationScope) != null ? _a7 : l2).importNode(i11, true);
    P.currentNode = e11;
    let h8 = P.nextNode(), o13 = 0, n11 = 0, r9 = s11[0];
    for (; void 0 !== r9; ) {
      if (o13 === r9.index) {
        let i12;
        2 === r9.type ? i12 = new k(h8, h8.nextSibling, this, t7) : 1 === r9.type ? i12 = new r9.ctor(h8, r9.name, r9.strings, this, t7) : 6 === r9.type && (i12 = new Z(h8, this, t7)), this._$AV.push(i12), r9 = s11[++n11];
      }
      o13 !== (r9 == null ? void 0 : r9.index) && (h8 = P.nextNode(), o13++);
    }
    return P.currentNode = l2, e11;
  }
  p(t7) {
    let i11 = 0;
    for (const s11 of this._$AV) void 0 !== s11 && (void 0 !== s11.strings ? (s11._$AI(t7, s11, i11), i11 += s11.strings.length - 2) : s11._$AI(t7[i11])), i11++;
  }
};
var k = class _k {
  get _$AU() {
    var _a7, _b2;
    return (_b2 = (_a7 = this._$AM) == null ? void 0 : _a7._$AU) != null ? _b2 : this._$Cv;
  }
  constructor(t7, i11, s11, e11) {
    var _a7;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t7, this._$AB = i11, this._$AM = s11, this.options = e11, this._$Cv = (_a7 = e11 == null ? void 0 : e11.isConnected) != null ? _a7 : true;
  }
  get parentNode() {
    let t7 = this._$AA.parentNode;
    const i11 = this._$AM;
    return void 0 !== i11 && 11 === (t7 == null ? void 0 : t7.nodeType) && (t7 = i11.parentNode), t7;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t7, i11 = this) {
    t7 = M(this, t7, i11), a2(t7) ? t7 === A || null == t7 || "" === t7 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t7 !== this._$AH && t7 !== E && this._(t7) : void 0 !== t7._$litType$ ? this.$(t7) : void 0 !== t7.nodeType ? this.T(t7) : d2(t7) ? this.k(t7) : this._(t7);
  }
  O(t7) {
    return this._$AA.parentNode.insertBefore(t7, this._$AB);
  }
  T(t7) {
    this._$AH !== t7 && (this._$AR(), this._$AH = this.O(t7));
  }
  _(t7) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t7 : this.T(l2.createTextNode(t7)), this._$AH = t7;
  }
  $(t7) {
    var _a7;
    const { values: i11, _$litType$: s11 } = t7, e11 = "number" == typeof s11 ? this._$AC(t7) : (void 0 === s11.el && (s11.el = S2.createElement(V(s11.h, s11.h[0]), this.options)), s11);
    if (((_a7 = this._$AH) == null ? void 0 : _a7._$AD) === e11) this._$AH.p(i11);
    else {
      const t8 = new R(e11, this), s12 = t8.u(this.options);
      t8.p(i11), this.T(s12), this._$AH = t8;
    }
  }
  _$AC(t7) {
    let i11 = C.get(t7.strings);
    return void 0 === i11 && C.set(t7.strings, i11 = new S2(t7)), i11;
  }
  k(t7) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i11 = this._$AH;
    let s11, e11 = 0;
    for (const h8 of t7) e11 === i11.length ? i11.push(s11 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s11 = i11[e11], s11._$AI(h8), e11++;
    e11 < i11.length && (this._$AR(s11 && s11._$AB.nextSibling, e11), i11.length = e11);
  }
  _$AR(t7 = this._$AA.nextSibling, s11) {
    var _a7;
    for ((_a7 = this._$AP) == null ? void 0 : _a7.call(this, false, true, s11); t7 !== this._$AB; ) {
      const s12 = i3(t7).nextSibling;
      i3(t7).remove(), t7 = s12;
    }
  }
  setConnected(t7) {
    var _a7;
    void 0 === this._$AM && (this._$Cv = t7, (_a7 = this._$AP) == null ? void 0 : _a7.call(this, t7));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t7, i11, s11, e11, h8) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t7, this.name = i11, this._$AM = e11, this.options = h8, s11.length > 2 || "" !== s11[0] || "" !== s11[1] ? (this._$AH = Array(s11.length - 1).fill(new String()), this.strings = s11) : this._$AH = A;
  }
  _$AI(t7, i11 = this, s11, e11) {
    const h8 = this.strings;
    let o13 = false;
    if (void 0 === h8) t7 = M(this, t7, i11, 0), o13 = !a2(t7) || t7 !== this._$AH && t7 !== E, o13 && (this._$AH = t7);
    else {
      const e12 = t7;
      let n11, r9;
      for (t7 = h8[0], n11 = 0; n11 < h8.length - 1; n11++) r9 = M(this, e12[s11 + n11], i11, n11), r9 === E && (r9 = this._$AH[n11]), o13 || (o13 = !a2(r9) || r9 !== this._$AH[n11]), r9 === A ? t7 = A : t7 !== A && (t7 += (r9 != null ? r9 : "") + h8[n11 + 1]), this._$AH[n11] = r9;
    }
    o13 && !e11 && this.j(t7);
  }
  j(t7) {
    t7 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t7 != null ? t7 : "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t7) {
    this.element[this.name] = t7 === A ? void 0 : t7;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t7) {
    this.element.toggleAttribute(this.name, !!t7 && t7 !== A);
  }
};
var z = class extends H {
  constructor(t7, i11, s11, e11, h8) {
    super(t7, i11, s11, e11, h8), this.type = 5;
  }
  _$AI(t7, i11 = this) {
    var _a7;
    if ((t7 = (_a7 = M(this, t7, i11, 0)) != null ? _a7 : A) === E) return;
    const s11 = this._$AH, e11 = t7 === A && s11 !== A || t7.capture !== s11.capture || t7.once !== s11.once || t7.passive !== s11.passive, h8 = t7 !== A && (s11 === A || e11);
    e11 && this.element.removeEventListener(this.name, this, s11), h8 && this.element.addEventListener(this.name, this, t7), this._$AH = t7;
  }
  handleEvent(t7) {
    var _a7, _b2;
    "function" == typeof this._$AH ? this._$AH.call((_b2 = (_a7 = this.options) == null ? void 0 : _a7.host) != null ? _b2 : this.element, t7) : this._$AH.handleEvent(t7);
  }
};
var Z = class {
  constructor(t7, i11, s11) {
    this.element = t7, this.type = 6, this._$AN = void 0, this._$AM = i11, this.options = s11;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t7) {
    M(this, t7);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
var _a3;
B == null ? void 0 : B(S2, k), ((_a3 = t2.litHtmlVersions) != null ? _a3 : t2.litHtmlVersions = []).push("3.3.2");
var D = (t7, i11, s11) => {
  var _a7, _b2;
  const e11 = (_a7 = s11 == null ? void 0 : s11.renderBefore) != null ? _a7 : i11;
  let h8 = e11._$litPart$;
  if (void 0 === h8) {
    const t8 = (_b2 = s11 == null ? void 0 : s11.renderBefore) != null ? _b2 : null;
    e11._$litPart$ = h8 = new k(i11.insertBefore(c3(), t8), t8, void 0, s11 != null ? s11 : {});
  }
  return h8._$AI(t7), h8;
};

// ../../node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a7, _b2;
    const t7 = super.createRenderRoot();
    return (_b2 = (_a7 = this.renderOptions).renderBefore) != null ? _b2 : _a7.renderBefore = t7.firstChild, t7;
  }
  update(t7) {
    const r9 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t7), this._$Do = D(r9, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a7;
    super.connectedCallback(), (_a7 = this._$Do) == null ? void 0 : _a7.setConnected(true);
  }
  disconnectedCallback() {
    var _a7;
    super.disconnectedCallback(), (_a7 = this._$Do) == null ? void 0 : _a7.setConnected(false);
  }
  render() {
    return E;
  }
};
var _a4;
i4._$litElement$ = true, i4["finalized"] = true, (_a4 = s3.litElementHydrateSupport) == null ? void 0 : _a4.call(s3, { LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4 == null ? void 0 : o4({ LitElement: i4 });
var _a5;
((_a5 = s3.litElementVersions) != null ? _a5 : s3.litElementVersions = []).push("4.2.2");

// ../../node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t7) => (e11, o13) => {
  void 0 !== o13 ? o13.addInitializer(() => {
    customElements.get(t7) || customElements.define(t7, e11);
  }) : customElements.get(t7) || customElements.define(t7, e11);
};

// ../../node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t7 = o5, e11, r9) => {
  const { kind: n11, metadata: i11 } = r9;
  let s11 = globalThis.litPropertyMetadata.get(i11);
  if (void 0 === s11 && globalThis.litPropertyMetadata.set(i11, s11 = /* @__PURE__ */ new Map()), "setter" === n11 && ((t7 = Object.create(t7)).wrapped = true), s11.set(r9.name, t7), "accessor" === n11) {
    const { name: o13 } = r9;
    return { set(r10) {
      const n12 = e11.get.call(this);
      e11.set.call(this, r10), this.requestUpdate(o13, n12, t7, true, r10);
    }, init(e12) {
      return void 0 !== e12 && this.C(o13, void 0, t7, e12), e12;
    } };
  }
  if ("setter" === n11) {
    const { name: o13 } = r9;
    return function(r10) {
      const n12 = this[o13];
      e11.call(this, r10), this.requestUpdate(o13, n12, t7, true, r10);
    };
  }
  throw Error("Unsupported decorator location: " + n11);
};
function n4(t7) {
  return (e11, o13) => "object" == typeof o13 ? r4(t7, e11, o13) : ((t8, e12, o14) => {
    const r9 = e12.hasOwnProperty(o14);
    return e12.constructor.createProperty(o14, t8), r9 ? Object.getOwnPropertyDescriptor(e12, o14) : void 0;
  })(t7, e11, o13);
}

// ../../node_modules/@lit/reactive-element/decorators/state.js
function r5(r9) {
  return n4({ ...r9, state: true, attribute: false });
}

// ../../node_modules/@lit/reactive-element/decorators/base.js
var e4 = (e11, t7, c8) => (c8.configurable = true, c8.enumerable = true, Reflect.decorate && "object" != typeof t7 && Object.defineProperty(e11, t7, c8), c8);

// ../../node_modules/@lit/reactive-element/decorators/query.js
function e5(e11, r9) {
  return (n11, s11, i11) => {
    const o13 = (t7) => {
      var _a7, _b2;
      return (_b2 = (_a7 = t7.renderRoot) == null ? void 0 : _a7.querySelector(e11)) != null ? _b2 : null;
    };
    if (r9) {
      const { get: e12, set: r10 } = "object" == typeof s11 ? n11 : i11 != null ? i11 : /* @__PURE__ */ (() => {
        const t7 = /* @__PURE__ */ Symbol();
        return { get() {
          return this[t7];
        }, set(e13) {
          this[t7] = e13;
        } };
      })();
      return e4(n11, s11, { get() {
        let t7 = e12.call(this);
        return void 0 === t7 && (t7 = o13(this), (null !== t7 || this.hasUpdated) && r10.call(this, t7)), t7;
      } });
    }
    return e4(n11, s11, { get() {
      return o13(this);
    } });
  };
}

// ../../node_modules/@lit-labs/signals/lib/signal-watcher.js
var i5 = /* @__PURE__ */ Symbol("SignalWatcherBrand");
var s4 = new FinalizationRegistry((({ watcher: t7, signal: i11 }) => {
  t7.unwatch(i11);
}));
var h3 = /* @__PURE__ */ new WeakMap();
function e6(e11) {
  return true === e11[i5] ? (console.warn("SignalWatcher should not be applied to the same class more than once."), e11) : class extends e11 {
    constructor() {
      super(...arguments), this._$St = new Signal.State(0), this._$Si = false, this._$So = true, this._$Sh = /* @__PURE__ */ new Set();
    }
    _$Sl() {
      if (void 0 !== this._$Su) return;
      this._$Sv = new Signal.Computed((() => {
        this._$St.get(), super.performUpdate();
      }));
      const i11 = this._$Su = new Signal.subtle.Watcher((function() {
        const t7 = h3.get(this);
        void 0 !== t7 && (false === t7._$Si && t7.requestUpdate(), this.watch());
      }));
      h3.set(i11, this), s4.register(this, { watcher: i11, signal: this._$Sv }), i11.watch(this._$Sv);
    }
    _$Sp() {
      void 0 !== this._$Su && (this._$Su.unwatch(this._$Sv), this._$Sv = void 0, this._$Su = void 0);
    }
    performUpdate() {
      this.isUpdatePending && (this._$Sl(), this._$Si = true, this._$St.set(this._$St.get() + 1), this._$Si = false, this._$Sv.get());
    }
    update(t7) {
      try {
        this._$So ? (this._$So = false, super.update(t7)) : this._$Sh.forEach(((t8) => t8.commit()));
      } finally {
        this.isUpdatePending = false, this._$Sh.clear();
      }
    }
    requestUpdate(t7, i11, s11) {
      this._$So = true, super.requestUpdate(t7, i11, s11);
    }
    connectedCallback() {
      super.connectedCallback(), this.requestUpdate();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), queueMicrotask((() => {
        false === this.isConnected && this._$Sp();
      }));
    }
    _(t7) {
      this._$Sh.add(t7);
      const i11 = this._$So;
      this.requestUpdate(), this._$So = i11;
    }
    m(t7) {
      this._$Sh.delete(t7);
    }
  };
}

// ../../node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e7 = (t7) => (...e11) => ({ _$litDirective$: t7, values: e11 });
var i6 = class {
  constructor(t7) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t7, e11, i11) {
    this._$Ct = t7, this._$AM = e11, this._$Ci = i11;
  }
  _$AS(t7, e11) {
    return this.update(t7, e11);
  }
  update(t7, e11) {
    return this.render(...e11);
  }
};

// ../../node_modules/lit-html/directive-helpers.js
var { I: t5 } = j;
var i7 = (o13) => o13;
var n5 = (o13) => null === o13 || "object" != typeof o13 && "function" != typeof o13;
var r6 = (o13) => void 0 === o13.strings;
var s5 = () => document.createComment("");
var v2 = (o13, n11, e11) => {
  var _a7;
  const l5 = o13._$AA.parentNode, d3 = void 0 === n11 ? o13._$AB : n11._$AA;
  if (void 0 === e11) {
    const i11 = l5.insertBefore(s5(), d3), n12 = l5.insertBefore(s5(), d3);
    e11 = new t5(i11, n12, o13, o13.options);
  } else {
    const t7 = e11._$AB.nextSibling, n12 = e11._$AM, c8 = n12 !== o13;
    if (c8) {
      let t8;
      (_a7 = e11._$AQ) == null ? void 0 : _a7.call(e11, o13), e11._$AM = o13, void 0 !== e11._$AP && (t8 = o13._$AU) !== n12._$AU && e11._$AP(t8);
    }
    if (t7 !== d3 || c8) {
      let o14 = e11._$AA;
      for (; o14 !== t7; ) {
        const t8 = i7(o14).nextSibling;
        i7(l5).insertBefore(o14, d3), o14 = t8;
      }
    }
  }
  return e11;
};
var u3 = (o13, t7, i11 = o13) => (o13._$AI(t7, i11), o13);
var m2 = {};
var p3 = (o13, t7 = m2) => o13._$AH = t7;
var M2 = (o13) => o13._$AH;
var h4 = (o13) => {
  o13._$AR(), o13._$AA.remove();
};

// ../../node_modules/lit-html/async-directive.js
var s6 = (i11, t7) => {
  var _a7;
  const e11 = i11._$AN;
  if (void 0 === e11) return false;
  for (const i12 of e11) (_a7 = i12._$AO) == null ? void 0 : _a7.call(i12, t7, false), s6(i12, t7);
  return true;
};
var o6 = (i11) => {
  let t7, e11;
  do {
    if (void 0 === (t7 = i11._$AM)) break;
    e11 = t7._$AN, e11.delete(i11), i11 = t7;
  } while (0 === (e11 == null ? void 0 : e11.size));
};
var r7 = (i11) => {
  for (let t7; t7 = i11._$AM; i11 = t7) {
    let e11 = t7._$AN;
    if (void 0 === e11) t7._$AN = e11 = /* @__PURE__ */ new Set();
    else if (e11.has(i11)) break;
    e11.add(i11), c4(t7);
  }
};
function h5(i11) {
  void 0 !== this._$AN ? (o6(this), this._$AM = i11, r7(this)) : this._$AM = i11;
}
function n6(i11, t7 = false, e11 = 0) {
  const r9 = this._$AH, h8 = this._$AN;
  if (void 0 !== h8 && 0 !== h8.size) if (t7) if (Array.isArray(r9)) for (let i12 = e11; i12 < r9.length; i12++) s6(r9[i12], false), o6(r9[i12]);
  else null != r9 && (s6(r9, false), o6(r9));
  else s6(this, i11);
}
var c4 = (i11) => {
  var _a7, _b2;
  i11.type == t4.CHILD && ((_a7 = i11._$AP) != null ? _a7 : i11._$AP = n6, (_b2 = i11._$AQ) != null ? _b2 : i11._$AQ = h5);
};
var f3 = class extends i6 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i11, t7, e11) {
    super._$AT(i11, t7, e11), r7(this), this.isConnected = i11._$AU;
  }
  _$AO(i11, t7 = true) {
    var _a7, _b2;
    i11 !== this.isConnected && (this.isConnected = i11, i11 ? (_a7 = this.reconnected) == null ? void 0 : _a7.call(this) : (_b2 = this.disconnected) == null ? void 0 : _b2.call(this)), t7 && (s6(this, i11), o6(this));
  }
  setValue(t7) {
    if (r6(this._$Ct)) this._$Ct._$AI(t7, this);
    else {
      const i11 = [...this._$Ct._$AH];
      i11[this._$Ci] = t7, this._$Ct._$AI(i11, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};

// ../../node_modules/@lit-labs/signals/lib/watch.js
var h6 = class extends f3 {
  _$Sl() {
    if (void 0 !== this._$Su) return;
    this._$SW = new Signal.Computed((() => {
      var i12;
      return null === (i12 = this._$Sj) || void 0 === i12 ? void 0 : i12.get();
    }));
    const i11 = this._$Su = new Signal.subtle.Watcher((() => {
      var t7;
      null === (t7 = this._$SO) || void 0 === t7 || t7._(this), i11.watch();
    }));
    i11.watch(this._$SW);
  }
  _$Sp() {
    var i11;
    void 0 !== this._$Su && (this._$Su.unwatch(this._$SW), this._$SW = void 0, this._$Su = void 0, null === (i11 = this._$SO) || void 0 === i11 || i11.m(this));
  }
  commit() {
    this.setValue(Signal.subtle.untrack((() => {
      var i11;
      return null === (i11 = this._$SW) || void 0 === i11 ? void 0 : i11.get();
    })));
  }
  render(i11) {
    return Signal.subtle.untrack((() => i11.get()));
  }
  update(i11, [t7]) {
    var h8, o13;
    return null !== (h8 = this._$SO) && void 0 !== h8 || (this._$SO = null === (o13 = i11.options) || void 0 === o13 ? void 0 : o13.host), t7 !== this._$Sj && void 0 !== this._$Sj && this._$Sp(), this._$Sj = t7, this._$Sl(), Signal.subtle.untrack((() => this._$SW.get()));
  }
  disconnected() {
    this._$Sp();
  }
  reconnected() {
    this._$Sl();
  }
};
var o7 = e7(h6);

// ../../node_modules/@lit-labs/signals/lib/html-tag.js
var m3 = (o13) => (t7, ...m5) => o13(t7, ...m5.map(((o14) => o14 instanceof Signal.State || o14 instanceof Signal.Computed ? o7(o14) : o14)));
var l3 = m3(b2);
var r8 = m3(w);

// ../../node_modules/@lit-labs/signals/index.js
var l4 = Signal.State;
var o8 = Signal.Computed;

// ../../node_modules/@lit/context/lib/context-request-event.js
var s7 = class extends Event {
  constructor(s11, t7, e11, o13) {
    super("context-request", { bubbles: true, composed: true }), this.context = s11, this.contextTarget = t7, this.callback = e11, this.subscribe = o13 != null ? o13 : false;
  }
};

// ../../node_modules/@lit/context/lib/create-context.js
function n7(n11) {
  return n11;
}

// ../../node_modules/@lit/context/lib/controllers/context-consumer.js
var s8 = class {
  constructor(t7, s11, i11, h8) {
    var _a7;
    if (this.subscribe = false, this.provided = false, this.value = void 0, this.t = (t8, s12) => {
      this.unsubscribe && (this.unsubscribe !== s12 && (this.provided = false, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t8, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = true, this.callback && this.callback(t8, s12)), this.unsubscribe = s12;
    }, this.host = t7, void 0 !== s11.context) {
      const t8 = s11;
      this.context = t8.context, this.callback = t8.callback, this.subscribe = (_a7 = t8.subscribe) != null ? _a7 : false;
    } else this.context = s11, this.callback = i11, this.subscribe = h8 != null ? h8 : false;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new s7(this.context, this.host, this.t, this.subscribe));
  }
};

// ../../node_modules/@lit/context/lib/decorators/consume.js
function c5({ context: c8, subscribe: e11 }) {
  return (o13, n11) => {
    "object" == typeof n11 ? n11.addInitializer((function() {
      new s8(this, { context: c8, callback: (t7) => {
        o13.set.call(this, t7);
      }, subscribe: e11 });
    })) : o13.constructor.addInitializer(((o14) => {
      new s8(o14, { context: c8, callback: (t7) => {
        o14[n11] = t7;
      }, subscribe: e11 });
    }));
  };
}

// ../../node_modules/lit-html/directives/map.js
function* o9(o13, f4) {
  if (void 0 !== o13) {
    let i11 = 0;
    for (const t7 of o13) yield f4(t7, i11++);
  }
}

// ../../node_modules/signal-utils/dist/subtle/microtask-effect.ts.js
var pending = false;
var watcher = new Signal.subtle.Watcher(() => {
  if (!pending) {
    pending = true;
    queueMicrotask(() => {
      pending = false;
      flushPending();
    });
  }
});
function flushPending() {
  for (const signal of watcher.getPending()) {
    signal.get();
  }
  watcher.watch();
}
function effect(cb) {
  let c8 = new Signal.Computed(() => cb());
  watcher.watch(c8);
  c8.get();
  return () => {
    watcher.unwatch(c8);
  };
}

// ../../node_modules/@a2ui/lit/src/0.8/ui/context/theme.js
var theme = n7(/* @__PURE__ */ Symbol("A2UITheme"));
var themeContext = theme;

// ../../node_modules/@a2ui/lit/src/0.8/ui/styles.js
var buildStructuralStyles = () => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(structuralStyles);
    return styleSheet;
  } catch (e11) {
    throw new Error("Failed to construct structural styles.", { cause: e11 });
  }
};
var structuralStyles2 = buildStructuralStyles();

// ../../node_modules/@a2ui/lit/src/0.8/ui/component-registry.js
var ComponentRegistry = class {
  constructor() {
    this.schemas = /* @__PURE__ */ new Map();
    this.registry = /* @__PURE__ */ new Map();
  }
  register(typeName, constructor, tagName, schema) {
    if (!/^[a-zA-Z0-9]+$/.test(typeName)) {
      throw new Error(`[Registry] Invalid typeName '${typeName}'. Must be alphanumeric.`);
    }
    this.registry.set(typeName, constructor);
    if (schema) {
      this.schemas.set(typeName, schema);
    }
    const actualTagName = tagName || `a2ui-custom-${typeName.toLowerCase()}`;
    const existingName = customElements.getName(constructor);
    if (existingName) {
      if (existingName !== actualTagName) {
        throw new Error(`Component ${typeName} is already registered as ${existingName}, but requested as ${actualTagName}.`);
      }
      return;
    }
    if (!customElements.get(actualTagName)) {
      customElements.define(actualTagName, constructor);
    }
  }
  get(typeName) {
    return this.registry.get(typeName);
  }
  getInlineCatalog() {
    const components = {};
    for (const [key, value] of this.schemas) {
      components[key] = value;
    }
    return { components };
  }
};
var componentRegistry = new ComponentRegistry();

// ../../node_modules/@a2ui/lit/src/0.8/ui/root.js
var __runInitializers = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var Root = (() => {
  var _a7, _surfaceId_accessor_storage, _component_accessor_storage, _theme_accessor_storage, _childComponents_accessor_storage, _processor_accessor_storage, _dataContextPath_accessor_storage, _enableCustomElements_accessor_storage, _weight, _lightDomEffectDisposer, _b2;
  let _classDecorators = [t3("a2ui-root")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = e6(i4);
  let _instanceExtraInitializers = [];
  let _surfaceId_decorators;
  let _surfaceId_initializers = [];
  let _surfaceId_extraInitializers = [];
  let _component_decorators;
  let _component_initializers = [];
  let _component_extraInitializers = [];
  let _theme_decorators;
  let _theme_initializers = [];
  let _theme_extraInitializers = [];
  let _childComponents_decorators;
  let _childComponents_initializers = [];
  let _childComponents_extraInitializers = [];
  let _processor_decorators;
  let _processor_initializers = [];
  let _processor_extraInitializers = [];
  let _dataContextPath_decorators;
  let _dataContextPath_initializers = [];
  let _dataContextPath_extraInitializers = [];
  let _enableCustomElements_decorators;
  let _enableCustomElements_initializers = [];
  let _enableCustomElements_extraInitializers = [];
  let _set_weight_decorators;
  var Root2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, _surfaceId_accessor_storage, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _surfaceId_initializers, null)));
      __privateAdd(this, _component_accessor_storage, (__runInitializers(this, _surfaceId_extraInitializers), __runInitializers(this, _component_initializers, null)));
      __privateAdd(this, _theme_accessor_storage, (__runInitializers(this, _component_extraInitializers), __runInitializers(this, _theme_initializers, void 0)));
      __privateAdd(this, _childComponents_accessor_storage, (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _childComponents_initializers, null)));
      __privateAdd(this, _processor_accessor_storage, (__runInitializers(this, _childComponents_extraInitializers), __runInitializers(this, _processor_initializers, null)));
      __privateAdd(this, _dataContextPath_accessor_storage, (__runInitializers(this, _processor_extraInitializers), __runInitializers(this, _dataContextPath_initializers, "")));
      __privateAdd(this, _enableCustomElements_accessor_storage, (__runInitializers(this, _dataContextPath_extraInitializers), __runInitializers(this, _enableCustomElements_initializers, false)));
      __privateAdd(this, _weight, (__runInitializers(this, _enableCustomElements_extraInitializers), 1));
      /**
       * Holds the cleanup function for our effect.
       * We need this to stop the effect when the component is disconnected.
       */
      __privateAdd(this, _lightDomEffectDisposer, null);
    }
    get surfaceId() {
      return __privateGet(this, _surfaceId_accessor_storage);
    }
    set surfaceId(value) {
      __privateSet(this, _surfaceId_accessor_storage, value);
    }
    get component() {
      return __privateGet(this, _component_accessor_storage);
    }
    set component(value) {
      __privateSet(this, _component_accessor_storage, value);
    }
    get theme() {
      return __privateGet(this, _theme_accessor_storage);
    }
    set theme(value) {
      __privateSet(this, _theme_accessor_storage, value);
    }
    get childComponents() {
      return __privateGet(this, _childComponents_accessor_storage);
    }
    set childComponents(value) {
      __privateSet(this, _childComponents_accessor_storage, value);
    }
    get processor() {
      return __privateGet(this, _processor_accessor_storage);
    }
    set processor(value) {
      __privateSet(this, _processor_accessor_storage, value);
    }
    get dataContextPath() {
      return __privateGet(this, _dataContextPath_accessor_storage);
    }
    set dataContextPath(value) {
      __privateSet(this, _dataContextPath_accessor_storage, value);
    }
    get enableCustomElements() {
      return __privateGet(this, _enableCustomElements_accessor_storage);
    }
    set enableCustomElements(value) {
      __privateSet(this, _enableCustomElements_accessor_storage, value);
    }
    set weight(weight) {
      __privateSet(this, _weight, weight);
      this.style.setProperty("--weight", `${weight}`);
    }
    get weight() {
      return __privateGet(this, _weight);
    }
    willUpdate(changedProperties) {
      if (changedProperties.has("childComponents")) {
        if (__privateGet(this, _lightDomEffectDisposer)) {
          __privateGet(this, _lightDomEffectDisposer).call(this);
        }
        __privateSet(this, _lightDomEffectDisposer, effect(() => {
          var _a7;
          const allChildren = (_a7 = this.childComponents) != null ? _a7 : null;
          const lightDomTemplate = this.renderComponentTree(allChildren);
          D(lightDomTemplate, this, { host: this });
        }));
      }
    }
    /**
     * Clean up the effect when the component is removed from the DOM.
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      if (__privateGet(this, _lightDomEffectDisposer)) {
        __privateGet(this, _lightDomEffectDisposer).call(this);
      }
    }
    /**
     * Turns the SignalMap into a renderable TemplateResult for Lit.
     */
    renderComponentTree(components) {
      if (!components) {
        return A;
      }
      if (!Array.isArray(components)) {
        return A;
      }
      return b2` ${o9(components, (component) => {
        var _a7, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O;
        if (this.enableCustomElements) {
          const registeredCtor = componentRegistry.get(component.type);
          const elCtor = registeredCtor || customElements.get(component.type);
          if (elCtor) {
            const node = component;
            const el = new elCtor();
            el.id = node.id;
            if (node.slotName) {
              el.slot = node.slotName;
            }
            el.component = node;
            el.weight = (_a7 = node.weight) != null ? _a7 : "initial";
            el.processor = this.processor;
            el.surfaceId = this.surfaceId;
            el.dataContextPath = (_b3 = node.dataContextPath) != null ? _b3 : "/";
            for (const [prop, val] of Object.entries(component.properties)) {
              el[prop] = val;
            }
            return b2`${el}`;
          }
        }
        switch (component.type) {
          case "List": {
            const node = component;
            const childComponents = node.properties.children;
            return b2`<a2ui-list
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_c = node.weight) != null ? _c : "initial"}
            .direction=${(_d = node.properties.direction) != null ? _d : "vertical"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-list>`;
          }
          case "Card": {
            const node = component;
            let childComponents = node.properties.children;
            if (!childComponents && node.properties.child) {
              childComponents = [node.properties.child];
            }
            return b2`<a2ui-card
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_e = node.weight) != null ? _e : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${childComponents}
            .dataContextPath=${(_f = node.dataContextPath) != null ? _f : ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-card>`;
          }
          case "Column": {
            const node = component;
            return b2`<a2ui-column
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_g = node.weight) != null ? _g : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${(_h = node.properties.children) != null ? _h : null}
            .dataContextPath=${(_i = node.dataContextPath) != null ? _i : ""}
            .alignment=${(_j = node.properties.alignment) != null ? _j : "stretch"}
            .distribution=${(_k = node.properties.distribution) != null ? _k : "start"}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-column>`;
          }
          case "Row": {
            const node = component;
            return b2`<a2ui-row
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_l = node.weight) != null ? _l : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${(_m = node.properties.children) != null ? _m : null}
            .dataContextPath=${(_n = node.dataContextPath) != null ? _n : ""}
            .alignment=${(_o = node.properties.alignment) != null ? _o : "stretch"}
            .distribution=${(_p = node.properties.distribution) != null ? _p : "start"}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-row>`;
          }
          case "Image": {
            const node = component;
            return b2`<a2ui-image
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_q = node.weight) != null ? _q : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .url=${(_r = node.properties.url) != null ? _r : null}
            .dataContextPath=${(_s = node.dataContextPath) != null ? _s : ""}
            .usageHint=${node.properties.usageHint}
            .fit=${node.properties.fit}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-image>`;
          }
          case "Icon": {
            const node = component;
            return b2`<a2ui-icon
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_t = node.weight) != null ? _t : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .name=${(_u = node.properties.name) != null ? _u : null}
            .dataContextPath=${(_v = node.dataContextPath) != null ? _v : ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-icon>`;
          }
          case "AudioPlayer": {
            const node = component;
            return b2`<a2ui-audioplayer
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_w = node.weight) != null ? _w : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .url=${(_x = node.properties.url) != null ? _x : null}
            .dataContextPath=${(_y = node.dataContextPath) != null ? _y : ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-audioplayer>`;
          }
          case "Button": {
            const node = component;
            return b2`<a2ui-button
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_z = node.weight) != null ? _z : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${(_A = node.dataContextPath) != null ? _A : ""}
            .action=${node.properties.action}
            .childComponents=${[node.properties.child]}
            .primary=${node.properties.primary}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-button>`;
          }
          case "Text": {
            const node = component;
            return b2`<a2ui-text
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_B = node.weight) != null ? _B : "initial"}
            .model=${this.processor}
            .surfaceId=${this.surfaceId}
            .processor=${this.processor}
            .dataContextPath=${node.dataContextPath}
            .text=${node.properties.text}
            .usageHint=${node.properties.usageHint}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-text>`;
          }
          case "CheckBox": {
            const node = component;
            return b2`<a2ui-checkbox
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_C = node.weight) != null ? _C : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${(_D = node.dataContextPath) != null ? _D : ""}
            .label=${node.properties.label}
            .value=${node.properties.value}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-checkbox>`;
          }
          case "DateTimeInput": {
            const node = component;
            return b2`<a2ui-datetimeinput
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_E = node.weight) != null ? _E : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${(_F = node.dataContextPath) != null ? _F : ""}
            .enableDate=${(_G = node.properties.enableDate) != null ? _G : true}
            .enableTime=${(_H = node.properties.enableTime) != null ? _H : true}
            .value=${node.properties.value}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-datetimeinput>`;
          }
          case "Divider": {
            const node = component;
            return b2`<a2ui-divider
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_I = node.weight) != null ? _I : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .thickness=${node.properties.thickness}
            .axis=${node.properties.axis}
            .color=${node.properties.color}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-divider>`;
          }
          case "MultipleChoice": {
            const node = component;
            return b2`<a2ui-multiplechoice
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_J = node.weight) != null ? _J : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .options=${node.properties.options}
            .maxAllowedSelections=${node.properties.maxAllowedSelections}
            .selections=${node.properties.selections}
            .variant=${node.properties.variant}
            .filterable=${node.properties.filterable}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-multiplechoice>`;
          }
          case "Slider": {
            const node = component;
            return b2`<a2ui-slider
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_K = node.weight) != null ? _K : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .value=${node.properties.value}
            .minValue=${node.properties.minValue}
            .maxValue=${node.properties.maxValue}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-slider>`;
          }
          case "TextField": {
            const node = component;
            return b2`<a2ui-textfield
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_L = node.weight) != null ? _L : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .label=${node.properties.label}
            .text=${node.properties.text}
            .textFieldType=${node.properties.textFieldType}
            .validationRegexp=${node.properties.validationRegexp}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-textfield>`;
          }
          case "Video": {
            const node = component;
            return b2`<a2ui-video
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_M = node.weight) != null ? _M : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .url=${node.properties.url}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-video>`;
          }
          case "Tabs": {
            const node = component;
            const titles = [];
            const childComponents = [];
            if (node.properties.tabItems) {
              for (const item of node.properties.tabItems) {
                titles.push(item.title);
                childComponents.push(item.child);
              }
            }
            return b2`<a2ui-tabs
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_N = node.weight) != null ? _N : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .titles=${titles}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-tabs>`;
          }
          case "Modal": {
            const node = component;
            const childComponents = [
              node.properties.entryPointChild,
              node.properties.contentChild
            ];
            node.properties.entryPointChild.slotName = "entry";
            return b2`<a2ui-modal
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${(_O = node.weight) != null ? _O : "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-modal>`;
          }
          default: {
            return this.renderCustomComponent(component);
          }
        }
      })}`;
    }
    renderCustomComponent(component) {
      var _a7, _b3;
      if (!this.enableCustomElements) {
        return;
      }
      const node = component;
      const registeredCtor = componentRegistry.get(component.type);
      const elCtor = registeredCtor || customElements.get(component.type);
      if (!elCtor) {
        return b2`Unknown element ${component.type}`;
      }
      const el = new elCtor();
      el.id = node.id;
      if (node.slotName) {
        el.slot = node.slotName;
      }
      el.component = node;
      el.weight = (_a7 = node.weight) != null ? _a7 : "initial";
      el.processor = this.processor;
      el.surfaceId = this.surfaceId;
      el.dataContextPath = (_b3 = node.dataContextPath) != null ? _b3 : "/";
      for (const [prop, val] of Object.entries(component.properties)) {
        el[prop] = val;
      }
      return b2`${el}`;
    }
    render() {
      return b2`<slot></slot>`;
    }
  }, _surfaceId_accessor_storage = new WeakMap(), _component_accessor_storage = new WeakMap(), _theme_accessor_storage = new WeakMap(), _childComponents_accessor_storage = new WeakMap(), _processor_accessor_storage = new WeakMap(), _dataContextPath_accessor_storage = new WeakMap(), _enableCustomElements_accessor_storage = new WeakMap(), _weight = new WeakMap(), _lightDomEffectDisposer = new WeakMap(), _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _surfaceId_decorators = [n4()];
    _component_decorators = [n4()];
    _theme_decorators = [c5({ context: themeContext })];
    _childComponents_decorators = [n4({ attribute: false })];
    _processor_decorators = [n4({ attribute: false })];
    _dataContextPath_decorators = [n4()];
    _enableCustomElements_decorators = [n4()];
    _set_weight_decorators = [n4()];
    __esDecorate(_b2, null, _surfaceId_decorators, { kind: "accessor", name: "surfaceId", static: false, private: false, access: { has: (obj) => "surfaceId" in obj, get: (obj) => obj.surfaceId, set: (obj, value) => {
      obj.surfaceId = value;
    } }, metadata: _metadata }, _surfaceId_initializers, _surfaceId_extraInitializers);
    __esDecorate(_b2, null, _component_decorators, { kind: "accessor", name: "component", static: false, private: false, access: { has: (obj) => "component" in obj, get: (obj) => obj.component, set: (obj, value) => {
      obj.component = value;
    } }, metadata: _metadata }, _component_initializers, _component_extraInitializers);
    __esDecorate(_b2, null, _theme_decorators, { kind: "accessor", name: "theme", static: false, private: false, access: { has: (obj) => "theme" in obj, get: (obj) => obj.theme, set: (obj, value) => {
      obj.theme = value;
    } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
    __esDecorate(_b2, null, _childComponents_decorators, { kind: "accessor", name: "childComponents", static: false, private: false, access: { has: (obj) => "childComponents" in obj, get: (obj) => obj.childComponents, set: (obj, value) => {
      obj.childComponents = value;
    } }, metadata: _metadata }, _childComponents_initializers, _childComponents_extraInitializers);
    __esDecorate(_b2, null, _processor_decorators, { kind: "accessor", name: "processor", static: false, private: false, access: { has: (obj) => "processor" in obj, get: (obj) => obj.processor, set: (obj, value) => {
      obj.processor = value;
    } }, metadata: _metadata }, _processor_initializers, _processor_extraInitializers);
    __esDecorate(_b2, null, _dataContextPath_decorators, { kind: "accessor", name: "dataContextPath", static: false, private: false, access: { has: (obj) => "dataContextPath" in obj, get: (obj) => obj.dataContextPath, set: (obj, value) => {
      obj.dataContextPath = value;
    } }, metadata: _metadata }, _dataContextPath_initializers, _dataContextPath_extraInitializers);
    __esDecorate(_b2, null, _enableCustomElements_decorators, { kind: "accessor", name: "enableCustomElements", static: false, private: false, access: { has: (obj) => "enableCustomElements" in obj, get: (obj) => obj.enableCustomElements, set: (obj, value) => {
      obj.enableCustomElements = value;
    } }, metadata: _metadata }, _enableCustomElements_initializers, _enableCustomElements_extraInitializers);
    __esDecorate(_b2, null, _set_weight_decorators, { kind: "setter", name: "weight", static: false, private: false, access: { has: (obj) => "weight" in obj, set: (obj, value) => {
      obj.weight = value;
    } }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Root2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 80%;
      }
    `
  ], __runInitializers(_classThis, _classExtraInitializers), _b2);
  return Root2 = _classThis;
})();

// ../../node_modules/lit-html/directives/class-map.js
var e9 = e7(class extends i6 {
  constructor(t7) {
    var _a7;
    if (super(t7), t7.type !== t4.ATTRIBUTE || "class" !== t7.name || ((_a7 = t7.strings) == null ? void 0 : _a7.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t7) {
    return " " + Object.keys(t7 || {}).filter((s11) => t7[s11]).join(" ") + " ";
  }
  update(s11, [i11]) {
    var _a7, _b2;
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s11.strings && (this.nt = new Set(s11.strings.join(" ").split(/\s/).filter((t7) => "" !== t7)));
      for (const t7 in i11) i11[t7] && !((_a7 = this.nt) == null ? void 0 : _a7.has(t7)) && this.st.add(t7);
      return this.render(i11);
    }
    const r9 = s11.element.classList;
    for (const t7 of this.st) t7 in i11 || (r9.remove(t7), this.st.delete(t7));
    for (const t7 in i11) {
      const s12 = !!i11[t7];
      s12 === this.st.has(t7) || ((_b2 = this.nt) == null ? void 0 : _b2.has(t7)) || (s12 ? (r9.add(t7), this.st.add(t7)) : (r9.remove(t7), this.st.delete(t7)));
    }
    return E;
  }
});

// ../../node_modules/lit-html/directives/style-map.js
var n8 = "important";
var i9 = " !" + n8;
var o10 = e7(class extends i6 {
  constructor(t7) {
    var _a7;
    if (super(t7), t7.type !== t4.ATTRIBUTE || "style" !== t7.name || ((_a7 = t7.strings) == null ? void 0 : _a7.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t7) {
    return Object.keys(t7 || {}).reduce((e11, r9) => {
      const s11 = t7[r9];
      return null == s11 ? e11 : e11 + `${r9 = r9.includes("-") ? r9 : r9.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s11};`;
    }, "");
  }
  update(e11, [r9]) {
    const { style: s11 } = e11.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r9 || {})), this.render(r9);
    for (const t7 of this.ft) null == r9[t7] && (this.ft.delete(t7), t7.includes("-") ? s11.removeProperty(t7) : s11[t7] = null);
    for (const t7 in r9) {
      const e12 = r9[t7];
      if (null != e12) {
        this.ft.add(t7);
        const r10 = "string" == typeof e12 && e12.endsWith(i9);
        t7.includes("-") || r10 ? s11.setProperty(t7, r10 ? e12.slice(0, -11) : e12, r10 ? n8 : "") : s11[t7] = e12;
      }
    }
    return E;
  }
});

// ../../node_modules/@a2ui/lit/src/0.8/ui/audio.js
var __esDecorate2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers2 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Audio = (() => {
  var _a7, _url_accessor_storage, __this_instances, renderAudio_fn, _b2;
  let _classDecorators = [t3("a2ui-audioplayer")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _url_decorators;
  let _url_initializers = [];
  let _url_extraInitializers = [];
  var Audio2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _url_accessor_storage, __runInitializers2(this, _url_initializers, null));
      __runInitializers2(this, _url_extraInitializers);
    }
    get url() {
      return __privateGet(this, _url_accessor_storage);
    }
    set url(value) {
      __privateSet(this, _url_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.AudioPlayer)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.AudioPlayer) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.AudioPlayer) : A}
    >
      ${__privateMethod(this, __this_instances, renderAudio_fn).call(this)}
    </section>`;
    }
  }, _url_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderAudio_fn = function() {
    var _a7;
    if (!this.url) {
      return A;
    }
    if (this.url && typeof this.url === "object") {
      if ("literalString" in this.url) {
        return b2`<audio controls src=${this.url.literalString} />`;
      } else if ("literal" in this.url) {
        return b2`<audio controls src=${this.url.literal} />`;
      } else if (this.url && "path" in this.url && this.url.path) {
        if (!this.processor || !this.component) {
          return b2`(no processor)`;
        }
        const audioUrl = this.processor.getData(this.component, this.url.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (!audioUrl) {
          return b2`Invalid audio URL`;
        }
        if (typeof audioUrl !== "string") {
          return b2`Invalid audio URL`;
        }
        return b2`<audio controls src=${audioUrl} />`;
      }
    }
    return b2`(empty)`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _url_decorators = [n4()];
    __esDecorate2(_b2, null, _url_decorators, { kind: "accessor", name: "url", static: false, private: false, access: { has: (obj) => "url" in obj, get: (obj) => obj.url, set: (obj, value) => {
      obj.url = value;
    } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
    __esDecorate2(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Audio2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      audio {
        display: block;
        width: 100%;
      }
    `
  ], __runInitializers2(_classThis, _classExtraInitializers), _b2);
  return Audio2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/button.js
var __esDecorate3 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers3 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Button = (() => {
  var _a7, _action_accessor_storage, _primary_accessor_storage, _b2;
  let _classDecorators = [t3("a2ui-button")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _action_decorators;
  let _action_initializers = [];
  let _action_extraInitializers = [];
  let _primary_decorators;
  let _primary_initializers = [];
  let _primary_extraInitializers = [];
  var Button2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, _action_accessor_storage, __runInitializers3(this, _action_initializers, null));
      __privateAdd(this, _primary_accessor_storage, (__runInitializers3(this, _action_extraInitializers), __runInitializers3(this, _primary_initializers, false)));
      __runInitializers3(this, _primary_extraInitializers);
    }
    get action() {
      return __privateGet(this, _action_accessor_storage);
    }
    set action(value) {
      __privateSet(this, _action_accessor_storage, value);
    }
    get primary() {
      return __privateGet(this, _primary_accessor_storage);
    }
    set primary(value) {
      __privateSet(this, _primary_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<button
      class=${e9(this.theme.components.Button)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Button) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Button) : A}
      @click=${() => {
        if (!this.action) {
          return;
        }
        const evt = new StateEvent({
          eventType: "a2ui.action",
          action: this.action,
          dataContextPath: this.dataContextPath,
          sourceComponentId: this.id,
          sourceComponent: this.component
        });
        this.dispatchEvent(evt);
      }}
    >
      <slot></slot>
    </button>`;
    }
  }, _action_accessor_storage = new WeakMap(), _primary_accessor_storage = new WeakMap(), _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _action_decorators = [n4()];
    _primary_decorators = [n4()];
    __esDecorate3(_b2, null, _action_decorators, { kind: "accessor", name: "action", static: false, private: false, access: { has: (obj) => "action" in obj, get: (obj) => obj.action, set: (obj, value) => {
      obj.action = value;
    } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
    __esDecorate3(_b2, null, _primary_decorators, { kind: "accessor", name: "primary", static: false, private: false, access: { has: (obj) => "primary" in obj, get: (obj) => obj.primary, set: (obj, value) => {
      obj.primary = value;
    } }, metadata: _metadata }, _primary_initializers, _primary_extraInitializers);
    __esDecorate3(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Button2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
      }
    `
  ], __runInitializers3(_classThis, _classExtraInitializers), _b2);
  return Button2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/card.js
var __esDecorate4 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers4 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Card = (() => {
  var _a7, _b2;
  let _classDecorators = [t3("a2ui-card")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  var Card2 = (_b2 = class extends _classSuper {
    render() {
      var _a7, _b3;
      return b2` <section
      class=${e9(this.theme.components.Card)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Card) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Card) : A}
    >
      <slot></slot>
    </section>`;
    }
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    __esDecorate4(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Card2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      section {
        height: 100%;
        width: 100%;
        min-height: 0;
        overflow: auto;

        ::slotted(*) {
          height: 100%;
          width: 100%;
        }
      }
    `
  ], __runInitializers4(_classThis, _classExtraInitializers), _b2);
  return Card2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/utils/utils.js
var utils_exports = {};
__export(utils_exports, {
  extractNumberValue: () => extractNumberValue,
  extractStringValue: () => extractStringValue
});
function extractStringValue(val, component, processor, surfaceId) {
  var _a7, _b2;
  if (val !== null && typeof val === "object") {
    if ("literalString" in val) {
      return (_a7 = val.literalString) != null ? _a7 : "";
    } else if ("literal" in val && val.literal !== void 0) {
      return (_b2 = val.literal) != null ? _b2 : "";
    } else if (val && "path" in val && val.path) {
      if (!processor || !component) {
        return "(no model)";
      }
      const textValue = processor.getData(component, val.path, surfaceId != null ? surfaceId : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
      if (textValue === null || typeof textValue !== "string") {
        return "";
      }
      return textValue;
    }
  }
  return "";
}
function extractNumberValue(val, component, processor, surfaceId) {
  var _a7, _b2;
  if (val !== null && typeof val === "object") {
    if ("literalNumber" in val) {
      return (_a7 = val.literalNumber) != null ? _a7 : 0;
    } else if ("literal" in val && val.literal !== void 0) {
      return (_b2 = val.literal) != null ? _b2 : 0;
    } else if (val && "path" in val && val.path) {
      if (!processor || !component) {
        return -1;
      }
      let numberValue = processor.getData(component, val.path, surfaceId != null ? surfaceId : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
      if (typeof numberValue === "string") {
        numberValue = Number.parseInt(numberValue, 10);
        if (Number.isNaN(numberValue)) {
          numberValue = null;
        }
      }
      if (numberValue === null || typeof numberValue !== "number") {
        return -1;
      }
      return numberValue;
    }
  }
  return 0;
}

// ../../node_modules/@a2ui/lit/src/0.8/ui/checkbox.js
var __esDecorate5 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers5 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Checkbox = (() => {
  var _a7, _value_accessor_storage, _label_accessor_storage, __this_instances, setBoundValue_fn, renderField_fn, _b2;
  let _classDecorators = [t3("a2ui-checkbox")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _value_decorators;
  let _value_initializers = [];
  let _value_extraInitializers = [];
  let _label_decorators;
  let _label_initializers = [];
  let _label_extraInitializers = [];
  var Checkbox2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _value_accessor_storage, __runInitializers5(this, _value_initializers, null));
      __privateAdd(this, _label_accessor_storage, (__runInitializers5(this, _value_extraInitializers), __runInitializers5(this, _label_initializers, null)));
      __runInitializers5(this, _label_extraInitializers);
    }
    get value() {
      return __privateGet(this, _value_accessor_storage);
    }
    set value(value) {
      __privateSet(this, _value_accessor_storage, value);
    }
    get label() {
      return __privateGet(this, _label_accessor_storage);
    }
    set label(value) {
      __privateSet(this, _label_accessor_storage, value);
    }
    render() {
      var _a7;
      if (this.value && typeof this.value === "object") {
        if ("literalBoolean" in this.value && this.value.literalBoolean) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literalBoolean);
        } else if ("literal" in this.value && this.value.literal !== void 0) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literal);
        } else if (this.value && "path" in this.value && this.value.path) {
          if (!this.processor || !this.component) {
            return b2`(no model)`;
          }
          const textValue = this.processor.getData(this.component, this.value.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
          if (textValue === null) {
            return b2`Invalid label`;
          }
          if (typeof textValue !== "boolean") {
            return b2`Invalid label`;
          }
          return __privateMethod(this, __this_instances, renderField_fn).call(this, textValue);
        }
      }
      return A;
    }
  }, _value_accessor_storage = new WeakMap(), _label_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), setBoundValue_fn = function(value) {
    var _a7;
    if (!this.value || !this.processor) {
      return;
    }
    if (!("path" in this.value)) {
      return;
    }
    if (!this.value.path) {
      return;
    }
    this.processor.setData(this.component, this.value.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
  }, renderField_fn = function(value) {
    var _a7, _b3;
    return b2` <section
      class=${e9(this.theme.components.CheckBox.container)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.CheckBox) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.CheckBox) : A}
    >
      <input
        class=${e9(this.theme.components.CheckBox.element)}
        autocomplete="off"
        @input=${(evt) => {
      if (!(evt.target instanceof HTMLInputElement)) {
        return;
      }
      __privateMethod(this, __this_instances, setBoundValue_fn).call(this, evt.target.checked);
    }}
        id="data"
        type="checkbox"
        .checked=${value}
      />
      <label class=${e9(this.theme.components.CheckBox.label)} for="data"
        >${extractStringValue(this.label, this.component, this.processor, this.surfaceId)}</label
      >
    </section>`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _value_decorators = [n4()];
    _label_decorators = [n4()];
    __esDecorate5(_b2, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: (obj) => "value" in obj, get: (obj) => obj.value, set: (obj, value) => {
      obj.value = value;
    } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
    __esDecorate5(_b2, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: (obj) => "label" in obj, get: (obj) => obj.label, set: (obj, value) => {
      obj.label = value;
    } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
    __esDecorate5(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Checkbox2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      input {
        display: block;
        width: 100%;
      }

      .description {
        font-size: 14px;
        margin-bottom: 4px;
      }
    `
  ], __runInitializers5(_classThis, _classExtraInitializers), _b2);
  return Checkbox2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/column.js
var __esDecorate6 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers6 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Column = (() => {
  var _a7, _alignment_accessor_storage, _distribution_accessor_storage, _b2;
  let _classDecorators = [t3("a2ui-column")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _alignment_decorators;
  let _alignment_initializers = [];
  let _alignment_extraInitializers = [];
  let _distribution_decorators;
  let _distribution_initializers = [];
  let _distribution_extraInitializers = [];
  var Column2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, _alignment_accessor_storage, __runInitializers6(this, _alignment_initializers, "stretch"));
      __privateAdd(this, _distribution_accessor_storage, (__runInitializers6(this, _alignment_extraInitializers), __runInitializers6(this, _distribution_initializers, "start")));
      __runInitializers6(this, _distribution_extraInitializers);
    }
    get alignment() {
      return __privateGet(this, _alignment_accessor_storage);
    }
    set alignment(value) {
      __privateSet(this, _alignment_accessor_storage, value);
    }
    get distribution() {
      return __privateGet(this, _distribution_accessor_storage);
    }
    set distribution(value) {
      __privateSet(this, _distribution_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.Column)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Column) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Column) : A}
    >
      <slot></slot>
    </section>`;
    }
  }, _alignment_accessor_storage = new WeakMap(), _distribution_accessor_storage = new WeakMap(), _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _alignment_decorators = [n4({ reflect: true, type: String })];
    _distribution_decorators = [n4({ reflect: true, type: String })];
    __esDecorate6(_b2, null, _alignment_decorators, { kind: "accessor", name: "alignment", static: false, private: false, access: { has: (obj) => "alignment" in obj, get: (obj) => obj.alignment, set: (obj, value) => {
      obj.alignment = value;
    } }, metadata: _metadata }, _alignment_initializers, _alignment_extraInitializers);
    __esDecorate6(_b2, null, _distribution_decorators, { kind: "accessor", name: "distribution", static: false, private: false, access: { has: (obj) => "distribution" in obj, get: (obj) => obj.distribution, set: (obj, value) => {
      obj.distribution = value;
    } }, metadata: _metadata }, _distribution_initializers, _distribution_extraInitializers);
    __esDecorate6(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Column2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      section {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        height: 100%;
      }

      :host([alignment="start"]) section {
        align-items: start;
      }

      :host([alignment="center"]) section {
        align-items: center;
      }

      :host([alignment="end"]) section {
        align-items: end;
      }

      :host([alignment="stretch"]) section {
        align-items: stretch;
      }

      :host([distribution="start"]) section {
        justify-content: start;
      }

      :host([distribution="center"]) section {
        justify-content: center;
      }

      :host([distribution="end"]) section {
        justify-content: end;
      }

      :host([distribution="spaceBetween"]) section {
        justify-content: space-between;
      }

      :host([distribution="spaceAround"]) section {
        justify-content: space-around;
      }

      :host([distribution="spaceEvenly"]) section {
        justify-content: space-evenly;
      }
    `
  ], __runInitializers6(_classThis, _classExtraInitializers), _b2);
  return Column2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/datetime-input.js
var __esDecorate7 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers7 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var DateTimeInput = (() => {
  var _a7, _value_accessor_storage, _label_accessor_storage, _enableDate_accessor_storage, _enableTime_accessor_storage, __this_instances, setBoundValue_fn, renderField_fn, getInputType_fn, formatInputValue_fn, padNumber_fn, getPlaceholderText_fn, _b2;
  let _classDecorators = [t3("a2ui-datetimeinput")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _value_decorators;
  let _value_initializers = [];
  let _value_extraInitializers = [];
  let _label_decorators;
  let _label_initializers = [];
  let _label_extraInitializers = [];
  let _enableDate_decorators;
  let _enableDate_initializers = [];
  let _enableDate_extraInitializers = [];
  let _enableTime_decorators;
  let _enableTime_initializers = [];
  let _enableTime_extraInitializers = [];
  var DateTimeInput2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _value_accessor_storage, __runInitializers7(this, _value_initializers, null));
      __privateAdd(this, _label_accessor_storage, (__runInitializers7(this, _value_extraInitializers), __runInitializers7(this, _label_initializers, null)));
      __privateAdd(this, _enableDate_accessor_storage, (__runInitializers7(this, _label_extraInitializers), __runInitializers7(this, _enableDate_initializers, true)));
      __privateAdd(this, _enableTime_accessor_storage, (__runInitializers7(this, _enableDate_extraInitializers), __runInitializers7(this, _enableTime_initializers, true)));
      __runInitializers7(this, _enableTime_extraInitializers);
    }
    get value() {
      return __privateGet(this, _value_accessor_storage);
    }
    set value(value) {
      __privateSet(this, _value_accessor_storage, value);
    }
    get label() {
      return __privateGet(this, _label_accessor_storage);
    }
    set label(value) {
      __privateSet(this, _label_accessor_storage, value);
    }
    get enableDate() {
      return __privateGet(this, _enableDate_accessor_storage);
    }
    set enableDate(value) {
      __privateSet(this, _enableDate_accessor_storage, value);
    }
    get enableTime() {
      return __privateGet(this, _enableTime_accessor_storage);
    }
    set enableTime(value) {
      __privateSet(this, _enableTime_accessor_storage, value);
    }
    render() {
      var _a7;
      if (this.value && typeof this.value === "object") {
        if ("literalString" in this.value && this.value.literalString) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literalString);
        } else if ("literal" in this.value && this.value.literal !== void 0) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literal);
        } else if (this.value && "path" in this.value && this.value.path) {
          if (!this.processor || !this.component) {
            return b2`(no model)`;
          }
          const textValue = this.processor.getData(this.component, this.value.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
          if (typeof textValue !== "string") {
            return b2`(invalid)`;
          }
          return __privateMethod(this, __this_instances, renderField_fn).call(this, textValue);
        }
      }
      return A;
    }
  }, _value_accessor_storage = new WeakMap(), _label_accessor_storage = new WeakMap(), _enableDate_accessor_storage = new WeakMap(), _enableTime_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), setBoundValue_fn = function(value) {
    var _a7;
    if (!this.value || !this.processor) {
      return;
    }
    if (!("path" in this.value)) {
      return;
    }
    if (!this.value.path) {
      return;
    }
    this.processor.setData(this.component, this.value.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
  }, renderField_fn = function(value) {
    var _a7, _b3;
    return b2`<section
      class=${e9(this.theme.components.DateTimeInput.container)}
    >
      <label
        for="data"
        class=${e9(this.theme.components.DateTimeInput.label)}
        >${__privateMethod(this, __this_instances, getPlaceholderText_fn).call(this)}</label
      >
      <input
        autocomplete="off"
        class=${e9(this.theme.components.DateTimeInput.element)}
        style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.DateTimeInput) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.DateTimeInput) : A}
        @input=${(evt) => {
      if (!(evt.target instanceof HTMLInputElement)) {
        return;
      }
      __privateMethod(this, __this_instances, setBoundValue_fn).call(this, evt.target.value);
    }}
        id="data"
        name="data"
        .value=${__privateMethod(this, __this_instances, formatInputValue_fn).call(this, value)}
        .placeholder=${__privateMethod(this, __this_instances, getPlaceholderText_fn).call(this)}
        .type=${__privateMethod(this, __this_instances, getInputType_fn).call(this)}
      />
    </section>`;
  }, getInputType_fn = function() {
    if (this.enableDate && this.enableTime) {
      return "datetime-local";
    } else if (this.enableDate) {
      return "date";
    } else if (this.enableTime) {
      return "time";
    }
    return "datetime-local";
  }, formatInputValue_fn = function(value) {
    const inputType = __privateMethod(this, __this_instances, getInputType_fn).call(this);
    const date = value ? new Date(value) : null;
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    const year = __privateMethod(this, __this_instances, padNumber_fn).call(this, date.getFullYear());
    const month = __privateMethod(this, __this_instances, padNumber_fn).call(this, date.getMonth() + 1);
    const day = __privateMethod(this, __this_instances, padNumber_fn).call(this, date.getDate());
    const hours = __privateMethod(this, __this_instances, padNumber_fn).call(this, date.getHours());
    const minutes = __privateMethod(this, __this_instances, padNumber_fn).call(this, date.getMinutes());
    if (inputType === "date") {
      return `${year}-${month}-${day}`;
    } else if (inputType === "time") {
      return `${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, padNumber_fn = function(value) {
    return value.toString().padStart(2, "0");
  }, getPlaceholderText_fn = function() {
    const inputType = __privateMethod(this, __this_instances, getInputType_fn).call(this);
    if (inputType === "date") {
      return "Date";
    } else if (inputType === "time") {
      return "Time";
    }
    return "Date & Time";
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _value_decorators = [n4()];
    _label_decorators = [n4()];
    _enableDate_decorators = [n4({ reflect: false, type: Boolean })];
    _enableTime_decorators = [n4({ reflect: false, type: Boolean })];
    __esDecorate7(_b2, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: (obj) => "value" in obj, get: (obj) => obj.value, set: (obj, value) => {
      obj.value = value;
    } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
    __esDecorate7(_b2, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: (obj) => "label" in obj, get: (obj) => obj.label, set: (obj, value) => {
      obj.label = value;
    } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
    __esDecorate7(_b2, null, _enableDate_decorators, { kind: "accessor", name: "enableDate", static: false, private: false, access: { has: (obj) => "enableDate" in obj, get: (obj) => obj.enableDate, set: (obj, value) => {
      obj.enableDate = value;
    } }, metadata: _metadata }, _enableDate_initializers, _enableDate_extraInitializers);
    __esDecorate7(_b2, null, _enableTime_decorators, { kind: "accessor", name: "enableTime", static: false, private: false, access: { has: (obj) => "enableTime" in obj, get: (obj) => obj.enableTime, set: (obj, value) => {
      obj.enableTime = value;
    } }, metadata: _metadata }, _enableTime_initializers, _enableTime_extraInitializers);
    __esDecorate7(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    DateTimeInput2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      input {
        display: block;
        border-radius: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        width: 100%;
      }
    `
  ], __runInitializers7(_classThis, _classExtraInitializers), _b2);
  return DateTimeInput2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/divider.js
var __esDecorate8 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers8 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Divider = (() => {
  var _a7, _b2;
  let _classDecorators = [t3("a2ui-divider")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  var Divider2 = (_b2 = class extends _classSuper {
    render() {
      var _a7, _b3;
      return b2`<hr
      class=${e9(this.theme.components.Divider)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Divider) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Divider) : A}
    />`;
    }
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    __esDecorate8(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Divider2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      :host {
        display: block;
        min-height: 0;
        overflow: auto;
      }

      hr {
        height: 1px;
        background: #ccc;
        border: none;
      }
    `
  ], __runInitializers8(_classThis, _classExtraInitializers), _b2);
  return Divider2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/icon.js
var __esDecorate9 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers9 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Icon = (() => {
  var _a7, _name_accessor_storage, __this_instances, renderIcon_fn, _b2;
  let _classDecorators = [t3("a2ui-icon")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _name_decorators;
  let _name_initializers = [];
  let _name_extraInitializers = [];
  var Icon2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _name_accessor_storage, __runInitializers9(this, _name_initializers, null));
      __runInitializers9(this, _name_extraInitializers);
    }
    get name() {
      return __privateGet(this, _name_accessor_storage);
    }
    set name(value) {
      __privateSet(this, _name_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.Icon)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Icon) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Icon) : A}
    >
      ${__privateMethod(this, __this_instances, renderIcon_fn).call(this)}
    </section>`;
    }
  }, _name_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderIcon_fn = function() {
    var _a7, _b3, _c;
    if (!this.name) {
      return A;
    }
    const render = (url) => {
      url = url.replace(/([A-Z])/gm, "_$1").toLocaleLowerCase();
      return b2`<span class="g-icon">${url}</span>`;
    };
    if (this.name && typeof this.name === "object") {
      if ("literalString" in this.name) {
        const iconName = (_a7 = this.name.literalString) != null ? _a7 : "";
        return render(iconName);
      } else if ("literal" in this.name) {
        const iconName = (_b3 = this.name.literal) != null ? _b3 : "";
        return render(iconName);
      } else if (this.name && "path" in this.name && this.name.path) {
        if (!this.processor || !this.component) {
          return b2`(no model)`;
        }
        const iconName = this.processor.getData(this.component, this.name.path, (_c = this.surfaceId) != null ? _c : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (!iconName) {
          return b2`Invalid icon name`;
        }
        if (typeof iconName !== "string") {
          return b2`Invalid icon name`;
        }
        return render(iconName);
      }
    }
    return b2`(empty)`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _name_decorators = [n4()];
    __esDecorate9(_b2, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: (obj) => "name" in obj, get: (obj) => obj.name, set: (obj, value) => {
      obj.name = value;
    } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
    __esDecorate9(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Icon2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;

      }

      .g-icon {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      }
    `
  ], __runInitializers9(_classThis, _classExtraInitializers), _b2);
  return Icon2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/image.js
var __esDecorate10 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers10 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Image = (() => {
  var _a7, _url_accessor_storage, _altText_accessor_storage, _usageHint_accessor_storage, _fit_accessor_storage, __this_instances, renderImage_fn, _b2;
  let _classDecorators = [t3("a2ui-image")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _url_decorators;
  let _url_initializers = [];
  let _url_extraInitializers = [];
  let _altText_decorators;
  let _altText_initializers = [];
  let _altText_extraInitializers = [];
  let _usageHint_decorators;
  let _usageHint_initializers = [];
  let _usageHint_extraInitializers = [];
  let _fit_decorators;
  let _fit_initializers = [];
  let _fit_extraInitializers = [];
  var Image2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _url_accessor_storage, __runInitializers10(this, _url_initializers, null));
      __privateAdd(this, _altText_accessor_storage, (__runInitializers10(this, _url_extraInitializers), __runInitializers10(this, _altText_initializers, null)));
      __privateAdd(this, _usageHint_accessor_storage, (__runInitializers10(this, _altText_extraInitializers), __runInitializers10(this, _usageHint_initializers, null)));
      __privateAdd(this, _fit_accessor_storage, (__runInitializers10(this, _usageHint_extraInitializers), __runInitializers10(this, _fit_initializers, null)));
      __runInitializers10(this, _fit_extraInitializers);
    }
    get url() {
      return __privateGet(this, _url_accessor_storage);
    }
    set url(value) {
      __privateSet(this, _url_accessor_storage, value);
    }
    get altText() {
      return __privateGet(this, _altText_accessor_storage);
    }
    set altText(value) {
      __privateSet(this, _altText_accessor_storage, value);
    }
    get usageHint() {
      return __privateGet(this, _usageHint_accessor_storage);
    }
    set usageHint(value) {
      __privateSet(this, _usageHint_accessor_storage, value);
    }
    get fit() {
      return __privateGet(this, _fit_accessor_storage);
    }
    set fit(value) {
      __privateSet(this, _fit_accessor_storage, value);
    }
    render() {
      var _a7, _b3, _c;
      const classes = styles_exports.merge(this.theme.components.Image.all, this.usageHint ? this.theme.components.Image[this.usageHint] : {});
      return b2`<section
      class=${e9(classes)}
      style=${o10({
        ...(_b3 = (_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Image) != null ? _b3 : {},
        "--object-fit": (_c = this.fit) != null ? _c : "fill"
      })}
    >
      ${__privateMethod(this, __this_instances, renderImage_fn).call(this)}
    </section>`;
    }
  }, _url_accessor_storage = new WeakMap(), _altText_accessor_storage = new WeakMap(), _usageHint_accessor_storage = new WeakMap(), _fit_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderImage_fn = function() {
    var _a7, _b3, _c;
    if (!this.url) {
      return A;
    }
    const render = (url) => {
      var _a8, _b4, _c2;
      let resolvedAlt = "";
      if (this.altText) {
        if (typeof this.altText === "object") {
          if ("literalString" in this.altText) {
            resolvedAlt = (_a8 = this.altText.literalString) != null ? _a8 : "";
          } else if ("literal" in this.altText) {
            resolvedAlt = (_b4 = this.altText.literal) != null ? _b4 : "";
          } else if ("path" in this.altText && this.altText.path) {
            if (this.processor && this.component) {
              const data = this.processor.getData(this.component, this.altText.path, (_c2 = this.surfaceId) != null ? _c2 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
              if (typeof data === "string") {
                resolvedAlt = data;
              }
            }
          }
        }
      }
      return b2`<img src=${url} alt=${resolvedAlt} />`;
    };
    if (this.url && typeof this.url === "object") {
      if ("literalString" in this.url) {
        const imageUrl = (_a7 = this.url.literalString) != null ? _a7 : "";
        return render(imageUrl);
      } else if ("literal" in this.url) {
        const imageUrl = (_b3 = this.url.literal) != null ? _b3 : "";
        return render(imageUrl);
      } else if (this.url && "path" in this.url && this.url.path) {
        if (!this.processor || !this.component) {
          return b2`(no model)`;
        }
        const imageUrl = this.processor.getData(this.component, this.url.path, (_c = this.surfaceId) != null ? _c : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (!imageUrl) {
          return b2`Invalid image URL`;
        }
        if (typeof imageUrl !== "string") {
          return b2`Invalid image URL`;
        }
        return render(imageUrl);
      }
    }
    return b2`(empty)`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _url_decorators = [n4()];
    _altText_decorators = [n4()];
    _usageHint_decorators = [n4()];
    _fit_decorators = [n4()];
    __esDecorate10(_b2, null, _url_decorators, { kind: "accessor", name: "url", static: false, private: false, access: { has: (obj) => "url" in obj, get: (obj) => obj.url, set: (obj, value) => {
      obj.url = value;
    } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
    __esDecorate10(_b2, null, _altText_decorators, { kind: "accessor", name: "altText", static: false, private: false, access: { has: (obj) => "altText" in obj, get: (obj) => obj.altText, set: (obj, value) => {
      obj.altText = value;
    } }, metadata: _metadata }, _altText_initializers, _altText_extraInitializers);
    __esDecorate10(_b2, null, _usageHint_decorators, { kind: "accessor", name: "usageHint", static: false, private: false, access: { has: (obj) => "usageHint" in obj, get: (obj) => obj.usageHint, set: (obj, value) => {
      obj.usageHint = value;
    } }, metadata: _metadata }, _usageHint_initializers, _usageHint_extraInitializers);
    __esDecorate10(_b2, null, _fit_decorators, { kind: "accessor", name: "fit", static: false, private: false, access: { has: (obj) => "fit" in obj, get: (obj) => obj.fit, set: (obj, value) => {
      obj.fit = value;
    } }, metadata: _metadata }, _fit_initializers, _fit_extraInitializers);
    __esDecorate10(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Image2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--object-fit, fill);
      }
    `
  ], __runInitializers10(_classThis, _classExtraInitializers), _b2);
  return Image2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/list.js
var __esDecorate11 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers11 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var List = (() => {
  var _a7, _direction_accessor_storage, _b2;
  let _classDecorators = [t3("a2ui-list")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _direction_decorators;
  let _direction_initializers = [];
  let _direction_extraInitializers = [];
  var List2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, _direction_accessor_storage, __runInitializers11(this, _direction_initializers, "vertical"));
      __runInitializers11(this, _direction_extraInitializers);
    }
    get direction() {
      return __privateGet(this, _direction_accessor_storage);
    }
    set direction(value) {
      __privateSet(this, _direction_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.List)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.List) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.List) : A}
    >
      <slot></slot>
    </section>`;
    }
  }, _direction_accessor_storage = new WeakMap(), _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _direction_decorators = [n4({ reflect: true, type: String })];
    __esDecorate11(_b2, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: (obj) => "direction" in obj, get: (obj) => obj.direction, set: (obj, value) => {
      obj.direction = value;
    } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
    __esDecorate11(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    List2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      :host([direction="vertical"]) section {
        display: grid;
      }

      :host([direction="horizontal"]) section {
        display: flex;
        max-width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        scrollbar-width: none;

        > ::slotted(*) {
          flex: 1 0 fit-content;
          max-width: min(80%, 400px);
        }
      }
    `
  ], __runInitializers11(_classThis, _classExtraInitializers), _b2);
  return List2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/multiple-choice.js
var __esDecorate12 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers12 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var MultipleChoice = (() => {
  var _a7, _description_accessor_storage, _options_accessor_storage, _selections_accessor_storage, _variant_accessor_storage, _filterable_accessor_storage, _isOpen_accessor_storage, _filterText_accessor_storage, __this_instances, setBoundValue_fn, renderCheckIcon_fn, renderFilter_fn, _b2;
  let _classDecorators = [t3("a2ui-multiplechoice")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _description_decorators;
  let _description_initializers = [];
  let _description_extraInitializers = [];
  let _options_decorators;
  let _options_initializers = [];
  let _options_extraInitializers = [];
  let _selections_decorators;
  let _selections_initializers = [];
  let _selections_extraInitializers = [];
  let _variant_decorators;
  let _variant_initializers = [];
  let _variant_extraInitializers = [];
  let _filterable_decorators;
  let _filterable_initializers = [];
  let _filterable_extraInitializers = [];
  let _isOpen_decorators;
  let _isOpen_initializers = [];
  let _isOpen_extraInitializers = [];
  let _filterText_decorators;
  let _filterText_initializers = [];
  let _filterText_extraInitializers = [];
  var MultipleChoice2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _description_accessor_storage, __runInitializers12(this, _description_initializers, null));
      __privateAdd(this, _options_accessor_storage, (__runInitializers12(this, _description_extraInitializers), __runInitializers12(this, _options_initializers, [])));
      __privateAdd(this, _selections_accessor_storage, (__runInitializers12(this, _options_extraInitializers), __runInitializers12(this, _selections_initializers, [])));
      __privateAdd(this, _variant_accessor_storage, (__runInitializers12(this, _selections_extraInitializers), __runInitializers12(this, _variant_initializers, "checkbox")));
      __privateAdd(this, _filterable_accessor_storage, (__runInitializers12(this, _variant_extraInitializers), __runInitializers12(this, _filterable_initializers, false)));
      __privateAdd(this, _isOpen_accessor_storage, (__runInitializers12(this, _filterable_extraInitializers), __runInitializers12(this, _isOpen_initializers, false)));
      __privateAdd(this, _filterText_accessor_storage, (__runInitializers12(this, _isOpen_extraInitializers), __runInitializers12(this, _filterText_initializers, "")));
      __runInitializers12(this, _filterText_extraInitializers);
    }
    get description() {
      return __privateGet(this, _description_accessor_storage);
    }
    set description(value) {
      __privateSet(this, _description_accessor_storage, value);
    }
    get options() {
      return __privateGet(this, _options_accessor_storage);
    }
    set options(value) {
      __privateSet(this, _options_accessor_storage, value);
    }
    get selections() {
      return __privateGet(this, _selections_accessor_storage);
    }
    set selections(value) {
      __privateSet(this, _selections_accessor_storage, value);
    }
    get variant() {
      return __privateGet(this, _variant_accessor_storage);
    }
    set variant(value) {
      __privateSet(this, _variant_accessor_storage, value);
    }
    get filterable() {
      return __privateGet(this, _filterable_accessor_storage);
    }
    set filterable(value) {
      __privateSet(this, _filterable_accessor_storage, value);
    }
    get isOpen() {
      return __privateGet(this, _isOpen_accessor_storage);
    }
    set isOpen(value) {
      __privateSet(this, _isOpen_accessor_storage, value);
    }
    get filterText() {
      return __privateGet(this, _filterText_accessor_storage);
    }
    set filterText(value) {
      __privateSet(this, _filterText_accessor_storage, value);
    }
    getCurrentSelections() {
      var _a7;
      if (Array.isArray(this.selections)) {
        return this.selections;
      }
      if (!this.processor || !this.component) {
        return [];
      }
      const selectionValue = this.processor.getData(this.component, this.selections.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID); __a2uiDebugLog("getCurrentSelections raw", { path: this.selections.path, selectionValue });
      return Array.isArray(selectionValue) ? selectionValue : [];
    }
    toggleSelection(value) {
      const current = this.getCurrentSelections();
      const limit = Number(this.maxAllowedSelections);
      const hasLimit = Number.isFinite(limit) && limit > 0;
      const isSingleSelect = hasLimit && limit === 1;
      __a2uiDebugLog("toggleSelection before", {
        path: this.selections && this.selections.path,
        current,
        nextValue: value,
        maxAllowedSelections: this.maxAllowedSelections,
        isSingleSelect,
        hasLimit
      });
      if (current.includes(value)) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, current.filter((v3) => v3 !== value));
      } else if (isSingleSelect) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [value]);
      } else if (hasLimit && current.length >= limit) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [...current.slice(0, limit - 1), value]);
      } else {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [...current, value]);
      }
      __a2uiDebugLog("toggleSelection after", {
        path: this.selections && this.selections.path,
        currentAfter: this.getCurrentSelections()
      });
      this.requestUpdate();
    }
    render() {
      var _a7;
      const currentSelections = this.getCurrentSelections();
      const filteredOptions = this.options.filter((option) => {
        if (!this.filterText)
          return true;
        const label = extractStringValue(option.label, this.component, this.processor, this.surfaceId);
        return label.toLowerCase().includes(this.filterText.toLowerCase());
      });
      if (this.variant === "chips") {
        return b2`
          <div class="container">
            ${this.description ? b2`<div class="header-text" style="margin-bottom: 8px;">${this.description}</div>` : A}
            ${this.filterable ? __privateMethod(this, __this_instances, renderFilter_fn).call(this) : A}
            <div class="chips-container">
              ${filteredOptions.map((option) => {
          const label = extractStringValue(option.label, this.component, this.processor, this.surfaceId);
          const isSelected = currentSelections.includes(option.value);
          return b2`
                  <div
                    class="chip ${isSelected ? "selected" : ""}"
                    @click=${(e11) => {
            e11.stopPropagation();
            this.toggleSelection(option.value);
          }}
                  >
                    ${isSelected ? __privateMethod(this, __this_instances, renderCheckIcon_fn).call(this) : A}
                    <span>${label}</span>
                  </div>
                `;
        })}
            </div>
             ${filteredOptions.length === 0 ? b2`<div style="padding: 8px; font-style: italic; color: var(--md-sys-color-outline);">${__a2uiI18nText("No options found")}</div>` : A}
          </div>
        `;
      }
      const count = currentSelections.length;
      const headerText = count > 0 ? __a2uiI18nCountSelected(count) : (_a7 = this.description) != null ? _a7 : __a2uiI18nText("Select items");
      return b2`
      <div class="container">
        <div
          class="dropdown-header"
          @click=${() => this.isOpen = !this.isOpen}
        >
          <span class="header-text">${headerText}</span>
          <span class="chevron ${this.isOpen ? "open" : ""}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
            </svg>
          </span>
        </div>

        <div class="dropdown-wrapper ${this.isOpen ? "open" : ""}">
          ${this.filterable ? __privateMethod(this, __this_instances, renderFilter_fn).call(this) : A}
          <div class="options-scroll-container">
            ${filteredOptions.map((option) => {
        const label = extractStringValue(option.label, this.component, this.processor, this.surfaceId);
        const isSelected = currentSelections.includes(option.value);
        return b2`
                <div
                  class="option-item ${isSelected ? "selected" : ""}"
                  @click=${(e11) => {
          e11.stopPropagation();
          this.toggleSelection(option.value);
        }}
                >
                  <div class="checkbox">
                    <span class="checkbox-icon">✓</span>
                  </div>
                  <span>${label}</span>
                </div>
              `;
      })}
             ${filteredOptions.length === 0 ? b2`<div style="padding: 16px; text-align: center; color: var(--md-sys-color-outline);">${__a2uiI18nText("No options found")}</div>` : A}
          </div>
        </div>
      </div>
    `;
    }
  }, _description_accessor_storage = new WeakMap(), _options_accessor_storage = new WeakMap(), _selections_accessor_storage = new WeakMap(), _variant_accessor_storage = new WeakMap(), _filterable_accessor_storage = new WeakMap(), _isOpen_accessor_storage = new WeakMap(), _filterText_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), setBoundValue_fn = function(value) {
    var _a7;
    if (!this.selections || !this.processor) {
      return;
    }
    if (!("path" in this.selections)) {
      return;
    }
    if (!this.selections.path) {
      return;
    }
    __a2uiDebugLog("setData", { path: this.selections.path, value }); this.processor.setData(this.component, this.selections.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
  }, renderCheckIcon_fn = function() {
    return b2`
      <svg class="chip-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    `;
  }, renderFilter_fn = function() {
    return b2`
      <div class="filter-container">
        <input
          type="text"
          class="filter-input"
          placeholder=${__a2uiI18nText("Filter options...")}
          .value=${this.filterText}
          @input=${(e11) => {
      const target = e11.target;
      this.filterText = target.value;
    }}
          @click=${(e11) => e11.stopPropagation()}
        />
      </div>
    `;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _description_decorators = [n4()];
    _options_decorators = [n4()];
    _selections_decorators = [n4()];
    _variant_decorators = [n4()];
    _filterable_decorators = [n4({ type: Boolean })];
    _isOpen_decorators = [r5()];
    _filterText_decorators = [r5()];
    __esDecorate12(_b2, null, _description_decorators, { kind: "accessor", name: "description", static: false, private: false, access: { has: (obj) => "description" in obj, get: (obj) => obj.description, set: (obj, value) => {
      obj.description = value;
    } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
    __esDecorate12(_b2, null, _options_decorators, { kind: "accessor", name: "options", static: false, private: false, access: { has: (obj) => "options" in obj, get: (obj) => obj.options, set: (obj, value) => {
      obj.options = value;
    } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
    __esDecorate12(_b2, null, _selections_decorators, { kind: "accessor", name: "selections", static: false, private: false, access: { has: (obj) => "selections" in obj, get: (obj) => obj.selections, set: (obj, value) => {
      obj.selections = value;
    } }, metadata: _metadata }, _selections_initializers, _selections_extraInitializers);
    __esDecorate12(_b2, null, _variant_decorators, { kind: "accessor", name: "variant", static: false, private: false, access: { has: (obj) => "variant" in obj, get: (obj) => obj.variant, set: (obj, value) => {
      obj.variant = value;
    } }, metadata: _metadata }, _variant_initializers, _variant_extraInitializers);
    __esDecorate12(_b2, null, _filterable_decorators, { kind: "accessor", name: "filterable", static: false, private: false, access: { has: (obj) => "filterable" in obj, get: (obj) => obj.filterable, set: (obj, value) => {
      obj.filterable = value;
    } }, metadata: _metadata }, _filterable_initializers, _filterable_extraInitializers);
    __esDecorate12(_b2, null, _isOpen_decorators, { kind: "accessor", name: "isOpen", static: false, private: false, access: { has: (obj) => "isOpen" in obj, get: (obj) => obj.isOpen, set: (obj, value) => {
      obj.isOpen = value;
    } }, metadata: _metadata }, _isOpen_initializers, _isOpen_extraInitializers);
    __esDecorate12(_b2, null, _filterText_decorators, { kind: "accessor", name: "filterText", static: false, private: false, access: { has: (obj) => "filterText" in obj, get: (obj) => obj.filterText, set: (obj, value) => {
      obj.filterText = value;
    } }, metadata: _metadata }, _filterText_initializers, _filterText_extraInitializers);
    __esDecorate12(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    MultipleChoice2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        position: relative;
        font-family: 'Google Sans', 'Roboto', sans-serif;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;
      }

      /* Header / Trigger */
      .dropdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;
        box-shadow: var(--md-sys-elevation-level1);
      }

      .dropdown-header:hover {
        background: var(--md-sys-color-surface-container-low);
      }

      .header-text {
        font-size: 1rem;
        color: var(--md-sys-color-on-surface);
        font-weight: 400;
      }

      .chevron {
        color: var(--md-sys-color-primary);
        font-size: 1.2rem;
        transition: transform 0.2s ease;
      }

      .chevron.open {
        transform: rotate(180deg);
      }

      /* Dropdown Wrapper */
      .dropdown-wrapper {
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        box-shadow: var(--md-sys-elevation-level2);
        padding: 0;
        display: none;
        flex-direction: column;
        margin-top: 4px;
        max-height: 300px;
        transition: opacity 0.2s ease-out;
        overflow: hidden; /* contain children */
      }

      .dropdown-wrapper.open {
        display: flex;
        border: 1px solid var(--md-sys-color-outline-variant);
      }

      /* Scrollable Area for Options */
      .options-scroll-container {
        overflow-y: auto;
        flex: 1; /* take remaining height */
        display: flex;
        flex-direction: column;
      }

      /* Filter Input */
      .filter-container {
        padding: 8px;
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface);
        z-index: 1; /* ensure top of stack */
        flex-shrink: 0; /* don't shrink */
      }

      .filter-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.9rem;
        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
      }

      .filter-input:focus {
        outline: none;
        border-color: var(--md-sys-color-primary);
      }

      /* Option Item (Checkbox style) */
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        color: var(--md-sys-color-on-surface);
        font-size: 0.95rem;
        transition: background-color 0.1s;
      }

      .option-item:hover {
        background: var(--md-sys-color-surface-container-highest);
      }

      /* Custom Checkbox */
      .checkbox {
        width: 18px;
        height: 18px;
        border: 2px solid var(--md-sys-color-outline);
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .option-item.selected .checkbox {
        background: var(--md-sys-color-primary);
        border-color: var(--md-sys-color-primary);
      }

      .checkbox-icon {
        color: var(--md-sys-color-on-primary);
        font-size: 14px;
        font-weight: bold;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s;
      }

      .option-item.selected .checkbox-icon {
        opacity: 1;
        transform: scale(1);
      }

      /* Chips Layout */
      .chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 0;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .chip:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .chip.selected {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
        border-color: var(--md-sys-color-secondary-container);
      }

      .chip.selected:hover {
         background: var(--md-sys-color-secondary-container-high);
      }

      .chip-icon {
        display: none;
        width: 18px;
        height: 18px;
      }

      .chip.selected .chip-icon {
        display: block;
        fill: currentColor;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
  ], __runInitializers12(_classThis, _classExtraInitializers), _b2);
  return MultipleChoice2 = _classThis;
})();

// ../../node_modules/lit-html/directives/ref.js
var o11 = /* @__PURE__ */ new WeakMap();
var n9 = e7(class extends f3 {
  render(i11) {
    return A;
  }
  update(i11, [s11]) {
    var _a7;
    const e11 = s11 !== this.G;
    return e11 && void 0 !== this.G && this.rt(void 0), (e11 || this.lt !== this.ct) && (this.G = s11, this.ht = (_a7 = i11.options) == null ? void 0 : _a7.host, this.rt(this.ct = i11.element)), A;
  }
  rt(t7) {
    var _a7;
    if (this.isConnected || (t7 = void 0), "function" == typeof this.G) {
      const i11 = (_a7 = this.ht) != null ? _a7 : globalThis;
      let s11 = o11.get(i11);
      void 0 === s11 && (s11 = /* @__PURE__ */ new WeakMap(), o11.set(i11, s11)), void 0 !== s11.get(this.G) && this.G.call(this.ht, void 0), s11.set(this.G, t7), void 0 !== t7 && this.G.call(this.ht, t7);
    } else this.G.value = t7;
  }
  get lt() {
    var _a7, _b2, _c;
    return "function" == typeof this.G ? (_b2 = o11.get((_a7 = this.ht) != null ? _a7 : globalThis)) == null ? void 0 : _b2.get(this.G) : (_c = this.G) == null ? void 0 : _c.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});

// ../../node_modules/@a2ui/lit/src/0.8/ui/modal.js
var __esDecorate13 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers13 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __setFunctionName = function(f4, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f4, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var Modal = (() => {
  var _a7, _showModal_accessor_storage, __this_instances, showModal_get, showModal_set, _modalRef_accessor_storage, modalRef_get, modalRef_set, closeModal_fn, _b2;
  let _classDecorators = [t3("a2ui-modal")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _private_showModal_decorators;
  let _private_showModal_initializers = [];
  let _private_showModal_extraInitializers = [];
  let _private_showModal_descriptor;
  let _private_modalRef_decorators;
  let _private_modalRef_initializers = [];
  let _private_modalRef_extraInitializers = [];
  let _private_modalRef_descriptor;
  var Modal2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _showModal_accessor_storage, __runInitializers13(this, _private_showModal_initializers, false));
      __privateAdd(this, _modalRef_accessor_storage, (__runInitializers13(this, _private_showModal_extraInitializers), __runInitializers13(this, _private_modalRef_initializers, null)));
      __runInitializers13(this, _private_modalRef_extraInitializers);
    }
    render() {
      var _a7, _b3;
      if (!__privateGet(this, __this_instances, showModal_get)) {
        return b2`<section
        @click=${() => {
          __privateSet(this, __this_instances, true, showModal_set);
        }}
      >
        <slot name="entry"></slot>
      </section>`;
      }
      return b2`<dialog
      class=${e9(this.theme.components.Modal.backdrop)}
      @click=${(evt) => {
        const [top] = evt.composedPath();
        if (!(top instanceof HTMLDialogElement)) {
          return;
        }
        __privateMethod(this, __this_instances, closeModal_fn).call(this);
      }}
      ${n9((el) => {
        const showModalIfNeeded = () => {
          const validElement = el && el instanceof HTMLDialogElement;
          if (!validElement || el.open) {
            return;
          }
          el.showModal();
        };
        requestAnimationFrame(showModalIfNeeded);
      })}
    >
      <section
        class=${e9(this.theme.components.Modal.element)}
        style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Modal) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Modal) : A}
      >
        <div id="controls">
          <button
            @click=${() => {
        __privateMethod(this, __this_instances, closeModal_fn).call(this);
      }}
          >
            <span class="g-icon">close</span>
          </button>
        </div>
        <slot></slot>
      </section>
    </dialog>`;
    }
  }, _showModal_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), showModal_get = function() {
    return _private_showModal_descriptor.get.call(this);
  }, showModal_set = function(value) {
    return _private_showModal_descriptor.set.call(this, value);
  }, _modalRef_accessor_storage = new WeakMap(), modalRef_get = function() {
    return _private_modalRef_descriptor.get.call(this);
  }, modalRef_set = function(value) {
    return _private_modalRef_descriptor.set.call(this, value);
  }, closeModal_fn = function() {
    if (!__privateGet(this, __this_instances, modalRef_get)) {
      return;
    }
    if (__privateGet(this, __this_instances, modalRef_get).open) {
      __privateGet(this, __this_instances, modalRef_get).close();
    }
    __privateSet(this, __this_instances, false, showModal_set);
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _private_showModal_decorators = [r5()];
    _private_modalRef_decorators = [e5("dialog")];
    __esDecorate13(_b2, _private_showModal_descriptor = { get: __setFunctionName(function() {
      return __privateGet(this, _showModal_accessor_storage);
    }, "#showModal", "get"), set: __setFunctionName(function(value) {
      __privateSet(this, _showModal_accessor_storage, value);
    }, "#showModal", "set") }, _private_showModal_decorators, { kind: "accessor", name: "#showModal", static: false, private: true, access: { has: (obj) => __privateIn(__this_instances, obj), get: (obj) => __privateGet(obj, __this_instances, showModal_get), set: (obj, value) => {
      __privateSet(obj, __this_instances, value, showModal_set);
    } }, metadata: _metadata }, _private_showModal_initializers, _private_showModal_extraInitializers);
    __esDecorate13(_b2, _private_modalRef_descriptor = { get: __setFunctionName(function() {
      return __privateGet(this, _modalRef_accessor_storage);
    }, "#modalRef", "get"), set: __setFunctionName(function(value) {
      __privateSet(this, _modalRef_accessor_storage, value);
    }, "#modalRef", "set") }, _private_modalRef_decorators, { kind: "accessor", name: "#modalRef", static: false, private: true, access: { has: (obj) => __privateIn(__this_instances, obj), get: (obj) => __privateGet(obj, __this_instances, modalRef_get), set: (obj, value) => {
      __privateSet(obj, __this_instances, value, modalRef_set);
    } }, metadata: _metadata }, _private_modalRef_initializers, _private_modalRef_extraInitializers);
    __esDecorate13(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Modal2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      dialog {
        padding: 0 0 0 0;
        border: none;
        background: none;

        & section {
          & #controls {
            display: flex;
            justify-content: end;
            margin-bottom: 4px;

            & button {
              padding: 0;
              background: none;
              width: 20px;
              height: 20px;
              pointer: cursor;
              border: none;
              cursor: pointer;
            }
          }
        }
      }
    `
  ], __runInitializers13(_classThis, _classExtraInitializers), _b2);
  return Modal2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/row.js
var __esDecorate14 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers14 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Row = (() => {
  var _a7, _alignment_accessor_storage, _distribution_accessor_storage, _b2;
  let _classDecorators = [t3("a2ui-row")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _alignment_decorators;
  let _alignment_initializers = [];
  let _alignment_extraInitializers = [];
  let _distribution_decorators;
  let _distribution_initializers = [];
  let _distribution_extraInitializers = [];
  var Row2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, _alignment_accessor_storage, __runInitializers14(this, _alignment_initializers, "stretch"));
      __privateAdd(this, _distribution_accessor_storage, (__runInitializers14(this, _alignment_extraInitializers), __runInitializers14(this, _distribution_initializers, "start")));
      __runInitializers14(this, _distribution_extraInitializers);
    }
    get alignment() {
      return __privateGet(this, _alignment_accessor_storage);
    }
    set alignment(value) {
      __privateSet(this, _alignment_accessor_storage, value);
    }
    get distribution() {
      return __privateGet(this, _distribution_accessor_storage);
    }
    set distribution(value) {
      __privateSet(this, _distribution_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.Row)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Row) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Row) : A}
    >
      <slot></slot>
    </section>`;
    }
  }, _alignment_accessor_storage = new WeakMap(), _distribution_accessor_storage = new WeakMap(), _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _alignment_decorators = [n4({ reflect: true, type: String })];
    _distribution_decorators = [n4({ reflect: true, type: String })];
    __esDecorate14(_b2, null, _alignment_decorators, { kind: "accessor", name: "alignment", static: false, private: false, access: { has: (obj) => "alignment" in obj, get: (obj) => obj.alignment, set: (obj, value) => {
      obj.alignment = value;
    } }, metadata: _metadata }, _alignment_initializers, _alignment_extraInitializers);
    __esDecorate14(_b2, null, _distribution_decorators, { kind: "accessor", name: "distribution", static: false, private: false, access: { has: (obj) => "distribution" in obj, get: (obj) => obj.distribution, set: (obj, value) => {
      obj.distribution = value;
    } }, metadata: _metadata }, _distribution_initializers, _distribution_extraInitializers);
    __esDecorate14(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Row2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      section {
        display: flex;
        flex-direction: row;
        width: 100%;
        min-height: 100%;
      }

      :host([alignment="start"]) section {
        align-items: start;
      }

      :host([alignment="center"]) section {
        align-items: center;
      }

      :host([alignment="end"]) section {
        align-items: end;
      }

      :host([alignment="stretch"]) section {
        align-items: stretch;
      }

      :host([distribution="start"]) section {
        justify-content: start;
      }

      :host([distribution="center"]) section {
        justify-content: center;
      }

      :host([distribution="end"]) section {
        justify-content: end;
      }

      :host([distribution="spaceBetween"]) section {
        justify-content: space-between;
      }

      :host([distribution="spaceAround"]) section {
        justify-content: space-around;
      }

      :host([distribution="spaceEvenly"]) section {
        justify-content: space-evenly;
      }
    `
  ], __runInitializers14(_classThis, _classExtraInitializers), _b2);
  return Row2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/slider.js
var __esDecorate15 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers15 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Slider = (() => {
  var _a7, _value_accessor_storage, _minValue_accessor_storage, _maxValue_accessor_storage, _label_accessor_storage, __this_instances, setBoundValue_fn, renderField_fn, _b2;
  let _classDecorators = [t3("a2ui-slider")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _value_decorators;
  let _value_initializers = [];
  let _value_extraInitializers = [];
  let _minValue_decorators;
  let _minValue_initializers = [];
  let _minValue_extraInitializers = [];
  let _maxValue_decorators;
  let _maxValue_initializers = [];
  let _maxValue_extraInitializers = [];
  let _label_decorators;
  let _label_initializers = [];
  let _label_extraInitializers = [];
  var Slider2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _value_accessor_storage, __runInitializers15(this, _value_initializers, null));
      __privateAdd(this, _minValue_accessor_storage, (__runInitializers15(this, _value_extraInitializers), __runInitializers15(this, _minValue_initializers, 0)));
      __privateAdd(this, _maxValue_accessor_storage, (__runInitializers15(this, _minValue_extraInitializers), __runInitializers15(this, _maxValue_initializers, 0)));
      __privateAdd(this, _label_accessor_storage, (__runInitializers15(this, _maxValue_extraInitializers), __runInitializers15(this, _label_initializers, null)));
      __runInitializers15(this, _label_extraInitializers);
    }
    get value() {
      return __privateGet(this, _value_accessor_storage);
    }
    set value(value) {
      __privateSet(this, _value_accessor_storage, value);
    }
    get minValue() {
      return __privateGet(this, _minValue_accessor_storage);
    }
    set minValue(value) {
      __privateSet(this, _minValue_accessor_storage, value);
    }
    get maxValue() {
      return __privateGet(this, _maxValue_accessor_storage);
    }
    set maxValue(value) {
      __privateSet(this, _maxValue_accessor_storage, value);
    }
    get label() {
      return __privateGet(this, _label_accessor_storage);
    }
    set label(value) {
      __privateSet(this, _label_accessor_storage, value);
    }
    render() {
      var _a7;
      if (this.value && typeof this.value === "object") {
        if ("literalNumber" in this.value && this.value.literalNumber) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literalNumber);
        } else if ("literal" in this.value && this.value.literal !== void 0) {
          return __privateMethod(this, __this_instances, renderField_fn).call(this, this.value.literal);
        } else if (this.value && "path" in this.value && this.value.path) {
          if (!this.processor || !this.component) {
            return b2`(no processor)`;
          }
          const textValue = this.processor.getData(this.component, this.value.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
          if (textValue === null) {
            return b2`Invalid value`;
          }
          if (typeof textValue !== "string" && typeof textValue !== "number") {
            return b2`Invalid value`;
          }
          return __privateMethod(this, __this_instances, renderField_fn).call(this, textValue);
        }
      }
      return A;
    }
  }, _value_accessor_storage = new WeakMap(), _minValue_accessor_storage = new WeakMap(), _maxValue_accessor_storage = new WeakMap(), _label_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), setBoundValue_fn = function(value) {
    var _a7;
    if (!this.value || !this.processor) {
      return;
    }
    if (!("path" in this.value)) {
      return;
    }
    if (!this.value.path) {
      return;
    }
    this.processor.setData(this.component, this.value.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
  }, renderField_fn = function(value) {
    var _a7, _b3, _c, _d;
    return b2`<section
      class=${e9(this.theme.components.Slider.container)}
    >
      ${this.label ? b2`<label class=${e9(this.theme.components.Slider.label)} for="data">
            ${extractStringValue(this.label, this.component, this.processor, this.surfaceId)}
          </label>` : A}
      <input
        autocomplete="off"
        class=${e9(this.theme.components.Slider.element)}
        style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Slider) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Slider) : A}
        @input=${(evt) => {
      if (!(evt.target instanceof HTMLInputElement)) {
        return;
      }
      __privateMethod(this, __this_instances, setBoundValue_fn).call(this, evt.target.value);
    }}
        id="data"
        name="data"
        .value=${value}
        type="range"
        min=${(_c = this.minValue) != null ? _c : "0"}
        max=${(_d = this.maxValue) != null ? _d : "0"}
      />
      <span class=${e9(this.theme.components.Slider.label)}
        >${this.value ? extractNumberValue(this.value, this.component, this.processor, this.surfaceId) : "0"}</span
      >
    </section>`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _value_decorators = [n4()];
    _minValue_decorators = [n4()];
    _maxValue_decorators = [n4()];
    _label_decorators = [n4()];
    __esDecorate15(_b2, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: (obj) => "value" in obj, get: (obj) => obj.value, set: (obj, value) => {
      obj.value = value;
    } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
    __esDecorate15(_b2, null, _minValue_decorators, { kind: "accessor", name: "minValue", static: false, private: false, access: { has: (obj) => "minValue" in obj, get: (obj) => obj.minValue, set: (obj, value) => {
      obj.minValue = value;
    } }, metadata: _metadata }, _minValue_initializers, _minValue_extraInitializers);
    __esDecorate15(_b2, null, _maxValue_decorators, { kind: "accessor", name: "maxValue", static: false, private: false, access: { has: (obj) => "maxValue" in obj, get: (obj) => obj.maxValue, set: (obj, value) => {
      obj.maxValue = value;
    } }, metadata: _metadata }, _maxValue_initializers, _maxValue_extraInitializers);
    __esDecorate15(_b2, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: (obj) => "label" in obj, get: (obj) => obj.label, set: (obj, value) => {
      obj.label = value;
    } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
    __esDecorate15(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Slider2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
      }

      input {
        display: block;
        width: 100%;
      }

      .description {
      }
    `
  ], __runInitializers15(_classThis, _classExtraInitializers), _b2);
  return Slider2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/surface.js
var __esDecorate16 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers16 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Surface = (() => {
  var _a7, _surfaceId_accessor_storage, _surface_accessor_storage, _processor_accessor_storage, __this_instances, renderLogo_fn, _enableCustomElements_accessor_storage, renderSurface_fn, _b2;
  let _classDecorators = [t3("a2ui-surface")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _surfaceId_decorators;
  let _surfaceId_initializers = [];
  let _surfaceId_extraInitializers = [];
  let _surface_decorators;
  let _surface_initializers = [];
  let _surface_extraInitializers = [];
  let _processor_decorators;
  let _processor_initializers = [];
  let _processor_extraInitializers = [];
  let _enableCustomElements_decorators;
  let _enableCustomElements_initializers = [];
  let _enableCustomElements_extraInitializers = [];
  var Surface2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _surfaceId_accessor_storage, __runInitializers16(this, _surfaceId_initializers, null));
      __privateAdd(this, _surface_accessor_storage, (__runInitializers16(this, _surfaceId_extraInitializers), __runInitializers16(this, _surface_initializers, null)));
      __privateAdd(this, _processor_accessor_storage, (__runInitializers16(this, _surface_extraInitializers), __runInitializers16(this, _processor_initializers, null)));
      __privateAdd(this, _enableCustomElements_accessor_storage, (__runInitializers16(this, _processor_extraInitializers), __runInitializers16(this, _enableCustomElements_initializers, false)));
      __runInitializers16(this, _enableCustomElements_extraInitializers);
    }
    get surfaceId() {
      return __privateGet(this, _surfaceId_accessor_storage);
    }
    set surfaceId(value) {
      __privateSet(this, _surfaceId_accessor_storage, value);
    }
    get surface() {
      return __privateGet(this, _surface_accessor_storage);
    }
    set surface(value) {
      __privateSet(this, _surface_accessor_storage, value);
    }
    get processor() {
      return __privateGet(this, _processor_accessor_storage);
    }
    set processor(value) {
      __privateSet(this, _processor_accessor_storage, value);
    }
    get enableCustomElements() {
      return __privateGet(this, _enableCustomElements_accessor_storage);
    }
    set enableCustomElements(value) {
      __privateSet(this, _enableCustomElements_accessor_storage, value);
    }
    render() {
      if (!this.surface) {
        return A;
      }
      return b2`${[__privateMethod(this, __this_instances, renderLogo_fn).call(this), __privateMethod(this, __this_instances, renderSurface_fn).call(this)]}`;
    }
  }, _surfaceId_accessor_storage = new WeakMap(), _surface_accessor_storage = new WeakMap(), _processor_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderLogo_fn = function() {
    var _a7;
    if (!((_a7 = this.surface) == null ? void 0 : _a7.styles.logoUrl)) {
      return A;
    }
    return b2`<div id="surface-logo">
      <img src=${this.surface.styles.logoUrl} />
    </div>`;
  }, _enableCustomElements_accessor_storage = new WeakMap(), renderSurface_fn = function() {
    var _a7, _b3;
    const styles = {};
    if ((_a7 = this.surface) == null ? void 0 : _a7.styles) {
      for (const [key, value] of Object.entries(this.surface.styles)) {
        switch (key) {
          // Here we generate a palette from the singular primary color received
          // from the surface data. We will want the values to range from
          // 0 <= x <= 100, where 0 = back, 100 = white, and 50 = the primary
          // color itself. As such we use a color-mix to create the intermediate
          // values.
          //
          // Note: since we use half the range for black to the primary color,
          // and half the range for primary color to white the mixed values have
          // to go up double the amount, i.e., a range from black to primary
          // color needs to fit in 0 -> 50 rather than 0 -> 100.
          case "primaryColor": {
            styles["--p-100"] = "#ffffff";
            styles["--p-99"] = `color-mix(in srgb, ${value} 2%, white 98%)`;
            styles["--p-98"] = `color-mix(in srgb, ${value} 4%, white 96%)`;
            styles["--p-95"] = `color-mix(in srgb, ${value} 10%, white 90%)`;
            styles["--p-90"] = `color-mix(in srgb, ${value} 20%, white 80%)`;
            styles["--p-80"] = `color-mix(in srgb, ${value} 40%, white 60%)`;
            styles["--p-70"] = `color-mix(in srgb, ${value} 60%, white 40%)`;
            styles["--p-60"] = `color-mix(in srgb, ${value} 80%, white 20%)`;
            styles["--p-50"] = value;
            styles["--p-40"] = `color-mix(in srgb, ${value} 80%, black 20%)`;
            styles["--p-35"] = `color-mix(in srgb, ${value} 70%, black 30%)`;
            styles["--p-30"] = `color-mix(in srgb, ${value} 60%, black 40%)`;
            styles["--p-25"] = `color-mix(in srgb, ${value} 50%, black 50%)`;
            styles["--p-20"] = `color-mix(in srgb, ${value} 40%, black 60%)`;
            styles["--p-15"] = `color-mix(in srgb, ${value} 30%, black 70%)`;
            styles["--p-10"] = `color-mix(in srgb, ${value} 20%, black 80%)`;
            styles["--p-5"] = `color-mix(in srgb, ${value} 10%, black 90%)`;
            styles["--0"] = "#00000";
            break;
          }
          case "font": {
            styles["--font-family"] = value;
            styles["--font-family-flex"] = value;
            break;
          }
        }
      }
    }
    return b2`<a2ui-root
      style=${o10(styles)}
      .surfaceId=${this.surfaceId}
      .processor=${this.processor}
      .childComponents=${((_b3 = this.surface) == null ? void 0 : _b3.componentTree) ? [this.surface.componentTree] : null}
      .enableCustomElements=${this.enableCustomElements}
    ></a2ui-root>`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _surfaceId_decorators = [n4()];
    _surface_decorators = [n4()];
    _processor_decorators = [n4()];
    _enableCustomElements_decorators = [n4()];
    __esDecorate16(_b2, null, _surfaceId_decorators, { kind: "accessor", name: "surfaceId", static: false, private: false, access: { has: (obj) => "surfaceId" in obj, get: (obj) => obj.surfaceId, set: (obj, value) => {
      obj.surfaceId = value;
    } }, metadata: _metadata }, _surfaceId_initializers, _surfaceId_extraInitializers);
    __esDecorate16(_b2, null, _surface_decorators, { kind: "accessor", name: "surface", static: false, private: false, access: { has: (obj) => "surface" in obj, get: (obj) => obj.surface, set: (obj, value) => {
      obj.surface = value;
    } }, metadata: _metadata }, _surface_initializers, _surface_extraInitializers);
    __esDecorate16(_b2, null, _processor_decorators, { kind: "accessor", name: "processor", static: false, private: false, access: { has: (obj) => "processor" in obj, get: (obj) => obj.processor, set: (obj, value) => {
      obj.processor = value;
    } }, metadata: _metadata }, _processor_initializers, _processor_extraInitializers);
    __esDecorate16(_b2, null, _enableCustomElements_decorators, { kind: "accessor", name: "enableCustomElements", static: false, private: false, access: { has: (obj) => "enableCustomElements" in obj, get: (obj) => obj.enableCustomElements, set: (obj, value) => {
      obj.enableCustomElements = value;
    } }, metadata: _metadata }, _enableCustomElements_initializers, _enableCustomElements_extraInitializers);
    __esDecorate16(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Surface2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    i`
      :host {
        display: flex;
        min-height: 0;
        max-height: 100%;
        flex-direction: column;
        gap: 16px;
      }

      #surface-logo {
        display: flex;
        justify-content: center;

        & img {
          width: 50%;
          max-width: 220px;
        }
      }

      a2ui-root {
        flex: 1;
      }
    `
  ], __runInitializers16(_classThis, _classExtraInitializers), _b2);
  return Surface2 = _classThis;
})();

// ../../node_modules/lit-html/directives/repeat.js
var u4 = (e11, s11, t7) => {
  const r9 = /* @__PURE__ */ new Map();
  for (let l5 = s11; l5 <= t7; l5++) r9.set(e11[l5], l5);
  return r9;
};
var c6 = e7(class extends i6 {
  constructor(e11) {
    if (super(e11), e11.type !== t4.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e11, s11, t7) {
    let r9;
    void 0 === t7 ? t7 = s11 : void 0 !== s11 && (r9 = s11);
    const l5 = [], o13 = [];
    let i11 = 0;
    for (const s12 of e11) l5[i11] = r9 ? r9(s12, i11) : i11, o13[i11] = t7(s12, i11), i11++;
    return { values: o13, keys: l5 };
  }
  render(e11, s11, t7) {
    return this.dt(e11, s11, t7).values;
  }
  update(s11, [t7, r9, c8]) {
    var _a7;
    const d3 = M2(s11), { values: p5, keys: a4 } = this.dt(t7, r9, c8);
    if (!Array.isArray(d3)) return this.ut = a4, p5;
    const h8 = (_a7 = this.ut) != null ? _a7 : this.ut = [], v3 = [];
    let m5, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p5.length - 1;
    for (; x2 <= j2 && k2 <= w2; ) if (null === d3[x2]) x2++;
    else if (null === d3[j2]) j2--;
    else if (h8[x2] === a4[k2]) v3[k2] = u3(d3[x2], p5[k2]), x2++, k2++;
    else if (h8[j2] === a4[w2]) v3[w2] = u3(d3[j2], p5[w2]), j2--, w2--;
    else if (h8[x2] === a4[w2]) v3[w2] = u3(d3[x2], p5[w2]), v2(s11, v3[w2 + 1], d3[x2]), x2++, w2--;
    else if (h8[j2] === a4[k2]) v3[k2] = u3(d3[j2], p5[k2]), v2(s11, d3[x2], d3[j2]), j2--, k2++;
    else if (void 0 === m5 && (m5 = u4(a4, k2, w2), y3 = u4(h8, x2, j2)), m5.has(h8[x2])) if (m5.has(h8[j2])) {
      const e11 = y3.get(a4[k2]), t8 = void 0 !== e11 ? d3[e11] : null;
      if (null === t8) {
        const e12 = v2(s11, d3[x2]);
        u3(e12, p5[k2]), v3[k2] = e12;
      } else v3[k2] = u3(t8, p5[k2]), v2(s11, d3[x2], t8), d3[e11] = null;
      k2++;
    } else h4(d3[j2]), j2--;
    else h4(d3[x2]), x2++;
    for (; k2 <= w2; ) {
      const e11 = v2(s11, v3[w2 + 1]);
      u3(e11, p5[k2]), v3[k2++] = e11;
    }
    for (; x2 <= j2; ) {
      const e11 = d3[x2++];
      null !== e11 && h4(e11);
    }
    return this.ut = a4, p3(s11, v3), E;
  }
});

// ../../node_modules/@a2ui/lit/src/0.8/ui/tabs.js
var __esDecorate17 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers17 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Tabs = (() => {
  var _a7, _titles_accessor_storage, _selected_accessor_storage, __this_instances, renderTabs_fn, renderSlot_fn, _b2;
  let _classDecorators = [t3("a2ui-tabs")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _titles_decorators;
  let _titles_initializers = [];
  let _titles_extraInitializers = [];
  let _selected_decorators;
  let _selected_initializers = [];
  let _selected_extraInitializers = [];
  var Tabs2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _titles_accessor_storage, __runInitializers17(this, _titles_initializers, null));
      __privateAdd(this, _selected_accessor_storage, (__runInitializers17(this, _titles_extraInitializers), __runInitializers17(this, _selected_initializers, 0)));
      __runInitializers17(this, _selected_extraInitializers);
    }
    get titles() {
      return __privateGet(this, _titles_accessor_storage);
    }
    set titles(value) {
      __privateSet(this, _titles_accessor_storage, value);
    }
    get selected() {
      return __privateGet(this, _selected_accessor_storage);
    }
    set selected(value) {
      __privateSet(this, _selected_accessor_storage, value);
    }
    willUpdate(changedProperties) {
      super.willUpdate(changedProperties);
      if (changedProperties.has("selected")) {
        for (const child of this.children) {
          child.removeAttribute("slot");
        }
        const selectedChild = this.children[this.selected];
        if (!selectedChild) {
          return;
        }
        selectedChild.slot = "current";
      }
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.Tabs.container)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Tabs) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Tabs) : A}
    >
      ${[__privateMethod(this, __this_instances, renderTabs_fn).call(this), __privateMethod(this, __this_instances, renderSlot_fn).call(this)]}
    </section>`;
    }
  }, _titles_accessor_storage = new WeakMap(), _selected_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderTabs_fn = function() {
    if (!this.titles) {
      return A;
    }
    return b2`<div
      id="buttons"
      class=${e9(this.theme.components.Tabs.element)}
    >
      ${c6(this.titles, (title, idx) => {
      var _a7;
      let titleString = "";
      if ("literalString" in title && title.literalString) {
        titleString = title.literalString;
      } else if ("literal" in title && title.literal !== void 0) {
        titleString = title.literal;
      } else if (title && "path" in title && title.path) {
        if (!this.processor || !this.component) {
          return b2`(no model)`;
        }
        const textValue = this.processor.getData(this.component, title.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (typeof textValue !== "string") {
          return b2`(invalid)`;
        }
        titleString = textValue;
      }
      let classes;
      if (this.selected === idx) {
        classes = styles_exports.merge(this.theme.components.Tabs.controls.all, this.theme.components.Tabs.controls.selected);
      } else {
        classes = { ...this.theme.components.Tabs.controls.all };
      }
      return b2`<button
          ?disabled=${this.selected === idx}
          class=${e9(classes)}
          @click=${() => {
        this.selected = idx;
      }}
        >
          ${titleString}
        </button>`;
    })}
    </div>`;
  }, renderSlot_fn = function() {
    return b2`<slot name="current"></slot>`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _titles_decorators = [n4()];
    _selected_decorators = [n4()];
    __esDecorate17(_b2, null, _titles_decorators, { kind: "accessor", name: "titles", static: false, private: false, access: { has: (obj) => "titles" in obj, get: (obj) => obj.titles, set: (obj, value) => {
      obj.titles = value;
    } }, metadata: _metadata }, _titles_initializers, _titles_extraInitializers);
    __esDecorate17(_b2, null, _selected_decorators, { kind: "accessor", name: "selected", static: false, private: false, access: { has: (obj) => "selected" in obj, get: (obj) => obj.selected, set: (obj, value) => {
      obj.selected = value;
    } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
    __esDecorate17(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Tabs2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      :host {
        display: block;
        flex: var(--weight);
      }
    `
  ], __runInitializers17(_classThis, _classExtraInitializers), _b2);
  return Tabs2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/text-field.js
var __esDecorate18 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers18 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var TextField = (() => {
  var _a7, _text_accessor_storage, _label_accessor_storage, _textFieldType_accessor_storage, _validationRegexp_accessor_storage, __this_instances, setBoundValue_fn, renderField_fn, _b2;
  let _classDecorators = [t3("a2ui-textfield")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _text_decorators;
  let _text_initializers = [];
  let _text_extraInitializers = [];
  let _label_decorators;
  let _label_initializers = [];
  let _label_extraInitializers = [];
  let _textFieldType_decorators;
  let _textFieldType_initializers = [];
  let _textFieldType_extraInitializers = [];
  let _validationRegexp_decorators;
  let _validationRegexp_initializers = [];
  let _validationRegexp_extraInitializers = [];
  var TextField2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _text_accessor_storage, __runInitializers18(this, _text_initializers, null));
      __privateAdd(this, _label_accessor_storage, (__runInitializers18(this, _text_extraInitializers), __runInitializers18(this, _label_initializers, null)));
      __privateAdd(this, _textFieldType_accessor_storage, (__runInitializers18(this, _label_extraInitializers), __runInitializers18(this, _textFieldType_initializers, null)));
      __privateAdd(this, _validationRegexp_accessor_storage, (__runInitializers18(this, _textFieldType_extraInitializers), __runInitializers18(this, _validationRegexp_initializers, null)));
      __runInitializers18(this, _validationRegexp_extraInitializers);
    }
    get text() {
      return __privateGet(this, _text_accessor_storage);
    }
    set text(value) {
      __privateSet(this, _text_accessor_storage, value);
    }
    get label() {
      return __privateGet(this, _label_accessor_storage);
    }
    set label(value) {
      __privateSet(this, _label_accessor_storage, value);
    }
    get textFieldType() {
      return __privateGet(this, _textFieldType_accessor_storage);
    }
    set textFieldType(value) {
      __privateSet(this, _textFieldType_accessor_storage, value);
    }
    get validationRegexp() {
      return __privateGet(this, _validationRegexp_accessor_storage);
    }
    set validationRegexp(value) {
      __privateSet(this, _validationRegexp_accessor_storage, value);
    }
    render() {
      const label = extractStringValue(this.label, this.component, this.processor, this.surfaceId);
      const value = extractStringValue(this.text, this.component, this.processor, this.surfaceId);
      return __privateMethod(this, __this_instances, renderField_fn).call(this, value, label);
    }
  }, _text_accessor_storage = new WeakMap(), _label_accessor_storage = new WeakMap(), _textFieldType_accessor_storage = new WeakMap(), _validationRegexp_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), setBoundValue_fn = function(value) {
    var _a7;
    if (!this.text || !this.processor) {
      return;
    }
    if (!("path" in this.text)) {
      return;
    }
    if (!this.text.path) {
      return;
    }
    this.processor.setData(this.component, this.text.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
  }, renderField_fn = function(value, label) {
    var _a7, _b3;
    return b2` <section
      class=${e9(this.theme.components.TextField.container)}
    >
      ${label && label !== "" ? b2`<label
            class=${e9(this.theme.components.TextField.label)}
            for="data"
            >${label}</label
          >` : A}
      <input
        autocomplete="off"
        class=${e9(this.theme.components.TextField.element)}
        style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.TextField) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.TextField) : A}
        @input=${(evt) => {
      if (!(evt.target instanceof HTMLInputElement)) {
        return;
      }
      this.dispatchEvent(new events_exports2.A2UIValidationEvent({
        componentId: this.id,
        value: evt.target.value,
        valid: evt.target.checkValidity()
      }));
      __privateMethod(this, __this_instances, setBoundValue_fn).call(this, evt.target.value);
    }}
        name="data"
        id="data"
        .value=${value}
        .placeholder=${__a2uiI18nText("Please enter a value")}
        pattern=${this.validationRegexp || A}
        type=${this.textFieldType === "number" ? "number" : "text"}
      />
    </section>`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _text_decorators = [n4()];
    _label_decorators = [n4()];
    _textFieldType_decorators = [n4()];
    _validationRegexp_decorators = [n4()];
    __esDecorate18(_b2, null, _text_decorators, { kind: "accessor", name: "text", static: false, private: false, access: { has: (obj) => "text" in obj, get: (obj) => obj.text, set: (obj, value) => {
      obj.text = value;
    } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
    __esDecorate18(_b2, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: (obj) => "label" in obj, get: (obj) => obj.label, set: (obj, value) => {
      obj.label = value;
    } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
    __esDecorate18(_b2, null, _textFieldType_decorators, { kind: "accessor", name: "textFieldType", static: false, private: false, access: { has: (obj) => "textFieldType" in obj, get: (obj) => obj.textFieldType, set: (obj, value) => {
      obj.textFieldType = value;
    } }, metadata: _metadata }, _textFieldType_initializers, _textFieldType_extraInitializers);
    __esDecorate18(_b2, null, _validationRegexp_decorators, { kind: "accessor", name: "validationRegexp", static: false, private: false, access: { has: (obj) => "validationRegexp" in obj, get: (obj) => obj.validationRegexp, set: (obj, value) => {
      obj.validationRegexp = value;
    } }, metadata: _metadata }, _validationRegexp_initializers, _validationRegexp_extraInitializers);
    __esDecorate18(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    TextField2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      input {
        display: block;
        width: 100%;
      }

      input:invalid {
        border-color: var(--color-error);
        color: var(--color-error);
        outline-color: var(--color-error);
      }

      input:invalid:focus {
        border-color: var(--color-error);
        outline-color: var(--color-error);
      }

      label {
        display: block;
        margin-bottom: 4px;
      }
    `
  ], __runInitializers18(_classThis, _classExtraInitializers), _b2);
  return TextField2 = _classThis;
})();

// ../../node_modules/lit-html/directives/unsafe-html.js
var e10 = class extends i6 {
  constructor(i11) {
    if (super(i11), this.it = A, i11.type !== t4.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r9) {
    if (r9 === A || null == r9) return this._t = void 0, this.it = r9;
    if (r9 === E) return r9;
    if ("string" != typeof r9) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r9 === this.it) return this._t;
    this.it = r9;
    const s11 = [r9];
    return s11.raw = s11, this._t = { _$litType$: this.constructor.resultType, strings: s11, values: [] };
  }
};
e10.directiveName = "unsafeHTML", e10.resultType = 1;
var o12 = e7(e10);

// ../../node_modules/lit-html/directives/private-async-helpers.js
var s10 = class {
  constructor(t7) {
    this.G = t7;
  }
  disconnect() {
    this.G = void 0;
  }
  reconnect(t7) {
    this.G = t7;
  }
  deref() {
    return this.G;
  }
};
var i10 = class {
  constructor() {
    this.Y = void 0, this.Z = void 0;
  }
  get() {
    return this.Y;
  }
  pause() {
    var _a7;
    (_a7 = this.Y) != null ? _a7 : this.Y = new Promise((t7) => this.Z = t7);
  }
  resume() {
    var _a7;
    (_a7 = this.Z) == null ? void 0 : _a7.call(this), this.Y = this.Z = void 0;
  }
};

// ../../node_modules/lit-html/directives/until.js
var n10 = (t7) => !n5(t7) && "function" == typeof t7.then;
var h7 = 1073741823;
var c7 = class extends f3 {
  constructor() {
    super(...arguments), this._$Cwt = h7, this._$Cbt = [], this._$CK = new s10(this), this._$CX = new i10();
  }
  render(...s11) {
    var _a7;
    return (_a7 = s11.find((t7) => !n10(t7))) != null ? _a7 : E;
  }
  update(s11, i11) {
    const e11 = this._$Cbt;
    let r9 = e11.length;
    this._$Cbt = i11;
    const o13 = this._$CK, c8 = this._$CX;
    this.isConnected || this.disconnected();
    for (let t7 = 0; t7 < i11.length && !(t7 > this._$Cwt); t7++) {
      const s12 = i11[t7];
      if (!n10(s12)) return this._$Cwt = t7, s12;
      t7 < r9 && s12 === e11[t7] || (this._$Cwt = h7, r9 = 0, Promise.resolve(s12).then(async (t8) => {
        for (; c8.get(); ) await c8.get();
        const i12 = o13.deref();
        if (void 0 !== i12) {
          const e12 = i12._$Cbt.indexOf(s12);
          e12 > -1 && e12 < i12._$Cwt && (i12._$Cwt = e12, i12.setValue(t8));
        }
      }));
    }
    return E;
  }
  disconnected() {
    this._$CK.disconnect(), this._$CX.pause();
  }
  reconnected() {
    this._$CK.reconnect(this), this._$CX.resume();
  }
};
var m4 = e7(c7);

// ../../node_modules/@a2ui/lit/src/0.8/ui/directives/markdown.js
var _lastValue, _lastTagClassMap;
var _MarkdownDirective = class _MarkdownDirective extends i6 {
  constructor() {
    super(...arguments);
    __privateAdd(this, _lastValue, null);
    __privateAdd(this, _lastTagClassMap, null);
  }
  update(_part, [value, markdownRenderer, markdownOptions]) {
    const jsonTagClassMap = JSON.stringify(markdownOptions == null ? void 0 : markdownOptions.tagClassMap);
    if (__privateGet(this, _lastValue) === value && jsonTagClassMap === __privateGet(this, _lastTagClassMap)) {
      return E;
    }
    __privateSet(this, _lastValue, value);
    __privateSet(this, _lastTagClassMap, jsonTagClassMap);
    return this.render(value, markdownRenderer, markdownOptions);
  }
  /**
   * Renders the markdown string to HTML using the injected markdown renderer,
   * if present. Otherwise, it returns the value wrapped in a span.
   */
  render(value, markdownRenderer, markdownOptions) {
    if (markdownRenderer) {
      const rendered = markdownRenderer(value, markdownOptions).then((value2) => {
        return o12(value2);
      });
      return m4(rendered, b2`<span class="no-markdown-renderer">${value}</span>`);
    }
    const dynamicRendererPromise = (async () => {
      try {
        const { renderMarkdown: renderMarkdown2 } = await Promise.resolve().then(() => (init_markdown(), markdown_exports));
        const rendered = await renderMarkdown2(value, markdownOptions);
        return o12(rendered);
      } catch (e11) {
        if (!_MarkdownDirective.defaultMarkdownWarningLogged) {
          console.warn("[MarkdownDirective] Failed to load optional `@a2ui/markdown-it` renderer. Using fallback regex.");
          _MarkdownDirective.defaultMarkdownWarningLogged = true;
        }
        return b2`<span class="no-markdown-renderer">${value}</span>`;
      }
    })();
    return m4(dynamicRendererPromise, b2`<span class="no-markdown-renderer">${value}</span>`);
  }
};
_lastValue = new WeakMap();
_lastTagClassMap = new WeakMap();
_MarkdownDirective.defaultMarkdownWarningLogged = false;
var MarkdownDirective = _MarkdownDirective;
var markdown = e7(MarkdownDirective);

// ../../node_modules/@a2ui/lit/src/0.8/ui/context/context.js
var context_exports = {};
__export(context_exports, {
  markdown: () => markdown2,
  theme: () => theme,
  themeContext: () => themeContext
});

// ../../node_modules/@a2ui/lit/src/0.8/ui/context/markdown.js
var markdown2 = n7(/* @__PURE__ */ Symbol("A2UIMarkdown"));

// ../../node_modules/@a2ui/lit/src/0.8/ui/text.js
var __esDecorate19 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers19 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Text = (() => {
  var _a7, _text_accessor_storage, _usageHint_accessor_storage, _markdownRenderer_accessor_storage, __this_instances, renderText_fn, areHintedStyles_fn, getAdditionalStyles_fn, _b2;
  let _classDecorators = [t3("a2ui-text")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _text_decorators;
  let _text_initializers = [];
  let _text_extraInitializers = [];
  let _usageHint_decorators;
  let _usageHint_initializers = [];
  let _usageHint_extraInitializers = [];
  let _markdownRenderer_decorators;
  let _markdownRenderer_initializers = [];
  let _markdownRenderer_extraInitializers = [];
  var Text2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _text_accessor_storage, __runInitializers19(this, _text_initializers, null));
      __privateAdd(this, _usageHint_accessor_storage, (__runInitializers19(this, _text_extraInitializers), __runInitializers19(this, _usageHint_initializers, null)));
      __privateAdd(this, _markdownRenderer_accessor_storage, (__runInitializers19(this, _usageHint_extraInitializers), __runInitializers19(this, _markdownRenderer_initializers, void 0)));
      __runInitializers19(this, _markdownRenderer_extraInitializers);
    }
    get text() {
      return __privateGet(this, _text_accessor_storage);
    }
    set text(value) {
      __privateSet(this, _text_accessor_storage, value);
    }
    get usageHint() {
      return __privateGet(this, _usageHint_accessor_storage);
    }
    set usageHint(value) {
      __privateSet(this, _usageHint_accessor_storage, value);
    }
    // Allow users to specify their own markdown renderer,
    // or the one provided by @a2ui/markdown-it.
    get markdownRenderer() {
      return __privateGet(this, _markdownRenderer_accessor_storage);
    }
    set markdownRenderer(value) {
      __privateSet(this, _markdownRenderer_accessor_storage, value);
    }
    render() {
      var _a7;
      const classes = styles_exports.merge(this.theme.components.Text.all, this.usageHint ? this.theme.components.Text[this.usageHint] : {});
      return b2`<section
      class=${e9(classes)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Text) ? o10(__privateMethod(this, __this_instances, getAdditionalStyles_fn).call(this)) : A}
    >
      ${__privateMethod(this, __this_instances, renderText_fn).call(this)}
    </section>`;
    }
  }, _text_accessor_storage = new WeakMap(), _usageHint_accessor_storage = new WeakMap(), _markdownRenderer_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderText_fn = function() {
    var _a7;
    let textValue = null;
    if (this.text && typeof this.text === "object") {
      if ("literalString" in this.text && this.text.literalString) {
        textValue = this.text.literalString;
      } else if ("literal" in this.text && this.text.literal !== void 0) {
        textValue = this.text.literal;
      } else if (this.text && "path" in this.text && this.text.path) {
        if (!this.processor || !this.component) {
          return b2`(no model)`;
        }
        const value = this.processor.getData(this.component, this.text.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (value !== null && value !== void 0) {
          textValue = value.toString();
        }
      }
    }
    if (textValue === null || textValue === void 0) {
      return b2`(empty)`;
    }
    let markdownText = textValue;
    switch (this.usageHint) {
      case "h1":
        markdownText = `# ${markdownText}`;
        break;
      case "h2":
        markdownText = `## ${markdownText}`;
        break;
      case "h3":
        markdownText = `### ${markdownText}`;
        break;
      case "h4":
        markdownText = `#### ${markdownText}`;
        break;
      case "h5":
        markdownText = `##### ${markdownText}`;
        break;
      case "caption":
        markdownText = `*${markdownText}*`;
        break;
      default:
        break;
    }
    return b2`${markdown(markdownText, this.markdownRenderer, {
      tagClassMap: styles_exports.appendToAll(this.theme.markdown, ["ol", "ul", "li"], {})
    })}`;
  }, areHintedStyles_fn = function(styles) {
    if (typeof styles !== "object")
      return false;
    if (Array.isArray(styles))
      return false;
    if (!styles)
      return false;
    const expected = ["h1", "h2", "h3", "h4", "h5", "h6", "caption", "body"];
    return expected.every((v3) => v3 in styles);
  }, getAdditionalStyles_fn = function() {
    var _a7, _b3;
    let additionalStyles = {};
    const styles = (_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Text;
    if (!styles)
      return additionalStyles;
    if (__privateMethod(this, __this_instances, areHintedStyles_fn).call(this, styles)) {
      const hint = (_b3 = this.usageHint) != null ? _b3 : "body";
      additionalStyles = styles[hint];
    } else {
      additionalStyles = styles;
    }
    return additionalStyles;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _text_decorators = [n4()];
    _usageHint_decorators = [n4({ reflect: true, attribute: "usage-hint" })];
    _markdownRenderer_decorators = [c5({ context: markdown2 })];
    __esDecorate19(_b2, null, _text_decorators, { kind: "accessor", name: "text", static: false, private: false, access: { has: (obj) => "text" in obj, get: (obj) => obj.text, set: (obj, value) => {
      obj.text = value;
    } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
    __esDecorate19(_b2, null, _usageHint_decorators, { kind: "accessor", name: "usageHint", static: false, private: false, access: { has: (obj) => "usageHint" in obj, get: (obj) => obj.usageHint, set: (obj, value) => {
      obj.usageHint = value;
    } }, metadata: _metadata }, _usageHint_initializers, _usageHint_extraInitializers);
    __esDecorate19(_b2, null, _markdownRenderer_decorators, { kind: "accessor", name: "markdownRenderer", static: false, private: false, access: { has: (obj) => "markdownRenderer" in obj, get: (obj) => obj.markdownRenderer, set: (obj, value) => {
      obj.markdownRenderer = value;
    } }, metadata: _metadata }, _markdownRenderer_initializers, _markdownRenderer_extraInitializers);
    __esDecorate19(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Text2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      :host {
        display: block;
        flex: var(--weight);
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        line-height: inherit;
        font: inherit;
      }
    `
  ], __runInitializers19(_classThis, _classExtraInitializers), _b2);
  return Text2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/video.js
var __esDecorate20 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f4) {
    if (f4 !== void 0 && typeof f4 !== "function") throw new TypeError("Function expected");
    return f4;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _2, done = false;
  for (var i11 = decorators.length - 1; i11 >= 0; i11--) {
    var context = {};
    for (var p5 in contextIn) context[p5] = p5 === "access" ? {} : contextIn[p5];
    for (var p5 in contextIn.access) context.access[p5] = contextIn.access[p5];
    context.addInitializer = function(f4) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f4 || null));
    };
    var result = (0, decorators[i11])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_2 = accept(result.get)) descriptor.get = _2;
      if (_2 = accept(result.set)) descriptor.set = _2;
      if (_2 = accept(result.init)) initializers.unshift(_2);
    } else if (_2 = accept(result)) {
      if (kind === "field") initializers.unshift(_2);
      else descriptor[key] = _2;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers20 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i11 = 0; i11 < initializers.length; i11++) {
    value = useValue ? initializers[i11].call(thisArg, value) : initializers[i11].call(thisArg);
  }
  return useValue ? value : void 0;
};
var Video = (() => {
  var _a7, _url_accessor_storage, __this_instances, renderVideo_fn, _b2;
  let _classDecorators = [t3("a2ui-video")];
  let _classDescriptor;
  let _classExtraInitializers = [];
  let _classThis;
  let _classSuper = Root;
  let _url_decorators;
  let _url_initializers = [];
  let _url_extraInitializers = [];
  var Video2 = (_b2 = class extends _classSuper {
    constructor() {
      super(...arguments);
      __privateAdd(this, __this_instances);
      __privateAdd(this, _url_accessor_storage, __runInitializers20(this, _url_initializers, null));
      __runInitializers20(this, _url_extraInitializers);
    }
    get url() {
      return __privateGet(this, _url_accessor_storage);
    }
    set url(value) {
      __privateSet(this, _url_accessor_storage, value);
    }
    render() {
      var _a7, _b3;
      return b2`<section
      class=${e9(this.theme.components.Video)}
      style=${((_a7 = this.theme.additionalStyles) == null ? void 0 : _a7.Video) ? o10((_b3 = this.theme.additionalStyles) == null ? void 0 : _b3.Video) : A}
    >
      ${__privateMethod(this, __this_instances, renderVideo_fn).call(this)}
    </section>`;
    }
  }, _url_accessor_storage = new WeakMap(), __this_instances = new WeakSet(), renderVideo_fn = function() {
    var _a7;
    if (!this.url) {
      return A;
    }
    if (this.url && typeof this.url === "object") {
      if ("literalString" in this.url) {
        return b2`<video controls src=${this.url.literalString} />`;
      } else if ("literal" in this.url) {
        return b2`<video controls src=${this.url.literal} />`;
      } else if (this.url && "path" in this.url && this.url.path) {
        if (!this.processor || !this.component) {
          return b2`(no processor)`;
        }
        const videoUrl = this.processor.getData(this.component, this.url.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);
        if (!videoUrl) {
          return b2`Invalid video URL`;
        }
        if (typeof videoUrl !== "string") {
          return b2`Invalid video URL`;
        }
        return b2`<video controls src=${videoUrl} />`;
      }
    }
    return b2`(empty)`;
  }, _classThis = _b2, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a7 = _classSuper[Symbol.metadata]) != null ? _a7 : null) : void 0;
    _url_decorators = [n4()];
    __esDecorate20(_b2, null, _url_decorators, { kind: "accessor", name: "url", static: false, private: false, access: { has: (obj) => "url" in obj, get: (obj) => obj.url, set: (obj, value) => {
      obj.url = value;
    } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
    __esDecorate20(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
    Video2 = _classThis = _classDescriptor.value;
    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _b2.styles = [
    structuralStyles2,
    i`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      video {
        display: block;
        width: 100%;
      }
    `
  ], __runInitializers20(_classThis, _classExtraInitializers), _b2);
  return Video2 = _classThis;
})();

// ../../node_modules/@a2ui/lit/src/0.8/ui/custom-components/index.js
function registerCustomComponents() {
}

// ../../node_modules/@a2ui/lit/src/0.8/ui/ui.js
function instanceOf(tagName) {
  const ctor = customElements.get(tagName);
  if (!ctor) {
    console.warn("No element definition for", tagName);
    return;
  }
  return new ctor();
}

// src/compat/litCompat08.entry.js
init_markdown();

// src/components/BaseRenderer/defaultA2uiV08Theme.js
function cloneClassMap(clazz) {
  return { ...clazz };
}
var a3 = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-as-n": true,
  "layout-dis-iflx": true,
  "layout-al-c": true,
  "typography-td-none": true,
  "color-c-p40": true
};
var audio = {
  "layout-w-100": true
};
var body = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-mt-0": true,
  "layout-mb-2": true,
  "typography-sz-bm": true,
  "color-c-n10": true
};
var button = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-pt-3": true,
  "layout-pb-3": true,
  "layout-pl-5": true,
  "layout-pr-5": true,
  "layout-mb-1": true,
  "border-br-16": true,
  "border-bw-0": true,
  "border-c-n70": true,
  "border-bs-s": true,
  "color-bgc-s30": true,
  "behavior-ho-80": true
};
var heading2 = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-500": true,
  "layout-mt-0": true,
  "layout-mb-2": true
};
var iframe = {
  "behavior-sw-n": true
};
var input = {
  "typography-f-sf": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-pl-4": true,
  "layout-pr-4": true,
  "layout-pt-2": true,
  "layout-pb-2": true,
  "border-br-6": true,
  "border-bw-1": true,
  "color-bc-s70": true,
  "border-bs-s": true,
  "layout-as-n": true,
  "color-c-n10": true
};
var p4 = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true
};
var orderedList = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true
};
var unorderedList = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true
};
var listItem = {
  "typography-f-s": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "layout-m-0": true,
  "typography-sz-bm": true,
  "layout-as-n": true,
  "color-c-n10": true
};
var pre = {
  "typography-f-c": true,
  "typography-fs-n": true,
  "typography-w-400": true,
  "typography-sz-bm": true,
  "typography-ws-p": true,
  "layout-as-n": true
};
var textarea = {
  ...input,
  "layout-r-none": true,
  "layout-fs-c": true
};
var video = {
  "layout-el-cv": true
};
var aLight = cloneClassMap(a3);
var inputLight = cloneClassMap(input);
var textareaLight = cloneClassMap(textarea);
var buttonLight = cloneClassMap(button);
var bodyLight = cloneClassMap(body);
var pLight = cloneClassMap(p4);
var preLight = cloneClassMap(pre);
var orderedListLight = cloneClassMap(orderedList);
var unorderedListLight = cloneClassMap(unorderedList);
var listItemLight = cloneClassMap(listItem);
var DEFAULT_A2UI_V08_THEME = {
  additionalStyles: {},
  components: {
    AudioPlayer: {},
    Button: {
      "layout-pt-2": true,
      "layout-pb-2": true,
      "layout-pl-3": true,
      "layout-pr-3": true,
      "border-br-12": true,
      "border-bw-0": true,
      "border-bs-s": true,
      "color-bgc-p30": true,
      "behavior-ho-70": true,
      "typography-w-400": true
    },
    Card: { "border-br-9": true, "layout-p-4": true, "color-bgc-n100": true },
    CheckBox: {
      element: {
        "layout-m-0": true,
        "layout-mr-2": true,
        "layout-p-2": true,
        "border-br-12": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true
      },
      label: {
        "color-c-p30": true,
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-flx-1": true,
        "typography-sz-ll": true
      },
      container: {
        "layout-dsp-iflex": true,
        "layout-al-c": true
      }
    },
    Column: {
      "layout-g-2": true
    },
    DateTimeInput: {
      container: {
        "typography-sz-bm": true,
        "layout-w-100": true,
        "layout-g-2": true,
        "layout-dsp-flexhor": true,
        "layout-al-c": true,
        "typography-ws-nw": true
      },
      label: {
        "color-c-p30": true,
        "typography-sz-bm": true
      },
      element: {
        "layout-pt-2": true,
        "layout-pb-2": true,
        "layout-pl-3": true,
        "layout-pr-3": true,
        "border-br-2": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true
      }
    },
    Divider: {},
    Image: {
      all: {
        "border-br-5": true,
        "layout-el-cv": true,
        "layout-w-100": true,
        "layout-h-100": true
      },
      avatar: { "is-avatar": true },
      header: {},
      icon: {},
      largeFeature: {},
      mediumFeature: {},
      smallFeature: {}
    },
    Icon: {},
    List: {
      "layout-g-4": true,
      "layout-p-2": true
    },
    Modal: {
      backdrop: { "color-bbgc-p60_20": true },
      element: {
        "border-br-2": true,
        "color-bgc-p100": true,
        "layout-p-4": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bc-p80": true
      }
    },
    MultipleChoice: {
      container: {},
      label: {},
      element: {}
    },
    Row: {
      "layout-g-4": true
    },
    Slider: {
      container: {},
      label: {},
      element: {}
    },
    Tabs: {
      container: {},
      controls: { all: {}, selected: {} },
      element: {}
    },
    Text: {
      all: {
        "layout-w-100": true,
        "layout-g-2": true
      },
      h1: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-hs": true
      },
      h2: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-tl": true
      },
      h3: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-tl": true
      },
      h4: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-bl": true
      },
      h5: {
        "typography-f-sf": true,
        "typography-v-r": true,
        "typography-w-400": true,
        "layout-m-0": true,
        "layout-p-0": true,
        "typography-sz-bm": true
      },
      body: {},
      caption: {}
    },
    TextField: {
      container: {
        "typography-sz-bm": true,
        "layout-w-100": true,
        "layout-g-2": true,
        "layout-dsp-flexhor": true,
        "layout-al-c": true,
        "typography-ws-nw": true
      },
      label: {
        "layout-flx-0": true,
        "color-c-p30": true
      },
      element: {
        "typography-sz-bm": true,
        "layout-pt-2": true,
        "layout-pb-2": true,
        "layout-pl-3": true,
        "layout-pr-3": true,
        "border-br-2": true,
        "border-bw-1": true,
        "border-bs-s": true,
        "color-bgc-p100": true,
        "color-bc-p60": true,
        "color-c-n30": true,
        "color-c-p30": true
      }
    },
    Video: {
      "border-br-5": true,
      "layout-el-cv": true
    }
  },
  elements: {
    a: aLight,
    audio,
    body: bodyLight,
    button: buttonLight,
    h1: heading2,
    h2: heading2,
    h3: heading2,
    h4: heading2,
    h5: heading2,
    iframe,
    input: inputLight,
    p: pLight,
    pre: preLight,
    textarea: textareaLight,
    video
  },
  markdown: {
    p: [...Object.keys(pLight || {})],
    h1: [...Object.keys(heading2 || {})],
    h2: [...Object.keys(heading2 || {})],
    h3: [...Object.keys(heading2 || {})],
    h4: [...Object.keys(heading2 || {})],
    h5: [...Object.keys(heading2 || {})],
    ul: [...Object.keys(unorderedListLight || {})],
    ol: [...Object.keys(orderedListLight || {})],
    li: [...Object.keys(listItemLight || {})],
    a: [...Object.keys(aLight || {})],
    strong: [],
    em: []
  }
};

// src/compat/litCompat08.entry.js
var { createSignalA2uiMessageProcessor } = Data;
var { componentRegistry: componentRegistry2 } = ui_exports;
var { registerCustomComponents: registerCustomComponents2 } = ui_exports;
function patchCustomElementsDefineGuard() {
  if (typeof window === "undefined" || !window.customElements) return;
  const ce = window.customElements;
  if (ce.__a2uiPatchedDefine) return;
  const originalDefine = ce.define.bind(ce);
  ce.define = (name, ctor, options) => {
    const existedCtor = ce.get(name);
    if (existedCtor) {
      if (existedCtor !== ctor) {
        console.warn(`[A2UI Lit] skip redefining custom element "${name}" during HMR`);
      }
      return;
    }
    return originalDefine(name, ctor, options);
  };
  ce.__a2uiPatchedDefine = true;
}
patchCustomElementsDefineGuard();
var fallbackTheme = DEFAULT_A2UI_V08_THEME;
function ensureTheme(theme2) {
  var _a7;
  const next = theme2 && typeof theme2 === "object" ? theme2 : {};
  if (!next.components) {
    next.components = DEFAULT_A2UI_V08_THEME.components;
  }
  if (!next.additionalStyles) {
    next.additionalStyles = (_a7 = DEFAULT_A2UI_V08_THEME.additionalStyles) != null ? _a7 : {};
  }
  if (!next.elements) {
    next.elements = DEFAULT_A2UI_V08_THEME.elements;
  }
  if (!next.markdown) {
    next.markdown = DEFAULT_A2UI_V08_THEME.markdown;
  }
  return next;
}
function patchThemeGuard(Ctor) {
  if (!Ctor || !Ctor.prototype) return;
  const proto = Ctor.prototype;
  const hasThemeAccessor = Object.prototype.hasOwnProperty.call(proto, "theme") || "theme" in proto;
  if (!hasThemeAccessor) return;
  const wrap = (methodName) => {
    const original = proto[methodName];
    proto[methodName] = function patchedThemeGuard(...args) {
      var _a7;
      this.theme = ensureTheme((_a7 = this.theme) != null ? _a7 : fallbackTheme);
      if ("markdownRenderer" in this && !this.markdownRenderer) {
        this.markdownRenderer = renderMarkdown;
      }
      if (typeof original === "function") {
        return original.apply(this, args);
      }
      return void 0;
    };
  };
  wrap("connectedCallback");
  wrap("willUpdate");
  wrap("render");
}
Object.values(ui_exports || {}).forEach((maybeCtor) => patchThemeGuard(maybeCtor));
export {
  componentRegistry2 as componentRegistry,
  createSignalA2uiMessageProcessor,
  registerCustomComponents2 as registerCustomComponents
};
