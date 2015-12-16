// if (window.File && window.FileReader && window.FileList && window.Blob) {
//     document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
// } else {
//     alert('The File APIs are not fully supported in this browser.');
// }

// onmessage = function(e) {
//     var files = e.target.files;
//     var file = files[0];

//     if (files && file) {
//         var reader = new FileReader();

        // reader.onload = function(readerEvt) {
        //     var binaryString = readerEvt.target.result;
        //     //document.getElementById("base64textarea").value = btoa(binaryString);
        //     postMessage(btoa(binaryString));
        // };

//         reader.readAsBinaryString(file);
//     }
// };

// var handleFileSelect = function(evt) {
    
// };



// onmessage = function(e){
//   var files = e.data;
//   var file = files[0];
//     // Read each file synchronously as an ArrayBuffer and
//   // stash it in a global array to return to the main app.
//   // 
  
//     console.log(file);
  
//     var reader = new FileReader();
//     reader.onload = function(readerEvt) {
//             var binaryString = readerEvt.target.result;
//             //document.getElementById("base64textarea").value = btoa(binaryString);
            
//             postMessage(btoa(binaryString));
//         };
//     //buffers.push(reader.readAsArrayBuffer(file));
  

//   //postMessage(buffers);
//   //console.log(btoa(binaryString));
// };

self.addEventListener('message', function(e) {
  var files = e.data;
  var buffers = [];

  // Read each file synchronously as an ArrayBuffer and
  // stash it in a global array to return to the main app.
  [].forEach.call(files, function(file) {
    var reader = new FileReaderSync();
    buffers.push(reader.readAsArrayBuffer(file));
  });

  postMessage(buffers);
}, false);

