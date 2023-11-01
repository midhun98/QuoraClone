$.ajax({
    url: '/api/answers/',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        var questionIds = {};  // To keep track of questions seen
        data.results.forEach(function (answer) {
            // Check if we haven't seen this question yet
            if (!questionIds.hasOwnProperty(answer.question.id)) {
                // Get the user's name from the user API
                $.ajax({
                    url: `/api/users/${answer.user}/`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (userData) {
                        // Handle the user data and update the HTML
                        var html = `
                            <div class="max-w-screen-xl mx-auto block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mt-4">
                                <a class="flex items-center gap-1 mb-4" href="">
                                    <img class="w-8 h-8 rounded-full" src=${userData.profile_picture} alt="">
                                    <span class="font-bold hover:underline">${userData.first_name} ${userData.last_name}</span>
                                </a>
                                <h1 class="font-bold text-xl max-w-3xl">${answer.question.title}</h1>
                                <p class="max-w-3xl mt-5">${answer.content}</p>
                                <div class="mt-4 flex items-center">
                                    <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/love-circled.png" alt="love-circled"/>
                                    <img width="30" height="30" src="https://img.icons8.com/fluency/48/love-circled.png" alt="love-circled"/>
                                    <p>48</p>
                                </div>
                            </div>
                        `;

                        // Append the HTML to the DOM
                        $('#answers').append(html);
                    },
                    error: function (userError) {
                        console.log('Error fetching user data: ', userError);
                    }
                });

                // Mark this question as seen
                questionIds[answer.question.id] = true;
            }
        });
    },
    error: function (error) {
        console.log('Error: ', error);
    }
});
