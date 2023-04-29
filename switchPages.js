
// window.addEventListener("click", createCanvas, false);


// function createCanvas(){
//     $("#canvasParagraph").append("<canvas id = 'theCanvas' width = '480' height = '600'></canvas>");
// }
function showClickedPage(page){
    $('.content').hide();
    location.href=page;
    $(page).show();
}

function checkValidDate(){
    let inputDate = $("#birthday").val();
    let userInputDate = new Date(inputDate)
    let currentDate = new Date();
    if(userInputDate.getTime() >= currentDate.getTime()){
        alert("The Date must be smaller than Today's Date!")
    }
}