const grids = document.querySelectorAll(".grid");
const headings = document.querySelectorAll(".heading .wrapper .text");
const titles = document.querySelectorAll("h2");
const goBottom = document.querySelector(".more");
const indicators = document.querySelectorAll(".indicator");

const colors = ["#c28b00", "#618C7B", "#0076D3", "#407a57"];
let images = [];

function resetIndicator() {
  indicators.forEach((el) => {
    el.style.background = "rgb(225, 225, 225)";
  });
}

async function fetchImages(searchTerm) {
  images = [];
  console.log(searchTerm);
  const results = await fetch(
    `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=35`,
    {
      method: "GET",
      headers: {
        Authorization:
          "563492ad6f91700001000001c7d547df23314bd68654215ab42128bf",
      },
    }
  );
  const photos = await results.json();
  photos.photos.map((item) => {
    images.push(item.src.medium);
  });
}

async function enterScreen(index) {
  const grid = grids[index];
  const heading = headings[index];
  const gridColumns = grid.querySelectorAll(".column");
  const gridItems = grid.querySelectorAll(".column > .item");

  grid.classList.add("active");

  resetIndicator();

  indicators[index].style.background = colors[index];
  heading.style.color = colors[index];
  goBottom.style.background = colors[index];

  await fetchImages(titles[index].dataset.category);

  grid.classList.add("active");

  gridItems.forEach((item, index) => {
    item.style.background = `url(${images[index]}) no-repeat center`;
    item.style.backgroundSize = "cover";
  });

  gridColumns.forEach((element) => {
    element.classList.remove("animate-before", "animate-after");
  });

  heading.classList.remove("animate-before", "animate-after");
}

function exitScreen(index, exitDelay) {
  const grid = grids[index];
  const heading = headings[index];
  const gridColumns = grid.querySelectorAll(".column");

  gridColumns.forEach((element) => {
    element.classList.add("animate-after");
  });

  heading.classList.add("animate-after");

  setTimeout(() => {
    grid.classList.remove("active");
  }, exitDelay);
}

function setupAnimationCycle({ timePerScreen, exitDelay }) {
  const cycleTime = timePerScreen + exitDelay;
  let nextIndex = 0;

  function nextCycle() {
    const currentIndex = nextIndex;

    enterScreen(currentIndex);

    setTimeout(() => exitScreen(currentIndex, exitDelay), timePerScreen);

    nextIndex = nextIndex >= grids.length - 1 ? 0 : nextIndex + 1;
  }

  nextCycle();

  setInterval(nextCycle, cycleTime);
}

// Scroll to bottom of the page
goBottom.addEventListener("click", () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

// hide bottom overlay on button
window.onscroll = () => {
  let y = window.pageYOffset;
  if (y > 5) {
    document.querySelector(".bottom").style.opacity = 0;
    goBottom.style.opacity = 0;
    return;
  }
  document.querySelector(".bottom").style.opacity = 1;
  goBottom.style.opacity = 1;
};

setupAnimationCycle({
  timePerScreen: 5000, // ms
  exitDelay: 200 * 7, // ms
});
