import React from './react';
import ReactDOM from './react-dom';
// const root = ReactDOM.createRoot(document.getElementById('root'));
// let element = (
//   <div id="A1">
//     A1
//     <div id="B1">
//       B1
//       <div id="C1">C1</div>
//       <div id="C2">C2</div>
//     </div>
//     <div id="B2">B2</div>
//   </div>  
// )

let elementVDOM = React.createElement("div", {
  id: "A1"
}, "A1", React.createElement("div", {
  id: "B1"
}, "B1", React.createElement("div", {
  id: "C1"
}, "C1"), React.createElement("div", {
  id: "C2"
}, "C2")), React.createElement("div", {
  id: "B2"
}, "B2"));

console.log(elementVDOM);
ReactDOM.render(
  elementVDOM,
  document.getElementById('root')
);
