console.log("hiiiii")
$(document).ready(function() {
    $('#submit-login').click(function () {
        'use strict';
        let username = $('#email').val();
        let password = $('#password').val();
        console.log("hiiissssii", username, password)

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');


        $.ajax({
            type: "POST",
            url: "/api/login/",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password }),
            success: function (data) {
                if (data.status === 'success') {
                    alert('Login success');
                    window.location.href = '/';
                } else {
                    alert('Invalid Credentials');
                }
            }
        });
    });
});
