const config = {
  maxParticles: 12,    // Jumlah maksimal jejak bulan sabit
  fadeSpeed: 0.02,     // Kecepatan memudar 
  shrinkSpeed: 0.02,   // Kecepatan mengecil
  spawnDistance: 15,    // Jarak minimal kursor bergerak sebelum memunculkan partikel baru
}

let lastX = 0;
let lastY = 0;

const moonSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-tersier drop-shadow-[0_0_8px_rgba(224,242,254,0.8)]">
    <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
  </svg>
`
document.addEventListener('mousemove', (e) => {
  const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY)
  if (distance > config.spawnDistance) {
    createMoonParticle(e.clientX, e.clientY);
    lastX = e.clientX;
    lastY = e.clientY;
  }
})
function createMoonParticle(x, y) {
  const particle = document.createElement('div');
  const size = Math.random() * 12 + 16;
  const rotation = Math.random() * 360
  particle.className = 'fixed pointer-events-none z-50 transition-transform ease-out duration-75';
  particle.style.left = `${x - size / 2}px`;
  particle.style.top = `${y - size / 2}px`;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.transform = `rotate(${rotation}deg) scale(1)`;
  particle.style.opacity = '0.9'
  particle.innerHTML = moonSvg;
  document.body.appendChild(particle)
  let opacity = 0.9;
  let scale = 1
  const animate = () => {
    opacity -= config.fadeSpeed;
    scale -= config.shrinkSpeed
    if (opacity <= 0 || scale <= 0) {
      particle.remove();
    } else {
      particle.style.opacity = opacity;
      particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}


const menu_project = document.getElementById("menu_project");
const menu_webdev = document.getElementById("menu_webdev");
const menu_gamedev = document.getElementById("menu_gamedev");
const menu_mobiledev = document.getElementById("menu_mobiledev");
const project_item = document.getElementById("project_item");

const project_img_showcase = document.getElementById("project_img_showcase");
const project_name = document.getElementById("project_name");
const project_role = document.getElementById("project_role");
const project_type = document.getElementById("project_type");
const project_backend = document.getElementById("project_backend");
const project_frontend = document.getElementById("project_frontend");
const project_Year = document.getElementById("project_Year");
const project_description = document.getElementById("project_description");
const btn_demo = document.getElementById("btn-demo");
const btn_source = document.getElementById("btn-source");

let projectsData = [];
let activeFilter = "All";

fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    projectsData = data.project;
    renderProjects(projectsData);
    if (projectsData.length > 0) {
      updateShowcase(projectsData[0]);
    }
  })
  .catch((error) => {
    console.error("Gagal mengambil data JSON:", error);
  });

function renderProjects(items) {
  project_item.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "rounded bg-tersier p-2 rounded-xl cursor-pointer border-2 hover:border-third transition duration-200 hover:scale-105";
    
    const imgSrc = (item.img && item.img !== "asset/") ? item.img : "asset/veterina.png";

    card.innerHTML = `
      <div class="w-full h-20 md:h-26">
        <img src="${imgSrc}" alt="${item.nama}" class="w-full h-full rounded-lg object-cover" />
      </div>
      <div class="w-full flex justify-center items-center mt-2">
        <p class="text-sm md:text-base font-bold text-primary text-center line-clamp-1">${item.nama}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      updateShowcase(item);
    });

    project_item.appendChild(card);
  });
}

function updateShowcase(item) {
  project_name.textContent = item.nama;
  project_role.textContent = item.role;
  project_type.textContent = item.type;
  project_backend.textContent = item.backend;
  project_frontend.textContent = item.frontend;
  if (project_Year) {
    project_Year.textContent = item.year || "-";
  }
  project_description.textContent = item.description;
  
  if (btn_demo) {
    btn_demo.href = item.demo || "#";
  }
  if (btn_source) {
    btn_source.href = item.source || "#";
  }

  const imgSrc = (item.img && item.img !== "asset/") ? item.img : "asset/veterina.png";
  project_img_showcase.src = imgSrc;
}

function filterProjects(category) {
  activeFilter = category;
  updateActiveMenuUI();

  if (category === "All") {
    renderProjects(projectsData);
  } else {
    const filtered = projectsData.filter(p => p.type.toLowerCase() === category.toLowerCase());
    renderProjects(filtered);
  }
}

function updateActiveMenuUI() {
  const menus = [
    { el: menu_project, cat: "All" },
    { el: menu_webdev, cat: "Web" },
    { el: menu_gamedev, cat: "Game" },
    { el: menu_mobiledev, cat: "Mobile" }
  ];

  menus.forEach(({ el, cat }) => {
    if (el) {
      if (cat === activeFilter) {
        el.className = "text-white text-sm md:text-md cursor-pointer border-b border-white transition duration-200";
      } else {
        el.className = "text-slate-300 text-sm md:text-md cursor-pointer hover:border-b hover:text-white transition duration-200";
      }
    }
  });
}

if (menu_project) menu_project.addEventListener("click", () => filterProjects("All"));
if (menu_webdev) menu_webdev.addEventListener("click", () => filterProjects("Web"));
if (menu_gamedev) menu_gamedev.addEventListener("click", () => filterProjects("Game"));
if (menu_mobiledev) menu_mobiledev.addEventListener("click", () => filterProjects("Mobile"));