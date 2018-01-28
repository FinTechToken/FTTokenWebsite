// modified from https://gist.github.com/remy/350433
try {
    if (!window.localStorage) {
        throw "exception";
    }
    localStorage.setItem('storage_test', 1);
    localStorage.removeItem('storage_test');
} catch(e) {
    (function () {
        var Storage = function () {
            function createCookie(name, value, days) {
                var date, expires;
                if (days) {
                    date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                } else {
                    expires = "";
                }
                document.cookie = name+"="+value+expires+"; path=/; secure; SameSite=strict";
            }

            function readCookie(name) {
                var nameEQ = name + "=",
                    ca = document.cookie.split(';'),
                    i, c;
                for (i=0; i < ca.length; i++) {
                    c = ca[i];
                    while (c.charAt(0)==' ') {
                        c = c.substring(1,c.length);
                    }
                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length,c.length);
                    }
                }
                return null;
            }

            function setData(data) {
                data = encodeURIComponent(JSON.stringify(data));
                createCookie('localStorage', data, 365);
            }

            function clearData() {
                createCookie('localStorage', '', 365);
            }

            function getData() {
                var data = readCookie('localStorage');
                return data ? JSON.parse(decodeURIComponent(data)) : {};
            }

            var data = getData();

            return {
                length: 0,
                clear: function () {
                    data = {};
                    this.length = 0;
                    clearData();
                },
                getItem: function (key) {
                    return data[key] === undefined ? null : data[key];
                },
                key: function (i) {
                    var ctr = 0;
                    for (var k in data) {
                        if (ctr == i) return k;
                        else ctr++;
                    }
                    return null;
                },
                removeItem: function (key) {
                    delete data[key];
                    this.length--;
                    setData(data);
                },
                setItem: function (key, value) {
                    data[key] = value+'';
                    this.length++;
                    setData(data);
                }
            };
        };

        var localStorage = new Storage('local');
        window.localStorage = localStorage;
        window.localStorage.__proto__ = localStorage;
    })();
}
