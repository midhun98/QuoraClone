async function getUserData(userId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: `/api/users/${userId}/`,
            type: 'GET',
            dataType: 'json',
            success: resolve,
            error: reject,
        });
    });
}

async function fetchData() {
    try {
        const data = await $.ajax({
            url: `/api/questions/questions-without-answer/`,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            },
        });

        for (const question of data.results) {
            const [userData, likeData] = await Promise.all([
                getUserData(question.user),
            ]);


            const html = `
                <div class="max-w-screen-xl mx-auto block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mt-4">
                    <a class="flex items-center gap-1 mb-4" href="">
                        <img class="w-8 h-8 rounded-full" src=${userData.profile_picture} alt="">
                        <span class="font-bold hover:underline">${userData.first_name} ${userData.last_name}</span>
                    </a>
                        <h1 class="font-bold text-xl max-w-3xl">${question.title}</h1>
                        <h1 class="font-bold text-xl max-w-3xl hidden">${question.id}</h1>
                   <p id="add-answer" data-question-id="${question.id}" class="mt-4 italic">Add answer</p>

                </div>
            `;

            $('#questions').append(html);
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

fetchData();

$(document).on('click', '#add-answer', function() {
    const questionId = $(this).data('question-id');
    const formHtml = `
        <form id="answer-form">
            <div class="mb-6">
                <input type="hidden" name="question_id" value="${questionId}">
                <input type="text" id="answer-content" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <input id="submit-answer" type="submit" value="Submit">
        </form>
    `;
    $(this).after(formHtml);
});

$(document).on('submit', '#answer-form', function(event) {
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

    event.preventDefault();
    const answerContent = $('#answer-content').val();
    const questionId = $('input[name="question_id"]').val();
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

            $('#answer-form').remove();
        },
        error: function(error) {
            // handle errors here
            alert('Error creating Answer. Please try again.');
            console.log(error);
        }
    });
});
