$(document).ready(function () {
    // Add a click event listener to the submit button
    $('#submit-button').click(function () {
        // Retrieve the question text from the input field
        const questionText = $('#large-input').val();

        // Create a data object to send in the POST request
        const questionData = {
            title: questionText,
        };
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

        // Make a POST request to the API endpoint
        $.ajax({
            url: '/api/questions/',
            type: 'POST',
            dataType: 'json',
            data: questionData,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (data) {
                // Handle the success response, e.g., show a success message
                console.log('Question created successfully:', data);
                alert('Question created successfully');
            },
            error: function (error) {
                // Handle the error response, e.g., show an error message
                console.error('Error creating question:', error);
                alert('Error creating question. Please try again.');
            }
        });
    });
});
