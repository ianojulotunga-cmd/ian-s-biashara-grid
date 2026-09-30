// Edit this list to change what the shop sells. cat: kitchen | computer | electronics | service. Prices in KES.
const PRODUCTS = [
  {id:1,cat:"kitchen",name:"Air Fryer 4L",desc:"Crispy food with little oil.",price:8500,icon:"🍟"},
  {id:2,cat:"kitchen",name:"Electric Kettle 1.8L",desc:"Boils fast, auto shut-off.",price:1800,icon:"☕"},
  {id:3,cat:"kitchen",name:"Blender 600W",desc:"Smoothies, soups, sauces.",price:3200,icon:"🥤"},
  {id:4,cat:"kitchen",name:"Microwave 20L",desc:"Solo microwave, 6 power levels.",price:9500,icon:"🍲"},
  {id:5,cat:"computer",name:"Wireless Mouse",desc:"2.4GHz, silent clicks.",price:900,icon:"🖱️"},
  {id:6,cat:"computer",name:"Mechanical Keyboard",desc:"Blue switches, backlit.",price:4200,icon:"⌨️"},
  {id:7,cat:"computer",name:"USB-C Hub 7-in-1",desc:"HDMI, USB 3.0, SD card reader.",price:2800,icon:"🔌"},
  {id:8,cat:"computer",name:"Laptop Stand",desc:"Foldable aluminium, 6 heights.",price:1500,icon:"💻"},
  {id:9,cat:"electronics",name:"Bluetooth Speaker",desc:"Waterproof, 12-hour battery.",price:3500,icon:"🔊"},
  {id:10,cat:"electronics",name:"Power Bank 20000mAh",desc:"Fast charge, two USB ports.",price:3000,icon:"🔋"},
  {id:11,cat:"electronics",name:"Smart TV 32 inch",desc:"HD, Wi-Fi, built-in apps.",price:18500,icon:"📺"},
  {id:12,cat:"service",name:"Laptop Repair and Tune-up",desc:"Diagnosis and fix in 48 hours.",price:1500,icon:"🛠️"},
  {id:13,cat:"service",name:"Custom Website Build",desc:"Five-page responsive site.",price:15000,icon:"🌐"}
].map(p => ({...p, sku: "IBG-" + String(p.id).padStart(3, "0")}));
