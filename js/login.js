const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
})

$("#sbt-btn").click(function () {
    const email = $("#mail").val();
    const password = $("#password").val();
    console.log(email, password);
    $.ajax({
        type: 'POST',
        url: '../php/login.php',
        data: { mail: email, password: password },
        success: function (data) {
            if (data == 'true') {
                localStorage.setItem('userEmail', email);
                window.location.href = '../profile.html';
            } else {
                document.getElementById('result').innerHTML = "invalid UserId or Password";
            }
        }
    })
});
