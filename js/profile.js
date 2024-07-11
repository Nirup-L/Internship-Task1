$(document).ready(function () {
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        $.ajax({
            url: '../php/profile.php',
            type: 'POST',
            data: { id: userEmail },
            success: function (data) {
                data = JSON.parse(data);

                if (data.error) {
                    console.log(data.error);
                } else {
                    $('#fname').text(data.fname);
                    $('#lname').text(data.lname);
                    $('#age').text(data.age);
                    $('#gender').text(data.gender);
                    $('#mailid').text(data._id);
                    $('#mobile').text(data.mobile);
                }
            },
            error: function () {
                console.log('An error occurred while fetching user information.');
            }
        });
    } else {
        console.log('No user logged in.');
    }
});
