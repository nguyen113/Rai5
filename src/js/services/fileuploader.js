(function(window, angular) {
    'use strict';
    angular.module('FileManagerApp').service('fileUploader', ['$http', '$q', 'fileManagerConfig', function ($http, $q, fileManagerConfig) {

        function deferredHandler(data, deferred, errorMessage) {
            if (!data || typeof data !== 'object') {
                return deferred.reject('Bridge response error, please check the docs');
            }
            if (data.result && data.result.error) {
                return deferred.reject(data);
            }
            if (data.error) {
                return deferred.reject(data);
            }
            if (errorMessage) {
                return deferred.reject(errorMessage);
            }
            deferred.resolve(data);
        }

        //Function send file info to server for saving
        function saveFileToDb(fileObject){
            if (!fileObject || typeof fileObject !== 'file'){
                var fileInfo = JSON.stringify({type:"file", filename:fileObject.name, filesize:fileObject.size, filetype:fileObject.type, filelastmodified:fileObject.lastModifiedDate});
                ////Gui thong tin file ve server
                //
                //                
                // $http.post(fileManagerConfig.uploadUrl, fileInfo, {
                // transformRequest: angular.identity,
                // headers: {
                //     'Content-Type': undefined
                // }
                // }).success(function(data) {
                //     deferredHandler(data, deferred);
                // }).error(function(data) {
                //     deferredHandler(data, deferred, 'Unknown error uploading files');
                // })['finally'](function() {
                //     self.requesting = false;
                // });
            }
            else {

                console.log('Not a file');
            }
        }

        //Function encode file to base64, using web worker to bring encode task to another thread.
        function encodeBase64(fileObject){
            if (!fileObject || typeof fileObject !== 'file'){
                console.log('Name: '+fileObject.name);
                console.log('Size: '+fileObject.size);
                console.log('Type: '+fileObject.type);
                console.log('ModifiedDate: '+fileObject.lastModifiedDate);
                var reader = new FileReader();
                reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    //document.getElementById("base64textarea").value = btoa(binaryString);
                    //console.log(btoa(binaryString));
                    //downloadFile(btoa(binaryString));
                    return btoa(binaryString);
                };


                reader.readAsBinaryString(fileObject);
            }
            else {

                console.log('Not a file');
            }
        }



        var saveByteArray = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());


        function decodeBase64(base64, fileName, fileExt){
            var binaryString =  window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++)        {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            saveByteArray([bytes], fileName + '.' fileExt);
        }

        //Save and upload file
        function saveToFile(base64, serverUrl){
            var params = {
                file: {
                    type: 'text/plain',
                    filename: Path.utils.basename(currentTab.id),
                    content: base64 /* File content goes here */
                },
                action: 'upload',
                overwrite: 'true',
                destination: '/'
            };

            var content = [];
            for(var i in params) {
                content.push('--' + boundary);

                var mimeHeader = 'Content-Disposition: form-data; name="'+i+'"; ';
                if(params[i].filename)
                    mimeHeader += 'filename="'+ params[i].filename +'";';
                content.push(mimeHeader);

                if(params[i].type)
                    content.push('Content-Type: ' + params[i].type);

                content.push('');
                content.push(params[i].content || params[i]);
            };

                /* Use your favorite toolkit here */
                /* it should still work if you can control headers and POST raw data */
            Ext.Ajax.request({
                method: 'POST',
                url: serverUrl,
                jsonData: content.join('\r\n'),
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Content-Length': content.length
                }
            });

        }

        //Function to split file to 3 equal file
        function splitFile(fileObject){
            //
        }


        //Create 4th file by xor 3 files
        function create4thFile(fileObject1, fileObject2, fileObject3){
            //
        }


        //Assign parts to cloud by adding information to file info
        function assignParts(fileObject1, fileObject2, fileObject3, fileObject4){

        }

        //Save parts information of file to Db
        function savePartsInfoToDb(fileObject){

        }

        //Upload parts to cloud
        function uploadToCloud(){

        }

        //Download file
        function downloadFile(stringData){
            var blob = new Blob([stringData], {type: 'image/jpeg'}); // pass a useful mime type here
            var url = URL.createObjectURL(blob);
            console.log(url);
            $("<a></a>").
            attr("href", url).
            attr("download", "data.jpeg").
            text("Download Data").
            appendTo('.modal-footer');
        }

        this.requesting = false; 
        

        //Upload file
        this.upload = function(fileList, path) {
            if (! window.FormData) {
                throw new Error('Unsupported browser version');
            }
            var self = this;
            var form = new window.FormData();
            var deferred = $q.defer();
            form.append('destination', '/' + path.join('/'));

            for (var i = 0; i < fileList.length; i++) {
                var fileObj = fileList.item(i);
                encodeBase64(fileObj);
                saveFileToDb(fileObj);
                fileObj instanceof window.File && form.append('file-' + i, fileObj);
            }
            self.requesting = true;

            //Upload file using Post method
            // $http.post(fileManagerConfig.uploadUrl, form, {
            //     transformRequest: angular.identity,
            //     headers: {
            //         'Content-Type': undefined
            //     }
            // }).success(function(data) {
            //     deferredHandler(data, deferred);
            // }).error(function(data) {
            //     deferredHandler(data, deferred, 'Unknown error uploading files');
            // })['finally'](function() {
            //     self.requesting = false;
            // });

            return deferred.promise;
        };
    }]);
})(window, angular);