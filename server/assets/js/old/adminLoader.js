let config = null;
let pwms = null;
let pwm = null;
let addresses = null;

const pwmCards = [];
const mainContainer = document.querySelector("#root");

const options = {
  method: "GET",
  headers: {
    cookie:
      "connect.sid=s%253Asncm5CfvLPwoETEfU22B4k6ppNDCS8U9.sVyG%252BOMVmrIAAzdN7mGip2aSPqT%252F9gZ%252B6jIxxpL5HWY",
  },
};

fetch("/api/config", options)
  .then((response) => response.json())
  .then((response) => load(response))
  .catch((err) => console.error(err));

//
function load(response) {
  config = response;
  //for testing putposes
  pwmsList = config["pwms"];

  const navbar = getNavbar();

  const pwmSection = getPwmSection(pwmsList, config);

  mainContainer.appendChild(navbar.content);
  mainContainer.appendChild(pwmSection.content);
}

//takes in an html string and returns an element containing the html string in html form
function elementFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template;
}

function getNavbar() {
  return elementFromHtml(`
    <nav class="navbar navbar-light bg-light ml-5">
      <div class="container-fluid">
          <a class="navbar-brand" href="/">
              <img
              src="/images/fish.png"
              alt=""
              width="30"
              height="24"
              class="d-inline-block"
              />
              HappyFish 
          </a>
          <a class="navbar-brand btn" href="/"> DASHBOARD </a>
          <a class="navbar-brand btn" href="/logout"> LOGOUT </a>
      </div>
    </nav>
  `);
}

//
function getMainContainer() {}

//returns the entire pwm section
//pwms: array of strings where each string is the id of a pwm
//*passing config as parameter now because not sure if async will cause problems as global
function getPwmSection(pwms, config) {
  const maxOfPwmsPerRow = 3;
  let html = "";

  html += `<section name="pwmSection">
              <div class="container" id="pwmsContainer">
                `;

  for (let i = 0; i < pwms.length; i++) {
    if (i % maxOfPwmsPerRow == 0) html += `<div class="row">`;

    let pwmDivTempate = getPwmDiv(config[pwms[i]]);
    pwmCards.push(pwmDivTempate);
    html += pwmDivTempate.innerHTML;

    if (i % maxOfPwmsPerRow == maxOfPwmsPerRow - 1) html += `</div>`;
  }

  html += ` <div class="container mt-2">
              <button 
                class="btn-primary"
                onclick="addPwm()"
              >+PWM</button>
            </div>`;

  html += `</div>
            </section>`;
  console.log(html);
  return elementFromHtml(html);
}

//returns a pwm card from the pwms array
//edit button has onclick that calls changeToEdit(event)
function getPwmDiv(pwm) {
  let html = "";
  html += `<div class="card col-md m-3" id="pwmCard-${pwm._id}">
              <div class="card-body text-center">
                <h5 class="card-title">Name: ${pwm.name}</h5>
                  </div>
                    <div class="container">`;

  html += getPwmLineList(pwm.addrs).innerHTML;

  html += ` <div class="container mt-2">
              <button 
                class="btn-primary"
                onclick="changeToEdit(event)"
                id="pwmEdit-${pwm._id}"
              >Edit</button>
            </div>`;
  console.log(html);
  return elementFromHtml(html);
}

function getPwmLineList(addresses) {
  const numberOfLinesPerCard = 4;
  let html = "";
  for (i = 0; i < 16; i++) {
    if (i % numberOfLinesPerCard == 0) {
      let name = Math.floor(i / numberOfLinesPerCard);
      html += `<div class="border border-primary" name="pwmListCard-${name}">
        <ul class="list-group list-group-flush">`;
    }

    console.log(getPwmLine("a" + i, addresses["a" + i]));
    html += getPwmLine("a" + i, addresses["a" + i]).innerHTML;

    if (i % numberOfLinesPerCard == numberOfLinesPerCard - 1) {
      html += `</ul>
      </div>`;
    }
  }

  console.log(html);
  return elementFromHtml(html);
}

//id -> 0-15
//status is the value of the pwm
function getPwmLine(id, status) {
  if (id === null || typeof id !== "string") return "Error input";
  let output = status === null ? "no connection" : status;
  let color = status === null ? "text-danger" : "text-success";
  // if (edit) {
  //   return elementFromHtml(`<li class="list-group-item">${id}: ${output}</li>`);
  // } else {
  return elementFromHtml(
    `<li class="list-group-item">${id.substring(
      1
    )}: <span class = "${color}">${output}</span></li>`
  );
  //}
}

