$(document).ready(function () {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        // Fetch user information
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

        // Update user information
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

            // Validate mobile number length
            if (mobile.length !== 10) {
                $('#status').text('Mobile number must be exactly 10 digits long.').css('color', 'red');
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
                        // Update the DOM elements immediately
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
