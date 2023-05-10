const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const selectTag = document.querySelectorAll("select");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("button");
const icons = document.querySelectorAll(".row i");

// Creating options
selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    // Selecting English by default as FROM language and Hebrew as TO language
    let selected;
    if (id === 0 && country_code === "en-GB") {
      selected = "selected";
    } else if (id === 1 && country_code === "he-IL") {
      selected = "selected";
    }

    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option); // adding option tag inside the select tag
  }
});

// Exchanging textarea and select tag values
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTag[0].value;

  fromText.value = toText.value;
  selectTag[0].value = selectTag[1].value;
  toText.value = tempText;
  selectTag[1].value = tempLang;
});

// Translate the text
translateBtn.addEventListener("click", () => {
  let text = fromText.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  // https://mymemory.translated.net/doc/spec.php
  const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  // Fetching the api response and returning it with parsing to js object then receiving the data
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    })
    .catch((error) => console.log(error));
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      // If clicked icon has from id, copy the fromTextarea value, else copy the toTextarea value
      if (target.id === "from") {
        // writeText() function writes the specified text string to the system clipboard
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      // If clicked icon has from id, speak the fromTextarea value, else speak the toTextarea value
      if (target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value); // SpeechSynthesisEvent represents a speech request
        utterance.lang = selectTag[0].value; // Setting utterance language to fromSelect tag value
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value; // Setting utterance language to toSelect tag value
      }

      speechSynthesis.speak(utterance); // speak the passed utterance
    }
  });
});
