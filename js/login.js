const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
})

$("#sbt-btn").click(function () {
    const email = $("#mail").val();
    const password = $("#password").val();
    let data = `mail=${email}&password=${password}`;
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '../php/login.php',
        data: data,
        success: function (response) {
            const data = JSON.parse(response);
            if (data.status === 'success') {
                const token = data.token;
                console.log(token);
                localStorage.setItem('session_token', token);
                localStorage.setItem('userEmail', email);
                window.location.href = '../profile.html';
            } else {
                document.getElementById('result').innerHTML = "invalid UserId or Password";
            }
        }
    })
});
