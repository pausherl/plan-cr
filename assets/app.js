"use strict";

/* ======= Datos del menú (Costa Rica) ======= */
const MENU = {
  "Lunes": {
    "Desayuno":"Huevos con espinaca + aguacate + café negro",
    "Snack AM":"Yogurt griego Dos Pinos sin azúcar + chía",
    "Almuerzo":"Pollo a la plancha + ensalada + frijol negro (1/2 taza)",
    "Snack PM":"Tiritas de chayote con limón",
    "Cena":"Tilapia al horno + brócoli + ayote sazón",
    "Antes de dormir":"Infusión de jengibre + yogurt"
  },
  "Martes": {
    "Desayuno":"Omelette con champiñón, cebolla y chile dulce + té verde",
    "Snack AM":"Nueces + fresas",
    "Almuerzo":"Corvina + ensalada fresca + brócoli al vapor",
    "Snack PM":"Zanahoria baby + té de jengibre",
    "Cena":"Pollo a la plancha + puré de coliflor",
    "Antes de dormir":"Manzanilla + kéfir"
  },
  "Miércoles": {
    "Desayuno":"Huevos duros + ensalada de aguacate y pepino + cúrcuma",
    "Snack AM":"Yogurt griego sin azúcar + linaza",
    "Almuerzo":"Res magra (lomito) + repollo morado salteado",
    "Snack PM":"Apio con limón y sal",
    "Cena":"Atún en agua salteado con vegetales + ensalada",
    "Antes de dormir":"Infusión de jengibre + yogurt"
  },
  "Jueves": {
    "Desayuno":"Tortilla de huevo + 1/2 aguacate + café negro",
    "Snack AM":"Almendras (6–8) + cas/mandarina",
    "Almuerzo":"Pollo con especias + ensalada + lenteja (1/2 taza)",
    "Snack PM":"Pepino y zanahoria rallada con limón",
    "Cena":"Sardina en agua + repollo + calabacín salteado",
    "Antes de dormir":"Té de cúrcuma + kéfir"
  },
  "Viernes": {
    "Desayuno":"Huevos con espinaca/kale y chile dulce + té verde",
    "Snack AM":"Yogurt griego + semillas mixtas",
    "Almuerzo":"Dorado a la plancha + ensalada con aguacate",
    "Snack PM":"Pepino con sal marina",
    "Cena":"Pollo al curry suave + vegetales al vapor",
    "Antes de dormir":"Infusión de jengibre + yogurt"
  },
  "Sábado": {
    "Desayuno":"Revueltos con tomate, cebolla y culantro + cúrcuma",
    "Snack AM":"Nueces + guayaba (porción pequeña)",
    "Almuerzo":"Salteado de pollo con vainica y chile dulce + ensalada",
    "Snack PM":"Manzanilla + bastones de apio",
    "Cena":"Corvina/tilapia + ensalada fresca + aguacate",
    "Antes de dormir":"Manzanilla + kéfir"
  },
  "Domingo": {
    "Desayuno":"Huevos duros + ensalada fresca + café o té",
    "Snack AM":"Yogurt griego sin azúcar + chía",
    "Almuerzo":"Pescado al horno + espinaca y zanahoria",
    "Snack PM":"Pepino y zanahoria baby con limón",
    "Cena":"Res magra + brócoli y coliflor",
    "Antes de dormir":"Infusión de cúrcuma + yogurt"
  }
};

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const MEAL_ORDER = ["Desayuno","Snack AM","Almuerzo","Snack PM","Cena","Antes de dormir"];

/* ===== Estado de filtros ===== */
let selectedDay = null;   // null = todos
let selectedMeal = null;  // null = todos

/* ===== Helpers ===== */
const grid = document.getElementById('grid');
const dayPills = document.getElementById('dayPills');
const mealPills = document.getElementById('mealPills');
const list = document.getElementById('shoppingList');
const themeBtn = document.getElementById('toggleTheme');

