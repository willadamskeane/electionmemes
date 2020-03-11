if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
  XMLHttpRequest.prototype.sendAsBinary = function(string) {
    var bytes = Array.prototype.map.call(string, function(c) {
      return c.charCodeAt(0) & 0xff;
    });
    this.send(new Uint8Array(bytes).buffer);
  };
}

(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

window.fbAsyncInit = function() {
  FB.init({
    appId: "1684804195065104",
    status: true,
    cookie: true,
    xfbml: true // parse XFBML
  });
};

function postCanvasToFacebook() {
  var canvas = document.getElementById("defaultCanvas0");
  console.log(canvas);
  var data = canvas.toDataURL("image/png");
  var encodedPng = data.substring(data.indexOf(",") + 1, data.length);
  var decodedPng = atob(encodedPng);
  console.log("hey");
  FB.getLoginStatus(function(response) {
    console.log("response", response);
    if (response.status === "connected") {
      postImageToFacebook(
        response.authResponse.accessToken,
        "heroesgenerator",
        "image/png",
        decodedPng,
        "www.heroesgenerator.com"
      );
    } else if (response.status === "not_authorized") {
      FB.login(
        function(response) {
          postImageToFacebook(
            response.authResponse.accessToken,
            "heroesgenerator",
            "image/png",
            decodedPng,
            "www.heroesgenerator.com"
          );
        },
        { scope: "publish_actions" }
      );
    } else {
      FB.login(
        function(response) {
          postImageToFacebook(
            response.authResponse.accessToken,
            "heroesgenerator",
            "image/png",
            decodedPng,
            "www.heroesgenerator.com"
          );
        },
        { scope: "publish_actions" }
      );
    }
  });
}

function postImageToImgur() {
  // analytics.track('Shared', {
  //     type: 'Imgur'
  // });
  var canvas = document.getElementById("defaultCanvas0");
  try {
    var img = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
  } catch (e) {
    var img = canvas.toDataURL().split(",")[1];
  }

  // try {
  //     var img = dataURItoBlob(imageData);
  // } catch (e) {
  //     console.log(e);
  // }

  $.ajax({
    url: "https://api.imgur.com/3/image",
    type: "post",
    headers: {
      Authorization: "Client-ID fec6028335e2a26"
    },
    data: {
      image: img,
      type: ""
    },
    dataType: "json",
    success: function(response) {
      console.log(response);
      if (response.success) {
        location.replace(response.data.link);
      }
    }
  });

  // $.ajax({
  //     url: 'https://api.imgur.com/3/image',
  //     type: 'post',
  //     headers: {
  //         Authorization: 'Client-ID <CHANGE_THIS_TO_BE_YOUR_CLIENT_ID>'
  //     },
  //     data: {
  //         image: img
  //     },
  //     dataType: 'json',
  //     success: function (response) {
  //         if (response.success) {
  //             window.location = response.data.link;
  //         }
  //     }
  // });
}

function postImageToFacebook(authToken, na1, na2, na3, na4) {
  var canvas = document.getElementById("defaultCanvas0");
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
      success: function(data) {
        console.log("success " + data);
        $("#poster").html("Posted Canvas Successfully");
      },
      error: function(shr, status, data) {
        console.log("error " + data + " Status " + shr.status);
      },
      complete: function() {
        console.log("Posted to facebook");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png"
  });
}

function downloadCanvas() {
  //   analytics.track("Shared", {
  //     type: "Download"
  //   });
  save(candidates[activeCandidate].shortName + "-quote.jpg");
}

function shareTwitter() {
  //   analytics.track("Shared", {
  //     type: "Twitter"
  //   });
  window.open(
    "https://twitter.com/share?url=" +
      escape(window.location.href) +
      "&text=I can't believe what " +
      candidates[activeCandidate].name +
      " said! #everyquotecounts",
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
  );
  return false;
}

function shareFacebook() {
  //   analytics.track("Shared", {
  //     type: "Facebook"
  //   });
  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" +
      escape(window.location.href) +
      "&t=I can't believe what " +
      candidates[activeCandidate].name +
      " said! #everyquotecounts",
    "",
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
  );
  return false;
}
