async function getLikes(answerId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: `/api/likes/answer_like_count/?answer_id=${answerId}`,
            type: 'GET',
            dataType: 'json',
            success: resolve,
            error: reject,
        });
    });
}

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
            url: '/api/answers/',
            type: 'GET',
            dataType: 'json',
        });

        const questionIds = {};  // To keep track of questions seen

        for (const answer of data.results) {
            if (!questionIds.hasOwnProperty(answer.question.id)) {
                const [userData, likeData] = await Promise.all([
                    getUserData(answer.user),
                    getLikes(answer.id)
                ]);

                const likeCount = likeData.like_count;

                const html = `
                <div class="max-w-screen-xl mx-auto block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mt-4">
                    <a class="flex items-center gap-1 mb-4" href="">
                        <img class="w-8 h-8 rounded-full" src=${userData.profile_picture} alt="">
                        <span class="font-bold hover:underline">${userData.first_name} ${userData.last_name}</span>
                    </a>
                    <a href="/answers/${answer.question.id}"> 
                        <h1 class="font-bold text-xl max-w-3xl">${answer.question.title}</h1>
                    </a>
                    <p class="max-w-3xl mt-5">${answer.content}</p>
                    <div class="mt-4 flex items-center">
                        <img width="30" height="30" src="https://img.icons8.com/fluency/48/love-circled.png" alt="love-circled" class="like-button" data-answer-id="${answer.id}"/>
                        <p>${likeCount} likes</p>
                    </div>
                </div>
            `;


                $('#answers').append(html);
                questionIds[answer.question.id] = true;
            }
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

fetchData();

$(document).on('click', '.like-button', function () {
    const answerId = $(this).data('answer-id');
    console.log('answerId', answerId);
    // Get CSRF token from cookie
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
        url: '/api/likes/like-answer/',
        type: 'POST',
        data: {
            answer_id: answerId
        },
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function (data) {
            // Update the like count on the page
            const likeCountElement = $(this).siblings('.like-count');
            likeCountElement.text(parseInt(likeCountElement.text()) + 1);
            $(this).off('click'); // Disable further clicks
        },
        error: function (error) {
            console.log('Error: ', error);
        }
    });
});
