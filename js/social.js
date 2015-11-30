if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
        var bytes = Array.prototype.map.call(string, function (c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function () {
    FB.init({
        appId: "1684804195065104",
        status: true,
        cookie: true,
        xfbml: true  // parse XFBML
    });
};

function postCanvasToFacebook() {
    var canvas = document.getElementById('defaultCanvas');
    console.log(canvas);
    var data = canvas.toDataURL("image/png");
    var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    var decodedPng = atob(encodedPng);
    console.log('hey');
    FB.getLoginStatus(function (response) {
        console.log('response', response);
        if (response.status === "connected") {
            postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
        } else if (response.status === "not_authorized") {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
            }, { scope: "publish_actions" });
        } else {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
            }, { scope: "publish_actions" });
        }
    });
}

function postImageToFacebook(authToken, na1, na2, na3, na4) {
    var canvas = document.getElementById("defaultCanvas");
    var imageData = canvas.toDataURL("image/png");
    try {
        blob = dataURItoBlob(imageData);
    } catch (e) {
        console.log(e);
    }
    var fd = new FormData();
    fd.append("access_token", authToken);
    fd.append("source", blob);
    fd.append("message", "Photo Text");
    try {
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + authToken,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("success " + data);
                $("#poster").html("Posted Canvas Successfully");
            },
            error: function (shr, status, data) {
                console.log("error " + data + " Status " + shr.status);
            },
            complete: function () {
                console.log("Posted to facebook");
            }
        });

    } catch (e) {
        console.log(e);
    }
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}