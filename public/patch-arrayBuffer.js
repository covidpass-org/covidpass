(function () {
  if ('File' in self) {
    File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer
  }
  Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

  function myArrayBuffer() {
    // this: File or Blob
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(this);
    })
  }
})();

// This is a simple trick to implement Blob.arrayBuffer (https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer) using FileReader