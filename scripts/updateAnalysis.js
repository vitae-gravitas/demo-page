function updateUI(fileId) {
    var database = firebase.database();
    var repsRef = database.ref(fileId + "/num_reps");
    repsRef.once("value", function (data) {
        var numReps = data.val();

        var depthRef = database.ref(fileId + "/hit_depths");
        depthRef.once("value", function (data) {
            var depthData = data.val();

            var straightnessRef = database.ref(fileId + "/straightness_metrics");
            straightnessRef.once("value", function (data) {
                var straightnessData = data.val();

                updateOverallStats(straightnessData, depthData);

                var tabsHTML = "";
                var contentHTML = "";
                for (var i = 1; i < numReps + 1; i++) {
                    tabsHTML += '<a class="list-group-item list-group-item-action" id="list-"' + i + '"-list" data-toggle="list" href="#list-' + i + '" role="tab" aria-controls="' + i + '">' + i + '</a>';

                    contentHTML += '<div class="tab-pane fade" id="list-' + i + '" role="tabpanel" aria-labelledby="list-' + i + '-list"></div>';
                }

                document.getElementById('list-tab').innerHTML = tabsHTML;
                document.getElementById('nav-tabContent').innerHTML = contentHTML;

                for (var i = 1; i < numReps + 1; i++) {
                    populateRepAnalysis(fileId, i, depthData[i - 1], [straightnessData[i - 1], straightnessData[2 * i - 1]]);
                }
            });
        });
    });
}

function populateRepAnalysis(fileId, index, hitDepth, straightnessMetrics) {
    if (hitDepth) {
        var poseMessage = "You hit depth properly on this rep. <b>Good job!</b>";
    } else {
        var poseMessage = "You <b>didn't</b> hit depth on this rep! Unfortunate...";
    }

    var avgStraightness = (straightnessMetrics[0] + straightnessMetrics[1]) / 2;
    if (avgStraightness > 95) {
        var straightnessMessage = "Amazing!";
    } else if (avgStraightness > 70) {
        var straightnessMessage = "Not bad!";
    } else if (avgStraightness > 40) {
        var straightnessMessage = "Hm.";
    } else {
        var straightnessMessage = "Uh oh.";
    }

    document.getElementById("list-" + index).innerHTML += `<div class="row">
                                <div class="col">
                                    <div class="card">
                                        <img id="pose-img-` + index + `" class="card-img-top" src="https://fuckyeahheavylifting.files.wordpress.com/2013/04/tumblr_mfx4ri6tgn1qfg4g6o1_1280.jpg" alt="Card image cap">
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <div class="card-header">
                                            Rep 1: Pose Estimation
                                        </div>
                                        <div class="card-body">
                                            <h6 class="card-subtitle mb-2 text-muted">Did you hit depth?</h6>
                                            <p class="card-text">Here we use AI to get your body's joints and see if you're performing the movement correctly. ` + poseMessage + `</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top: 20px;">
                                <div class="col-6">
                                    <div class="card">
                                        <div class="carousel slide" id="carousel-` + index + `" data-ride="carousel">
                                          <ol class="carousel-indicators">
                                            <li data-target="carousel-` + index + `" data-slide-to="0" class="active"></li>
                                            <li data-target="carousel-` + index + `" data-slide-to="1"></li>
                                          </ol>
                                            <div class="carousel-inner">
                                                <div class="carousel-item active">
                                                    <img id="carousel-img-` + index + `-1" class="d-block w-100" src="" alt="First slide">
                                                </div>
                                                <div class="carousel-item">
                                                    <img id="carousel-img-` + index + `-2" class="d-block w-100" src="" alt="Second slide">
                                                </div>
                                            </div>
                                            <a id="carousel-control-prev-`+index+`" class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="sr-only">Previous</span>
                                            </a>
                                            <a id="carousel-control-next-`+index+`" class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="sr-only">Next</span>
                                            </a>
                                        </div>                                        </video>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card">
                                        <div class="card-header">
                                            Rep 1: Weight Tracking
                                        </div>
                                        <div class="card-body">
                                            <h6 class="card-subtitle mb-2 text-muted">Was your bar path straight?</h6>
                                            <p class="card-text">` + straightnessMessage + ` The path your bar took was ` + straightnessMetrics[0] + `% straight on the way down, and ` + straightnessMetrics[1] + `% straight on the way up.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

    var storage = firebase.storage();
    storage.ref().child("analyzed-poseImages/" + fileId + "/" + index + ".jpg").getDownloadURL().then(function (url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
            var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        document.getElementById('pose-img-' + index).src = url;
    }).catch(function (error) {
        console.log("Couldn't get depth image: " + index);
    });

    storage.ref().child("analyzed-videos/" + fileId + "/" + (2 * index - 1) + ".jpg").getDownloadURL().then(function (url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
            var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        var firstImgURL = url;
        storage.ref().child("analyzed-videos/" + fileId + "/" + (2 * index) + ".jpg").getDownloadURL().then(function (url) {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            var secondImgURL = url;

            document.getElementById('carousel-img-' + index + '-1').src = firstImgURL;
            document.getElementById('carousel-img-' + index + '-2').src = secondImgURL;

            $('#carousel-' + index).carousel();
            $('#carousel-control-prev-'+index).on('click', function () {
                $('#carousel-' + index).carousel('prev');
            })

            $('#carousel-control-next-'+index).on('click', function () {
                $('#carousel-' + index).carousel('next');
            })
            
        }).catch(function (error) {
            console.log("Couldn't get path video for index " + (index + 0.5));
            console.warn(error);
        });
    }).catch(function (error) {
        console.log("Couldn't get path video for index " + index);
        console.warn(error);
    });
}

//updateUI("1566545891151_master");