//Functionality
function changeToEdit(event) {
  console.log("clicked");
  let currentButton = event.currentTarget;
  let pwmID = getId(currentButton.id);
  let parentDiv = currentButton.parentElement;
  let parentPwmCard = document.getElementById(`pwmCard-${pwmID}`);
  console.log("edit:");
  console.log(parentPwmCard.outerHTML);
  parentDiv.outerHTML = `
            <button 
              class="btn-primary"
              onclick="savePwm(event)"
              id="edit-${pwmID}"
            >Save</button>

            <button 
              class="btn-primary"
              onclick="deletePwm(event)"
              id="delete-${pwmID}"
            >Delete</button>
  `;

  //getting <input>
  let nameElement = parentPwmCard.firstElementChild.firstElementChild;
  let oldName = nameElement.innerText.split("Name:")[1];
  nameElement.innerHTML = `New name:
            <input
              class="w-100"
              type="text"
              name="newName"
              placeholder="${oldName}"
              />
            `;
}

//saves the current edit of a PWM card
function savePwm(event) {
  let currentButton = event.currentTarget;
  let pwmID = getId(currentButton.id);
  let parentDiv = currentButton.parentElement;
  let parentPwmCard = document.getElementById(`pwmCard-${pwmID}`);

  //**one more firstChildElement because added another element before **
  let nameElement =
    parentPwmCard.firstElementChild.firstElementChild.firstElementChild;
  let newName = nameElement.value;

  const options = {
    method: "PUT",
    headers: {
      cookie:
        "connect.sid=s%253As9EKPagD2liDU7Ria5DcppdLpj_f7e34.3rymfzT4Onr0VX2Z%252F%252FVWR6YLwOo%252BKkhkuIGsyDWZ5nE",
    },
    body: new URLSearchParams({
      _id: pwmID,
      name: newName,
    }),
  };

  fetch(`/config/pwm/name`, options)
    .then((response) => response.json())
    .then((response) => {
      console.log("Sucessfully new name for current pwm");
      rerenderPwmSection();
    })
    .catch((err) => console.error(err));
}

//sends a post request to create a new pwm card
function addPwm() {
  let pwmsContainer = document.getElementById(`pwmsContainer`);
  console.log(pwmsContainer.outerHTML);
  const options = {
    method: "POST",
    headers: {
      cookie:
        "connect.sid=s%253As9EKPagD2liDU7Ria5DcppdLpj_f7e34.3rymfzT4Onr0VX2Z%252F%252FVWR6YLwOo%252BKkhkuIGsyDWZ5nE",
    },
  };

  fetch("/config/pwm", options)
    .then((response) => response.json())
    .then((response) => {
      rerenderPwmSection();
    })
    .catch((err) => console.error(err));
}

//sends a post request to create a new pwm card
function deletePwm(event) {
  let currentButton = event.currentTarget;
  let pwmID = getId(currentButton.id);

  let parentPwmCard = document.getElementById(`pwmCard-${pwmID}`);
  console.log(parentPwmCard.outerHTML);

  const options = {
    method: "DELETE",
    headers: {
      cookie:
        "connect.sid=s%253As9EKPagD2liDU7Ria5DcppdLpj_f7e34.3rymfzT4Onr0VX2Z%252F%252FVWR6YLwOo%252BKkhkuIGsyDWZ5nE",
    },
  };

  fetch(`http://localhost:8080/config/pwm/${pwmID}`, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(`Deleted pwm with id of: ${pwmID}`);
      console.log(response);
      parentPwmCard.remove();
    })
    .catch((err) => console.error(err));
}

//gets id from a string containing id in the form string-id
//such that a '-' separates string from id
function getId(id) {
  return id.split("-")[1];
}

//rerendering PwmSection by getting a new config
function rerenderPwmSection() {
  const options = {
    method: "GET",
    headers: {
      cookie:
        "connect.sid=s%253Asncm5CfvLPwoETEfU22B4k6ppNDCS8U9.sVyG%252BOMVmrIAAzdN7mGip2aSPqT%252F9gZ%252B6jIxxpL5HWY",
    },
  };

  fetch("/api/config", options)
    .then((response) => response.json())
    .then((response) => {
      pwmsContainer.parentNode.replaceChild(
        getPwmSection(response["pwms"], response).content,
        pwmsContainer
      );
    })
    .catch((err) => console.error(err));
}
