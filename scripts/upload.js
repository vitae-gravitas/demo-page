inputElement = document.querySelector('input[type="file"]');
pond = FilePond.create(inputElement);

pond.on('addfile', (error, file) => {
    if (error) {
        console.error('Adding file gone wrong: ' + error);
        return;
    }

    // FIREBASE STUFF
    var fileId = Date.now() + "_" + file.file.name;
    var fileIdNoExt = fileId.replace(/\.[^/.]+$/, "");

    // Upload it to database
    firebase.database().ref(fileIdNoExt).set({
        barbell_completed: 0,
        pose_completed: 0,
    });

    // Upload it to storage
    uploadTask = firebase.storage().ref().child("input/" + fileId).put(file.file);

    // Get the DOM progress bar element.
    document.getElementById('path-progress-bar').style.width = "0%";
    document.getElementById('pose-progress-bar').style.width = "0%";
    progressBar = document.getElementById('video-progress-bar');
    progressBar.style.background = "linear-gradient(to right, #457fca, #5691c8)";

    // If the user removes the file, then cancel the upload.
    pond.on('removefile', (error, file) => {
        if (error) {
            console.error("File removal gone wrong: " + error);
            return;
        }

        // Cancel the upload
        uploadTask.cancel();
        // Delete the realtime database node
        firebase.database().ref(fileId.replace(/\.[^/.]+$/, "")).remove();
        progressBar.innerHTML = "Canceled.";
        progressBar.style.background = "linear-gradient(to right, #ef473a, #cb2d3e)";
    });

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = progress + "%";
            progressBar.innerHTML = "Uploading: " + Math.round(progress) + "%";
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    console.warn("User doesn't have permission to upload this.");
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    console.warn("User canceled the upload.");
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    console.warn("Unkown error occured.");
                    break;
            }
        },
        function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
            });

            // Wake up Server
            const url = 'http://13.57.203.241/analyze?videoId=' + fileId;
            console.log(url);
            fetch(url).then(data => {
                return data.json();
            }).then(res => {
                if (res.processedId == fileId) {
                    console.log("SUCCESS.")

                    // Update progress bars
                    videoBar = document.getElementById('video-progress-bar');
                    videoBar.style.width = "0%";

                    videoBar = document.getElementById('video-progress-bar');
                    videoBar.style.width = "0%";

                    // WAIT FOR SERVER TO UPDATE REALTIME SERVER
                    var pathProgress = 0;
                    var poseProgress = 0;
                    var database = firebase.database();
                    var pathRef = database.ref(fileIdNoExt + "/barbell_completed");
                    pathRef.on("value", function (snapshot) {
                        // SERVER HAS UPDATED
                        console.log("PATH HAS UPDATED TO " + snapshot.val());
                        document.getElementById('path-progress-bar').style.width = snapshot.val() / 2 + "%";
                        document.getElementById('path-progress-bar').innerHTML = "Path: " + snapshot.val() + "%";
                        pathProgress = snapshot.val();
                        
                        if (poseProgress == 100 && pathProgress == 100) {
                            poseRef.off("value");
                            pathRef.off('value');
                            
                            updateUI(fileIdNoExt);
                        }
                    });

                    // WAIT FOR SERVER TO UPDATE REALTIME SERVER
                    var poseRef = database.ref(fileIdNoExt + "/pose_completed");
                    poseRef.on("value", function (snapshot) {
                        // SERVER HAS UPDATED
                        console.log("POSE HAS UPDATED TO " + snapshot.val());
                        document.getElementById('pose-progress-bar').style.width = snapshot.val() / 2 + "%";
                        document.getElementById('pose-progress-bar').innerHTML = "Pose: " + snapshot.val() + "%";
                        poseProgress = snapshot.val();
                    
                        if (poseProgress == 100 && pathProgress == 100) {
                            poseRef.off("value");
                            pathRef.off('value');
                            
                            updateUI(fileIdNoExt);
                        }
                    });
                }
            });
        });
});
