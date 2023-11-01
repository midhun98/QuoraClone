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
        });

        for (const answer of data.results) {
            const [userData, likeData] = await Promise.all([
                getUserData(answer.user),
            ]);


            const html = `
                <div class="max-w-screen-xl mx-auto block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mt-4">
                    <a class="flex items-center gap-1 mb-4" href="">
                        <img class="w-8 h-8 rounded-full" src=${userData.profile_picture} alt="">
                        <span class="font-bold hover:underline">${userData.first_name} ${userData.last_name}</span>
                    </a>
                        <h1 class="font-bold text-xl max-w-3xl">${answer.title}</h1>
                   <p class="mt-4 italic">Add answer</p>
                </div>
            `;

            $('#questions').append(html);
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

fetchData();

