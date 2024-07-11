const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
});

let isEmailValid = false;

$("#setpassword, #confirmpassword").on('input', function () {
    validatePasswords();
});

$("#mail").on('input', function () {
    validateEmail();
});

$("#sbt-btn").click(function () {
    document.getElementById('mail-status').innerHTML = "";
    document.getElementById('password-status').innerHTML = "";
    this.fname = $("#fname").val();
    this.lname = $("#lname").val();
    this.id = $("#mail").val();
    this.setpass = $("#setpassword").val();
    this.confirmpass = $("#confirmpassword").val();

    // Clear any previous password status message
    document.getElementById('password-status').innerHTML = "";

    // Validation checks
    if (!this.fname || !this.lname || !this.id || !this.setpass || !this.confirmpass) {
        document.getElementById('password-status').innerHTML = "All fields must be filled.";
        return;
    }

    if (this.setpass !== this.confirmpass) {
        document.getElementById('password-status').innerHTML = "Passwords do not match.";
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(this.setpass)) {
        document.getElementById('password-status').innerHTML = "Password must contain at least:<br> one special character<br>one uppercase letter<br>one lowercase letter<br>one digit<br>and be at least 8 characters long.";
        return;
    }

    if (!isEmailValid) {
        document.getElementById('mail-status').innerHTML = "Please enter a valid email.";
        return;
    }

    // Proceed with registration
    $.ajax({
        type: 'POST',
        url: '../php/register.php',
        data: { mail: this.id, password: this.confirmpass, fname: this.fname, lname: this.lname },
        success: function (data) {
            console.log(data);
            window.location.href = '../profile.html'
        }
    });
});

function validatePasswords() {
    const setPassword = $("#setpassword").val();
    const confirmPassword = $("#confirmpassword").val();
    const passwordStatus = document.getElementById('password-status');

    passwordStatus.innerHTML = "";

    if (setPassword !== confirmPassword) {
        passwordStatus.innerHTML = "Passwords do not match.";
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(setPassword)) {
        passwordStatus.innerHTML = "Password must contain at least:<br> one special character<br>one uppercase letter<br>one lowercase letter<br>one digit<br>and be at least 8 characters long.";
    }
}

function validateEmail() {
    const email = $("#mail").val();
    const mailStatus = document.getElementById('mail-status');
    mailStatus.innerHTML = "";

    // Check if email is valid and not empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        mailStatus.innerHTML = "Email is required.";
        isEmailValid = false;
        return;
    } else if (!emailRegex.test(email)) {
        mailStatus.innerHTML = "Invalid email format.";
        isEmailValid = false;
        return;
    }

    $.ajax({
        type: 'POST',
        url: '../php/idvalidate.php',
        data: { mail: email },
        success: function (data) {
            if (data === "true") {
                mailStatus.innerHTML = "User with this mailId already exists";
                isEmailValid = false;
            } else {
                mailStatus.innerHTML = "";
                isEmailValid = true;
            }
        }
    });
}
