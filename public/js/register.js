console.log("It worked")
// document.getElementById('Warningname').style.display = "none";
const warnings = document.getElementsByClassName('Warningname');
for (let i = 0; i < warnings.length; i++) {
    warnings[i].style.display = "none";
}
function seterror(id) {
    if (id === "name") {
        document.getElementsByClassName('Warningname')[0].style.display = "block";
        document.getElementById('message1').innerHTML = "Too Short Name";
    }

    if (id === "email") {
        document.getElementsByClassName('Warningname')[1].style.display = "block";
        document.getElementById('message2').innerHTML = "Incorrect Email";
    }

    if (id === "password") {
        document.getElementsByClassName('Warningname')[2].style.display = "block";
        document.getElementById('message3').innerHTML = "Password should be at least 6 characters";
    }

    if (id === "password2") {
        document.getElementsByClassName('Warningname')[3].style.display = "block";
        document.getElementById('message4').innerHTML = "Passwords do not match";
    }
}
function validationForm() {

    let returnval = true;
    let name = document.forms['registerform']['name'].value;

    if (name.length < 3) {
        seterror("name");
        returnval = false;
    }


    let email = document.forms['registerform']['email'].value;

    if (email[0] === '@') {
        seterror("email");
        returnval = false;
    }


    let password = document.forms['registerform']['password'].value;

    if (password.length < 6) {
        seterror("password");
        returnval = false;
    }


    let password2 = document.forms['registerform']['password2'].value;

    if (password !== password2) {
        seterror("password2");
        returnval = false;
    }
    return returnval;
}