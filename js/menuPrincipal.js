//en base al svg declaramos los elementos de cada departamento con su id para hacerles el evento hoover
const SanMiguel = document.getElementById("SVSM");
const LaUnion = document.getElementById("SVUN");
const Morazan = document.getElementById("SVMO");
const Usulutan = document.getElementById("SVUS");
const SanSalvador = document.getElementById("SVSS");
const SanVicente = document.getElementById("SVSV");
const Cuscatlan = document.getElementById("SVCU");
const Cabañas = document.getElementById("SVCA");
const LaLibertad = document.getElementById("SVLI");
const Chalatenango = document.getElementById("SVCH");
const LaPaz = document.getElementById("SVPA");
const Sonsonate = document.getElementById("SVSO");
const Auchapan = document.getElementById("SVAH");
const SantaAna = document.getElementById("SVSA");


const ArrayDepartamentos = [SanMiguel,LaUnion,Morazan,SanSalvador,SanVicente,Cuscatlan,Cabañas,LaLibertad,Chalatenango,LaPaz,Sonsonate,Auchapan,SantaAna,Usulutan]; //los ponemos en array para poder aplicar en general con foreach

//const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
//const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl)) //inicializando los popovers de boostrap

//en celular no existe el hover, entonces el primer toque muestra el nombre y el segundo entra a la pagina
let departamentoActivo = null; //guarda el departamento que ya se toco una vez
let tipoPuntero = "mouse"; //se actualiza en pointerdown para saber si fue mouse o dedo

//guardamos los popovers por id para poder mostrarlos y ocultarlos desde cualquier funcion
const popovers = {};

function OcultarTodosLosPopovers(){
Object.values(popovers).forEach(ElementoPopover => {
      ElementoPopover.hide();
   });
}

function resaltar(departamento) {
   departamento.classList.add("resaltado-3d"); //agg nuestra clase al departamento que la hace ver 3d
   departamento.style.fill = "#F2F3F5";
   OcultarTodosLosPopovers();
   popovers[departamento.id].show();
}
 
function quitarResaltado(departamento) {
   departamento.style.fill = "";
   departamento.classList.remove("resaltado-3d"); //quitamos el 3d
   popovers[departamento.id].hide();
}
 
//aplicamos el event listener 
ArrayDepartamentos.forEach((departamento)=>{
   const id=departamento.id;
   const labelCirculo= document.querySelector(`circle#${id}`);
   popovers[id]= new bootstrap.Popover(labelCirculo,{ trigger: 'manual', customClass: 'pequeño-popover', placement: 'top', html:true, animation: false});
 
   departamento.addEventListener("pointerdown",(event)=>{
      tipoPuntero = event.pointerType;
   });
 
   //el hover solo se aplica con mouse, con el dedo no existe
   departamento.addEventListener("pointerenter",(event)=>{
      if (event.pointerType === "mouse") {
         resaltar(departamento);
      }
   });
 
   departamento.addEventListener("pointerleave",(event)=>{
      if (event.pointerType === "mouse") {
         quitarResaltado(departamento);
      }
   });
 
   //evento click que redirige a la pagina con la informacion
   departamento.addEventListener("click", () => {
      //con el dedo, si es el primer toque solo mostramos la informacion
      if (tipoPuntero !== "mouse" && departamentoActivo !== departamento) {
         if (departamentoActivo) {
            quitarResaltado(departamentoActivo);
            OcultarTodosLosPopovers();
         }
         departamentoActivo = departamento;
         resaltar(departamento);
         return;
      }
      window.location.href = `InfoDpto.html?depto=${id}`;
   });
});

//si tocan fuera de un departamento se quita la seleccion
document.addEventListener("click", (event)=>{
   if (departamentoActivo && !ArrayDepartamentos.includes(event.target)) {
      quitarResaltado(departamentoActivo);
      OcultarTodosLosPopovers();
      departamentoActivo = null;
   }
});