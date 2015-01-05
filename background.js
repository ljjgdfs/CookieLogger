
function set_cookies_parser(url, set_list) {
    var https_source_flag = url_parser.get_protocol(url) == "https" ? true : false;
    var set_cookies = [];
    for (var i in set_list) {
        var c = new Cookie();
        c.url = url;
        c.domain = url_parser.get_domain(url);
        c.path = url_parser.get_path(url);
        c.creation_time = Date().toString();
        c.last_access_time = Date().toString();
        c.persistent_flag = false;
        c.host_only_flag = true;
        c.secure_only_flag = false;
        c.http_only_flag = false;
        c.https_source_flag = https_source_flag;

        var s = set_list[i];
        var pairs = s.split(";").map(function(item, index, array){
            return item.trim();
        });

        var kv = pairs[0].split("=");
        if (kv.length < 2) continue;

        c.name = kv[0];
        c.value = kv.slice(1).join("=");

        for (var p = 1; p < pairs.length; p++) {
            var tmp = pairs[p].split("=");
            if (tmp[0].toLowerCase() == "domain") {
                var d = tmp[1];
                d = url_parser.satinize_domain(d);
                c.domain = d.toLowerCase();
                c.host_only_flag = false;
            } else if (tmp[0].toLowerCase() == "path") {
                c.path = tmp[1];
            } else if (tmp[0].toLowerCase() == "expires") {
                var t = new Date(tmp[1]);
                c.expiry_time = t.toString();
                c.persistent_flag = true;
            } else if (tmp[0].toLowerCase() == "secure") {
                c.secure_only_flag = true;
            } else if (tmp[0].toLowerCase() == "httponly") {
                c.http_only_flag = true;
            }
        }
        set_cookies.push(c);
    }
    return set_cookies;
}

chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
      if (cookie_logger.get_log_state() == "disable") {
        return;
      }
      
      var url = info.url;
      var responseHeaders = info.responseHeaders;
      var set_cookie_strings = [];
      for (var item in responseHeaders) {
          if (responseHeaders[item].name.toLowerCase() == "set-cookie") {
              var vals = responseHeaders[item].value;
              set_cookie_strings.push(vals)
          }
      }
      var set_cookie_list = set_cookies_parser(url, set_cookie_strings);
      cookie_logger.save_cookies(url, set_cookie_list);
  },

  {
    urls: [
      "http://*/*",
      "https://*/*",
    ],
  },

  ["blocking", "responseHeaders"]
);

function openAboutPage() {
    var url = "about.html";

    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.create({
            url:url,
        });
    });
}
