const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;               // e.g., "INR"
  let countryCode = countryList[currCode];    // e.g., "IN"
  if (!countryCode) return;                   // safety check
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};


btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const base = fromCurr.value.toUpperCase();
  const symbols = toCurr.value.toUpperCase();
  const URL = `${BASE_URL}?from=${base}&to=${symbols}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("API Response:", data);

    if (data.rates && data.rates[symbols]) {
      let rate = data.rates[symbols];
      let finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } else {
      msg.innerText = "Conversion failed — check currency codes!";
    }
  } catch (error) {
    console.log("Error:", error);
    msg.innerText = "Something went wrong!";
  }
});
