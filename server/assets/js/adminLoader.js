let config = null;
let pwms = null;
let pwm = null;
let addresses = null;

let pwmArray = new Array();

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
  pwms = config["pwms"];
  pwm = config[pwms[0]];
  addresses = pwm["addrs"];

  const mainContainer = document.querySelector("#root");
  const navbar = getNavbar();
  const pwmCard = getPwmDiv(pwm);
  mainContainer.appendChild(navbar.content);
  mainContainer.appendChild(pwmCard.content);
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
function getPwmSection(pwms) {
  const maxOfPwmsPerContainer = 3;
}

//pwm
function getPwmDiv(pwm) {
  let html = "";
  html += `<div class="card col-md m-3">
              <div class="card-body text-center">
                <h5 class="card-title">Name: ${pwm.name}</h5>
                  </div>
                    <div class="container">`;

  html += getPwmLineList(pwm.addrs).innerHTML;

  html += `           <div class="card-body">
                            <a href="#" class="card-link">Edit</a>
                      </div>
                   </div>
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
