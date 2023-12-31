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

document.getElementById("logout-button").addEventListener("click", function () {
    'use strict';
    swal.fire({
        title: 'Are you sure you want to logout?',
        text: "You will be redirected to the login page",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/api/logout/",
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                success: function () {
                    swal.fire({
                        icon: 'success',
                        title: 'Logout Success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 1500);
                },
                error: function () {
                    swal.fire(
                        'Error!',
                        'An error occurred while logging out.',
                        'error'
                    );
                }
            });
        }
    });
});