export function setIndexDetails() {
  const elementsWithDataId = Array.from(document.querySelectorAll("[data-id]"));
  elementsWithDataId.forEach((element) => {
    const dataId = element.dataset.id;

    if (document.querySelector(".modal")) {
      setModalDetails(dataId);
    } else {
      setGeneralDetails(dataId);
    }
  });
}

async function setGeneralDetails(modelID) {
  try {
    const response = await fetch(`./json/${modelID}.json`);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();

    const element = document.querySelector(`[data-id="${modelID}"]`);

    if (element) {
      element.querySelector(".product-name").textContent =
        data.general_details.name || "N/A";
      element.querySelector(".current-price").textContent =
        data.general_details.price + " €" || "N/A";
      element.querySelector(".original-price").textContent =
        data.general_details.original_price + " €" || "N/A";
    } else {
      console.warn(`Element with data-id="${modelID}" not found.`);
    }
  } catch (error) {
    console.error(
      `Error setting general details for modelID: ${modelID}`,
      error
    );
  }
}

export async function setModalDetails(modelID) {
  const response = await fetch(`./json/${modelID}.json`);

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  const data = await response.json();

  const parent = document.querySelector(".details-info");

  const elementsData = [
    { selector: ".brand", value: data.general_details.brand || "N/A" },
    { selector: ".stock", value: data.general_details.stock || "N/A" },
    { selector: ".category", value: data.category || "N/A" },
    { selector: ".dimensions-length", value: data.dimensions.length || "N/A" },
    { selector: ".dimensions-width", value: data.dimensions.width || "N/A" },
    { selector: ".dimensions-height", value: data.dimensions.height || "N/A" },
    { selector: ".weight", value: data.weight || "N/A" },
    { selector: ".warranty", value: data.warranty || "N/A" },
    { selector: ".shipping", value: data.shipping || "N/A" },
    { selector: ".return_policy", value: data.return_policy || "N/A" },
    { selector: ".rating", value: data.customer_reviews.rating || "N/A" },
    {
      selector: ".review_count",
      value: data.customer_reviews.review_count || "N/A",
    },
    { selector: ".current-price", value: data.general_details.price || "N/A" },
  ];

  Array.from(parent.querySelectorAll(".product-name")).map(
    (elem) => (elem.textContent = data.general_details.name || "N/A")
  );

  elementsData.forEach(({ selector, value }) => {
    const el = parent.querySelector(selector);
    if (el) {
      el.textContent = value;
    }
  });

  if (modelID != "cand") {
    document.querySelector('[data-id="colors"]').style.display = "none";
  }

  fetch(`json/${modelID}_imgs.json`)
    .then((response) => response.json())
    .then((data) => {
      const images = data.imagePaths;
      images.forEach((imgPath, i) => {
        createCarouselItems(modelID, imgPath, i);
        createCarouselIndicators(i);
      });
    });
}

function createCarouselIndicators(i) {
  const indicatorBtn = document.createElement("button");
  indicatorBtn.type = "button";
  indicatorBtn.setAttribute("data-bs-target", "#productImageCarousel");
  indicatorBtn.setAttribute("data-bs-slide-to", i);
  if (i === 0) {
    indicatorBtn.classList.add("active");
    indicatorBtn.setAttribute("aria-current", "true");
  }
  indicatorBtn.setAttribute("aria-label", `Slide ${i + 1}`);
  document.querySelector(".carousel-indicators").appendChild(indicatorBtn);
}

function createCarouselItems(modelID, imgPath, i) {
  const carouselItem = document.createElement("div");
  carouselItem.classList.add("carousel-item");
  if (i === 0) carouselItem.classList.add("active");

  const img = document.createElement("img");
  img.src = `./public/imgs/${modelID}/${imgPath}`;
  img.classList.add("d-block", "w-100");

  carouselItem.appendChild(img);
  document.querySelector(".carousel-inner").appendChild(carouselItem);
}
