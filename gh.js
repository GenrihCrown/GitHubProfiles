const APIURL = 'https://api.github.com/users/'

const wrapper = document.getElementById('wrapper') //Получаем из связанного HTML элемент по его ID
const form = document.getElementById('form') 
const search = document.getElementById('search')
const notification = document.getElementById('notification')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value
    if (user) {
        getUser(user)
        search.value = ''
    }

})

//Пишем асинхронную функцию для получения данных пользователя с сервера
async function getUser(userLogin) {
    try {
        const response = await fetch(APIURL + userLogin) //await ждет результат выполнения fetch и только потом идет далее
        if (!response.ok) {
            const error = ("Ошибка HTTP: " + response.status + response.statusText)
            showError(error)}
            else {
                const userData = await response.json()
                createUserCard(userData)
                getRepos(userLogin) 
            }
        }
        catch(e) {
            console.log(e)
        } 
    }

//Пишем асинхронную функцию для получения данных по репозиториям с сервера
async function getRepos(userLogin) {
    const response = await fetch (APIURL + userLogin + '/repos')
    const reposData = await response.json()

    addReposToCard(reposData) 
}

//Пишем функцию, которая добавляет данные по репозиториям в карточку пользователя
function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos.forEach((repo) => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')

        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText = repo.name

        reposEl.appendChild(repoEl)
        })
    }

//Пишем функцию для создания карточки пользователя на странице
function createUserCard(user) {

    cardHTML = `
    <div class="card">
      <div class="image-container">
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio || user.company || user.location}</p>
        <ul class="info">
          <li><strong>Followers</strong> ${user.followers}</li>
          <li><strong>Following</strong> ${user.following}</li>
          <li><strong>Repos</strong> ${user.public_repos}</li>
        </ul>

        <div class="repos" id="repos"></div>
      </div>
    </div>
`

wrapper.innerHTML = cardHTML

}


function showError(error) {

    errorHTML = `
    <div id="notification" class="notification">
        <p>${error}</p>
    </div>
    `
    wrapper.innerHTML = errorHTML
}