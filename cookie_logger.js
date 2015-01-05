function Cookie(url, name, domain, path, host_only_flag, https_source_flag,
                value, expiry_time, creation_time, last_access_time,
                persistent_flag, secure_only_flag, http_only_flag) {
    this.url = url;
    this.name = name;
    this.domain = domain;
    this.path = path;
    this.host_only_flag = host_only_flag;
    this.https_source_flag = https_source_flag;
    this.value = value;
    this.expiry_time = expiry_time;
    this.creation_time = creation_time;
    this.last_access_time = last_access_time;
    this.persistent_flag = persistent_flag;
    this.secure_only_flag = secure_only_flag;
    this.http_only_flag = http_only_flag;
}

Cookie.prototype = {
    constructor : Cookie,
    toKeyValue : function() {
        var key = {
            url : this.url,
            name : this.name,
            domain : this.domain,
            path : this.path,
            host_only_flag : this.host_only_flag,
            https_source_flag : this.https_source_flag
        };
        var value = {
            value : this.value,
            expiry_time : this.expiry_time,
            creation_time : this.creation_time,
            last_access_time : this.last_access_time,
            persistent_flag : this.persistent_flag,
            secure_only_flag : this.secure_only_flag,
            http_only_flag : this.http_only_flag
        };
        return {'key': JSON.stringify(key), 'value': JSON.stringify(value)};
    },

    fromKeyValue : function(k, v) {
        var key = JSON.parse(k);
        var value = JSON.parse(v);

        this.url = key.url;
        this.name = key.name;
        this.domain = key.domain;
        this.path = key.path;
        this.host_only_flag = key.host_only_flag;
        this.https_source_flag = key.https_source_flag;

        this.value = value.value;
        this.expiry_time = value.expiry_time;
        this.creation_time = value.creation_time;
        this.last_access_time = value.last_access_time;
        this.persistent_flag = value.persistent_flag;
        this.secure_only_flag = value.secure_only_flag;
        this.http_only_flag = value.http_only_flag;
    }
}

var cookie_logger = {
    cookie_store: [],

    get_log_state: function() {
        if (localStorage.start_log == undefined) {
            localStorage.start_log = "disable"; 
        }
        return localStorage.start_log;
    },

    set_log_state: function(state) {
        localStorage.start_log = state;
    },

    get_url_flag: function() {
        if (localStorage.full_url == undefined) {
            localStorage.full_url = "full";
        }
        return localStorage.full_url;
    },

    set_url_flag: function(flag) {
        localStorage.full_url = flag;
    },

    load_cookies: function(f) {
        console.log("Loading cookies from storage ...");
        if (f) {
            chrome.storage.local.get(f);
            return;
        }

        var that = this;
        that.cookie_store = [];

        chrome.storage.local.get(
                function(data) {
                    for (var k in data) {
                        if (k == "tasks") continue;
                        var tmp = new Cookie();
                        tmp.fromKeyValue(k, data[k]);
                        that.cookie_store.push(tmp);
                    }
                    console.log("All the cookies have been loaded.");
                }
        );
    },

    clear_cookies: function() {
        this.cookie_store = [];
        chrome.storage.local.clear(
                function() {
                    console.log("All the cookies have been cleared.");
                }
        );
    },

    process_url: function(url_input) {
        if (this.get_url_flag() == "path") {
            return url_input.substr(0, url_input.indexOf("?"));
        }
        return url_input;
    },

    save_cookies: function(from_url, cookie_list) {
//        if (this.get_log_state() == "disable") {
//            return;
//       }

        if (cookie_list.length == 0) return;

        var to_log = {};
        var new_url = this.process_url(from_url);

        for (var i in cookie_list) {
            var c = cookie_list[i];
            var key = {
                url: new_url,
                name : c.name,
                domain : c.domain,
                path : c.path,
                host_only_flag : c.host_only_flag,
                https_source_flag : c.https_source_flag
            };
            var value = {
                value : c.value,
                expiry_time : c.expiry_time,
                creation_time : c.creation_time,
                last_access_time : c.last_access_time,
                persistent_flag : c.persistent_flag,
                secure_only_flag : c.secure_only_flag,
                http_only_flag : c.http_only_flag
            };
            to_log[JSON.stringify(key)] = JSON.stringify(value);
        }

        chrome.storage.local.set(
                to_log,
                function() {
                    console.log("Cookies from " + from_url + " have been saved.");
                }
        );
    }
};

