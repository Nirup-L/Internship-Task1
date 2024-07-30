$(document).ready(function () {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('session_token');
    if (userEmail) {
        $.ajax({
            url: '../php/profile.php',
            type: 'POST',
            data: { id: userEmail, token: token },
            success: function (data) {
                data = JSON.parse(data);
                if (data.error) {
                    console.log(data.error);
                    window.location.href = "../login.html";
                } else {
                    $('#fname').text(data.fname);
                    $('#lname').text(data.lname);
                    $('#age').text(data.age);
                    $('#gender').val(data.gender);
                    $('#mailid').text(data._id);
                    $('#mobile').text(data.mobile);
                    $('#dob').val(data.dob);
                }
            },
            error: function () {
                console.log('An error occurred while fetching user information.');
            }
        });

        $('#edit-btn').click(function () {
            $('#status').text(" ");
            const fname = $('#fname').text();
            const lname = $('#lname').text();
            const dob = $('#dob').val();
            var year = new Date(dob).getFullYear();
            var curryear = new Date().getFullYear();
            const age = curryear - year;
            const gender = $('#gender').val();
            const mobile = $('#mobile').text();
            if (mobile.length !== 10) {
                $('#status').text('Mobile number must be exactly 10 digits long.').css('color', 'red');
                return;
            }
            if (age < 12) {
                $('#status').text('user must be atleast 12 years old').css('color', 'red');
                return;
            }

            $.ajax({
                type: 'POST',
                url: '../php/update.php',
                data: {
                    id: userEmail,
                    fname: fname,
                    lname: lname,
                    dob: dob,
                    age: age,
                    gender: gender,
                    mobile: mobile
                },
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        $('#fname').text(data.fname);
                        $('#lname').text(data.lname);
                        $('#age').text(data.age);
                        $('#gender').val(data.gender);
                        $('#mailid').text(data._id);
                        $('#mobile').text(data.mobile);
                        $('#dob').val(data.dob);
                        $('#status').text('Profile updated successfully.').css('color', 'green');
                    }
                },
                error: function (xhr, status, error) {
                    $('#status').text('');
                    console.error('AJAX Error: ' + status + error);
                }
            });
        });
    } else {
        console.log('No user logged in.');
    }
});
