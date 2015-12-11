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
        function sendFileInfo(fileObject){
            if (!fileObject || typeof fileObject !== 'file'){
                var fileInfo = JSON.stringify({type:"file", filename:fileObject.name, filesize:fileObject.size, filetype:fileObject.type, filelastmodified:fileObject.lastModifiedDate});
                console.log(fileInfo);
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

        //Function encode file to base64
        function encodeBase64(fileObject){
            if (!fileObject || typeof fileObject !== 'file'){
                console.log('Name: '+fileObject.name);
                console.log('Size: '+fileObject.size);
                console.log('Type: '+fileObject.type);
                console.log('ModifiedDate: '+fileObject.lastModifiedDate);
            }
            else {

                console.log('Not a file');
            }
        }

        this.requesting = false; 
        
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
                sendFileInfo(fileObj);
                fileObj instanceof window.File && form.append('file-' + i, fileObj);
            }
            self.requesting = true;

            //Upload file using Post method
            $http.post(fileManagerConfig.uploadUrl, form, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function(data) {
                deferredHandler(data, deferred);
            }).error(function(data) {
                deferredHandler(data, deferred, 'Unknown error uploading files');
            })['finally'](function() {
                self.requesting = false;
            });

            return deferred.promise;
        };
    }]);
})(window, angular);