document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      category: "Work",
    },
    {
      text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
      category: "Friendship",
    },
    {
      text: "The best way to predict the future is to create it.",
      category: "Future",
    },
    {
      text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
      category: "Mindfulness",
    },
    {
      text: "Life is 10% what happens to us and 90% how we react to it.",
      category: "Life",
    },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    {
      text: "It is never too late to be what you might have been.",
      category: "Motivation",
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      category: "Life",
    },
    { text: "The best revenge is massive success.", category: "Success" },
    {
      text: "You miss 100% of the shots you don’t take.",
      category: "Motivation",
    },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomQuoteBtn = document.getElementById("newQuote");
  const quoteContainer = document.getElementById("addQuoteFormContainer");
  const btnExportToJsonFile = document.getElementById("exportToJsonFile");
  const inputImportFile = document.getElementById("importFile");

  randomQuoteBtn.addEventListener("click", showRandomQuote);
  createAddQuoteForm();

  function showRandomQuote() {
    const randomIndx = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndx];
    quoteDisplay.innerHTML = `"${randomQuote.text}"-${randomQuote.category}`;
  }
  function createAddQuoteForm() {
    const form = document.createElement("form");

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.placeholder = "enter your quote";
    quoteInput.id = "quoteInput";
    form.appendChild(quoteInput);

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "enter your category here";
    categoryInput.id = "categoryInput";
    form.appendChild(categoryInput);

    const addQuoteBtn = document.createElement("button");
    addQuoteBtn.textContent = "add quote";
    addQuoteBtn.id = "addQuptebtn";
    form.appendChild(addQuoteBtn);

    quoteContainer.appendChild(form);

    addQuoteBtn.addEventListener("click", addQuote);
  }

  function addQuote() {
    const quoteInput = document.getElementById("quoteInput");
    const categoryInput = document.getElementById("categoryInput");

    const quoteText = quoteInput.value.trim();
    const categoryText = categoryInput.value.trim();

    if (quoteText !== "" && categoryText !== "") {
      quotes.push({ text: quoteText, category: categoryText });
      quoteInput.value = "";
      categoryInput.value = "";
      saveQuotes();
      alert("Quote added successfully!");
    } else {
      alert("Please fill out both fields.");
    }
  }
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  btnExportToJsonFile.addEventListener("click", exportToJsonFile);
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  inputImportFile.addEventListener("change", importFromJsonFile);
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Load last viewed quote from session storage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    quoteDisplay.innerHTML = lastViewedQuote;
  }
});
