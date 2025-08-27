const MENU = {
  "Lunes": {
    "Desayuno":"Huevos con espinaca + aguacate + café negro",
    "Snack AM":"Yogurt griego Dos Pinos sin azúcar + chía",
    "Almuerzo":"Pollo a la plancha + ensalada + frijol negro",
    "Snack PM":"Tiritas de chayote con limón",
    "Cena":"Tilapia al horno + brócoli + ayote sazón",
    "Antes de dormir":"Infusión de jengibre + yogurt"
  },
  "Martes": {
    "Desayuno":"Omelette con champiñón y chile dulce",
    "Snack AM":"Nueces + fresas",
    "Almuerzo":"Corvina + ensalada fresca",
    "Snack PM":"Zanahoria baby + té de jengibre",
    "Cena":"Pollo a la plancha + puré de coliflor",
    "Antes de dormir":"Manzanilla + kéfir"
  }
};
const MEAL_ORDER = ["Desayuno","Snack AM","Almuerzo","Snack PM","Cena","Antes de dormir"];
const SHOP = {
  "Proteínas":["Pollo","Tilapia","Corvina","Huevos","Frijol negro"],
  "Verduras":["Chayote","Ayote","Brócoli","Espinaca","Chile dulce","Pepino"],
  "Frutas":["Papaya","Guayaba","Cas","Mandarina","Fresa"],
  "Grasas":["Aguacate","Aceite de oliva","Nueces","Chía","Linaza"]
};

let selectedDay=null, selectedMeal=null;
const grid=document.getElementById('grid');
const dayPills=document.getElementById('dayPills');
const mealPills=document.getElementById('mealPills');
const list=document.getElementById('shoppingList');

function el(tag,attrs={},children=[]){
  const n=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class')n.className=v; else if(k==='html')n.innerHTML=v; else n[k]=v;
  });
  children.forEach(c=>n.appendChild(c));return n;
}
function render(){
  grid.innerHTML='';
  const days=Object.keys(MENU).filter(d=>!selectedDay||d===selectedDay);
  days.forEach(day=>{
    const meals=MENU[day];
    const items=(selectedMeal?[[selectedMeal,meals[selectedMeal]]]:
                MEAL_ORDER.map(m=>[m,meals[m]])).filter(([k,v])=>v);
    if(!items.length)return;
    const card=el('div',{class:'card'},[
      el('h3',{html:day}),
      ...items.map(([k,v])=>el('div',{},[
        el('h4',{html:k}),el('p',{html:v})
      ]))
    ]);
    grid.appendChild(card);
  });
}
function buildPills(){
  const allD=el('button',{class:'pill',textContent:'Todos','aria-pressed':'true'});
  allD.onclick=()=>{selectedDay=null;update(dayPills,allD);render();};
  dayPills.appendChild(allD);
  Object.keys(MENU).forEach(d=>{
    const b=el('button',{class:'pill',textContent:d,'aria-pressed':'false'});
    b.onclick=()=>{selectedDay=d;update(dayPills,b);render();};
    dayPills.appendChild(b);
  });
  const allM=el('button',{class:'pill',textContent:'Todas','aria-pressed':'true'});
  allM.onclick=()=>{selectedMeal=null;update(mealPills,allM);render();};
  mealPills.appendChild(allM);
  MEAL_ORDER.forEach(m=>{
    const b=el('button',{class:'pill',textContent:m,'aria-pressed':'false'});
    b.onclick=()=>{selectedMeal=m;update(mealPills,b);render();};
    mealPills.appendChild(b);
  });
}
function update(container,active){[...container.querySelectorAll('.pill')].forEach(p=>p.setAttribute('aria-pressed','false'));active.setAttribute('aria-pressed','true');}
function renderShopping(){
  list.innerHTML='';Object.entries(SHOP).forEach(([c,it])=>{list.appendChild(el('li',{html:`<b>${c}:</b> ${it.join(', ')}`}));});
}
document.getElementById('toggleTheme').onclick=()=>{document.body.dataset.theme=document.body.dataset.theme==='dark'?'light':'dark';};
document.getElementById('copyList').onclick=()=>{navigator.clipboard.writeText(Object.entries(SHOP).map(([c,i])=>`• ${c}: ${i.join(', ')}`).join('\\n'));};
buildPills();render();renderShopping();
