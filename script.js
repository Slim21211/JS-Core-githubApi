const input = document.querySelector(".input");
const list = document.querySelector(".list");
const postWrapper = document.querySelector(".post-wrapper");
const postWrapperItem = document.querySelector(".post-wrapper_item");
let repositories = [];
let sortedRepositories = [];

fetch("https://api.github.com/search/repositories?q=Q&per_page=100")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.items.forEach((elem) => repositories.push(elem));
  });

function sortRepositories(arr, value) {
  return arr.filter((rep) => {
    let regex = new RegExp(value, "gi");
    return rep.name.match(regex);
  });
}

function createListElement() {
  if (this.value) {
    sortedRepositories = sortRepositories(repositories, this.value);
    const listItem = sortedRepositories
      .map((elem) => {
        return `<li class="list_item"><span>${elem.name}</span></li>`;
      })
      .slice(0, 5)
      .join("");
    list.innerHTML = listItem;
  } else {
    list.innerHTML = "";
  }
}

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const cb = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(cb, debounceTime);
  };
};

input.addEventListener("keyup", debounce(createListElement, 500));

list.addEventListener("click", function (event) {
  console.log(sortedRepositories);
  const clickedItem = sortedRepositories.find(
    (elem) => elem.name === event.target.textContent
  );
  const post = document.createElement("div");
  post.className = "post-wrapper_item";
  post.innerHTML = `<div>Name: ${clickedItem.name}</div>
                    <div>Owner: ${clickedItem.owner.login}</div>
                    <div>Stars: ${clickedItem.stargazers_count}</div>
                    <div class='post-wrapper_item-close close'></div>`;
  postWrapper.append(post);
  list.innerHTML = "";
  input.value = "";
});

postWrapper.addEventListener("click", function (event) {
  if (event.target.closest(".post-wrapper_item-close")) {
    event.target.parentElement.remove();
  }
});
