export default Utility = {
  downloadUrl: function (fileName, url) {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    a.click();
  },

  downloadString: function (fileName, string, type = 'image/svg+xml;charset=utf-8') {
    const blob = new Blob([string], { type: type });
    const oUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = fileName;
    a.href = oUrl;
    a.click();
  },
  
  copyText: function (link) {
    navigator.clipboard.writeText(link);
  }
}