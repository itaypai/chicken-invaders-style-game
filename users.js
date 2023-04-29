let users={
    "p": "testuser",
    "busa": "123456",
    "big_busa": "123456"

}
let currentUser;
function checkValidUser(user, pass){
    let userPasswordInput = $(pass).val()
    let userNameInput = $(user).val()
    if(checkValidUserName(user)){
        return 0;
    }
    if(userPasswordInput != users[userNameInput]){
        return 1;
    }
    return 2;
}
function checkValidUserName(user){
    let userNameInput = $(user).val()
    if(userNameInput in users){
        return false;
    }
    return true;
}
function checkValidPassword(pass){
    let userPasswordInput = $(pass).val()
    if(userPasswordInput.length < 8){
        return false;
    }
    if(!userPasswordInput.match(/\d/) || !userPasswordInput.match(/[a-zA-Z]/)){
        return false
    }
    return true;
    
}
function checkPasswordAndConfirmation(pass, cpass){
    let passwordA = $(pass).val();
    let passwordB = $(cpass).val();
    if(passwordA != passwordB){
        return false;
    }
    return true;
}
function checkValidEmail(email){
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let userEmailInput = $(email).val();
    if(userEmailInput.match(validRegex)){
        return true;
    }
    return false
}
function checkValidName(name){
    let validRegex = /\d/
    let userNameInput = $(name).val()
    return !(userNameInput.match(validRegex))
}
function clearInput() {
    $("#registrationForm").trigger("reset");
}
function addNewUser(user, pass, cpass, email, fname, lname){
    let userName = $(user).val();
    let password = $(pass).val();
    if(!checkValidUserName(user)){
        alert("UserName:" + $(user).val()+ " already exists!");
        return;
    }
    if(!checkValidPassword(pass)){
        alert("Password must contain at least one character and one digit and be at least 8 characters long!");
        return;
    }
    if(!checkPasswordAndConfirmation(pass, cpass)){
        alert("Passwords do not match!");
        return;
    }
    if(!checkValidEmail(email)){
        alert("Invalid email address!");
        return;
    }
    if(!checkValidName(fname) || !checkValidName(lname)){
        alert("Name can't be empty or contain digits!");
        return;
    }
    users[userName] = password;
    alert("Successfull registration! Welcome: "+userName +" redirecting to Login page");
    clearInput();
    goToLogin()

}

function signInUser(user, pass){
    $(document).ready(function(){

        if(checkValidUser(user, pass) == 0){
            alert("Username: "+ $(user).val()+" doesn't exist!");
            return;
        }
        else if(checkValidUser(user, pass) == 1){
            alert("Password is incorrect!");
            return;
        }
        else{
            alert("user '"+$(user).val()+"' logged in successfully!");
            currentUser = $(user).val()
            addWelcomeUserTextToScreen()
            $(user).val('');
            $(pass).val('');
            goToSettings()
        }

    })
    
}

function showPassword(img, password){
    $(document).ready(function(){
    let currentImage = $(img).attr('src')
    let passwordTextBox = $(password).get(0).type;
    if(currentImage== "resources/Images/closedEyeLogo.png"){
        $(img).attr('src',"resources/Images/eyeLogo.png");
    }
    else if(currentImage== "resources/Images/eyeLogo.png"){
        $(img).attr('src',"resources/Images/closedEyeLogo.png");
    }
    if(passwordTextBox == "password"){
        $(password).get(0).type = "text";
    }
    else{
        $(password).get(0).type = "password";
    }
    })
    

}
function goToSettings(){
    $("#settings").show();
    showClickedPage("#settings_page");
    //showSettings();
}
function goToLogin(){
    showClickedPage('#signin_page')
}
function addWelcomeUserTextToScreen(){
    $("#welcomeUser").text("Welcome "+currentUser+"!");
}