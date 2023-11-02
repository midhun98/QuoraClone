window.onload = function () {
    document.getElementById("create-user-form").reset();
};
const csrfToken = $('#create-user-form input[name="csrfmiddlewaretoken"]').val();
$(document).ready(function () {
    $("#create-user-form").submit(function (event) {
        event.preventDefault();
        let formData = {
            last_name: $("#last_name").val(),
            first_name: $("#first_name").val(),
            confirm_password: $("#confirm-password").val(),
            password: $("#password").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
        };
        console.log('formData', formData)

        $.ajax({
            type: "POST",
            url: "/api/signup/",
            data: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                swal.fire({
                    title: "Success",
                    text: "User created successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                setTimeout(function () {
                    window.location.href = '/';
                }, 1500);
            },
            error: function (xhr) {
                if (xhr.status === 400) {
                    displayFieldErrors(xhr.responseJSON);
                } else {
                    alert("Error creating user: " + xhr.responseText);
                }
            }
        });
    });
});

function displayFieldErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let inputElement = $("#" + field);
            let errorMessage = errors[field][0];
            displayError(inputElement, errorMessage);
        }
    }
}

function displayError(inputElement, errorMessage) {
    let errorElement = $("<div class='error-message'></div>").text(errorMessage);
    inputElement.addClass("input-error");
    inputElement.after(errorElement);
}