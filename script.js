const input = document.querySelector(".input");
const list = document.querySelector(".list");
const postWrapper = document.querySelector(".post-wrapper");
const postWrapperItem = document.querySelector(".post-wrapper_item");
let repositories = [];
let sortedRepositories = [];

function getData() {
  let value = this.value;
  if (!value) {
    if (list.firstChild) {
      list.replaceChildren();
    }
    return value;
  }
  return new Promise(function () {
    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
      .then((response) => response.json())
      .then((data) => {
        repositories = [];
        data.items.forEach((elem) => repositories.push(elem));
      })
      .then(() => {
        if (list.firstChild) {
          list.replaceChildren();
        }
        return repositories.map((elem) => {
          return createListElement(elem.name);
        });
      })
      .then(() => {
        const listItems = document.querySelectorAll(".list_item");
        return listItems.forEach((item) => {
          item.addEventListener("click", function (event) {
            input.value = null;
            const clickedItem = repositories.find(
              (elem) => elem.name === event.target.textContent
            );
            createWrapElement(
              clickedItem.name,
              clickedItem.owner.login,
              clickedItem.stargazers_count
            );
            if (list.firstChild) {
              list.replaceChildren();
            }
          });
        });
      });
  });
}

function createListElement(name) {
  let listItem = document.createElement("li");
  listItem.className = "list_item";
  let span = document.createElement("span");
  span.textContent = name;
  listItem.append(span);
  list.append(listItem);
}

function createWrapElement(name, owner, stars) {
  const post = document.createElement("div");
  post.className = "post-wrapper_item";
  const nameDiv = document.createElement("div");
  nameDiv.textContent = `Name: ${name}`;
  const ownerDiv = document.createElement("div");
  ownerDiv.textContent = `Owner: ${owner}`;
  const starsDiv = document.createElement("div");
  starsDiv.textContent = `Srars: ${stars}`;
  const closeBtn = document.createElement("div");
  closeBtn.className = "post-wrapper_item-close close";
  post.appendChild(nameDiv);
  post.appendChild(ownerDiv);
  post.appendChild(starsDiv);
  post.appendChild(closeBtn);
  postWrapper.appendChild(post);
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

input.addEventListener("input", debounce(getData, 500));

postWrapper.addEventListener("click", function (event) {
  if (event.target.closest(".post-wrapper_item-close")) {
    event.target.parentElement.remove();
  }
});
