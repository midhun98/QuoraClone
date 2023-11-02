$(document).ready(function() {
    $('#answer-content').val('');
});

$(document).on('click', '#add-answer', function() {
    const answerContent = $('#answer-content').val();
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
        url: '/api/answers/',
        type: 'POST', // http method
        data: {
            content: answerContent,
            question: questionId,
        },
        headers: {
            'X-CSRFToken': csrftoken
        },

        success: function(response) {
            // handle the successful submission here, clearing the form
            alert('Answer created successfully');

            $('#answer-form').val('');
        },
        error: function(error) {
            // handle errors here
            alert('Error creating Answer. Please try again.');
            console.log(error);
        }
    });

});