function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') n.className=v;
    else if(k.startsWith('aria-')) n.setAttribute(k,v);
    else if(k==='html') n.innerHTML=v;
    else n[k]=v;
  });
  children.forEach(c=>n.appendChild(c));
  return n;
}

/* ===== Render Cards ===== */
function render(){
  grid.innerHTML='';
  const days = DAYS.filter(d => !selectedDay || d===selectedDay);

  days.forEach(day=>{
    const meals = MENU[day] || {};
    const items = (selectedMeal ? [[selectedMeal, meals[selectedMeal]]] :
                   MEAL_ORDER.map(m=>[m, meals[m]])).filter(([_,v])=>Boolean(v));

    // si no hay nada para ese día, no dibujar tarjeta
    if(!items.length) return;

    const card = el('article',{class:'card'},[
      el('h3',{html:day}),
      ...items.map(([k,v]) => el('div',{},[ el('h4',{html:k}), el('p',{html:v}) ]))
    ]);
    grid.appendChild(card);
  });
}

/* ===== Pills (día y comida) ===== */
function clear(container){ while(container.firstChild) container.removeChild(container.firstChild); }

function buildPills(){
  clear(dayPills); clear(mealPills);

  // Días (siempre muestra los 7)
  const allD = el('button',{class:'pill',textContent:'Todos','aria-pressed':'true'});
  allD.onclick=()=>{ selectedDay=null; updatePressed(dayPills, allD); render(); };
  dayPills.appendChild(allD);
  DAYS.forEach(d=>{
    const b = el('button',{class:'pill',textContent:d,'aria-pressed':'false'});
    b.onclick=()=>{ selectedDay=d; updatePressed(dayPills, b); render(); };
    dayPills.appendChild(b);
  });

  // Comidas
  const allM = el('button',{class:'pill',textContent:'Todas','aria-pressed':'true'});
  allM.onclick=()=>{ selectedMeal=null; updatePressed(mealPills, allM); render(); };
  mealPills.appendChild(allM);
  MEAL_ORDER.forEach(m=>{
    const b = el('button',{class:'pill',textContent:m,'aria-pressed':'false'});
    b.onclick=()=>{ selectedMeal=m; updatePressed(mealPills, b); render(); };
    mealPills.appendChild(b);
  });
}

function updatePressed(container, activeBtn){
  [...container.querySelectorAll('.pill')].forEach(p=>p.setAttribute('aria-pressed','false'));
  activeBtn.setAttribute('aria-pressed','true');
}

/* ===== Lista de compras (simple) ===== */
const SHOP = {
  "Proteínas":["Pollo","Tilapia/Corvina","Atún/Sardina en agua","Res magra","Huevos","Frijol negro","Lenteja"],
  "Verduras":["Chayote","Ayote sazón","Brócoli","Coliflor","Vainica","Espinaca","Pepino","Chile dulce","Repollo","Culantro coyote"],
  "Frutas bajas azúcar":["Papaya","Guayaba","Cas","Mandarina","Fresa","Mora","Kiwi"],
  "Grasas saludables":["Aguacate","Aceite de oliva","Nueces/Almendras/Macadamia","Chía","Linaza"]
};
(function renderShopping(){
  if(!list) return;
  list.innerHTML='';
  Object.entries(SHOP).forEach(([c,items])=>{
    list.appendChild(el('li',{html:`<b>${c}:</b> ${items.join(', ')}`}));
  });
})();

/* ===== Tema con persistencia ===== */
function setTheme(theme){
  document.body.setAttribute('data-theme', theme);
  try{ localStorage.setItem('theme', theme); }catch{}
  if(themeBtn){ themeBtn.innerHTML = (theme === 'dark' ? '🌙 Tema' : '☀️ Tema'); }
}
(function initTheme(){
  const saved = (()=>{ try{return localStorage.getItem('theme');}catch{return null;} })();
  if(saved){ setTheme(saved); }
  else{
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
})();
themeBtn?.addEventListener('click', ()=>{
  const next = document.body.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
  setTheme(next);
});

/* Init */
buildPills();
render();

