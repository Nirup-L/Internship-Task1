$(document).ready(function () {
    const token = localStorage.getItem('session_token');
    if (token) {
        $.ajax({
            url: '../php/profile.php',
            type: 'POST',
            data: { token: token },
            success: function (response) {
                response = JSON.parse(response);
                if (response.error) {
                    console.log(response.error);
                    window.location.href = "../login.html";
                } else {
                    $('#fname').text(response.data.fname);
                    $('#lname').text(response.data.lname);
                    $('#age').text(response.data.age);
                    $('#gender').val(response.data.gender);
                    $('#mailid').text(response.data._id);
                    $('#mobile').text(response.data.mobile);
                    $('#dob').val(response.data.dob);
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
            const userEmail = localStorage.getItem('userEmail');
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
                        console.log(data);
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
