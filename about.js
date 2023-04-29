$(document).ready(function(){
    let modalDialog = document.getElementById("modalDialog");
    let modalDialogTab = document.getElementById("aboutTab")
    let xButton = document.getElementsByClassName("closeButton")[0];
    
    modalDialogTab.onclick = function(){
        modalDialog.style.display = "block";
    }
    
    xButton.onclick = function() {
        modalDialog.style.display = "none";
    }
    
    window.onclick = function(e) {
        if (e.target === modalDialog) {
            modalDialog.style.display = "none";
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            modalDialog.style.display = "none";
        }
      });
})



