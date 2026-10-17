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

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl)) //inicializando los popovers de boostrap

//aplicamos el event listener 
ArrayDepartamentos.forEach((departamento)=>{
   const id=departamento.id;
   const labelCirculo= document.querySelector(`circle#${id}`);
   const PopoverCirculo= new bootstrap.Popover(labelCirculo,{ trigger: 'manual', customClass: 'pequeño-popover', placement: 'top', html:true});
   departamento.addEventListener("mouseover",(event)=>{
      event.currentTarget.style.fill = "#040273";
      PopoverCirculo.show();
   });

   departamento.addEventListener("mouseout",(event)=>{
      event.currentTarget.style.fill = "";
      PopoverCirculo.hide();
   });
});

